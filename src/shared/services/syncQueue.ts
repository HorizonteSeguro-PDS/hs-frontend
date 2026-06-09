import { signal, computed } from '@preact/signals';
import { db, type PendingRequest } from '@/db/database';

// ─── Reactive state ───────────────────────────────────────────────────────────

export const isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
export const pendingCount = signal(0);
export const connectionLabel = computed(() =>
  isOnline.value
    ? 'Online'
    : pendingCount.value > 0
      ? `Offline (${pendingCount.value} pendente${pendingCount.value > 1 ? 's' : ''})`
      : 'Offline',
);

async function refreshPendingCount() {
  pendingCount.value = await db.pendingRequests.where('status').anyOf(['pending', 'retrying']).count();
}

// ─── Retry config ─────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 30_000;

function backoffDelay(attempt: number): number {
  const exp = Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
  return exp + Math.random() * exp * 0.2; // +20% jitter
}

function isRetryable(status: number): boolean {
  // 4xx except timeout/rate-limit are permanent failures
  if (status >= 400 && status < 500 && status !== 408 && status !== 429) return false;
  return true;
}

// ─── Queue a write for later ──────────────────────────────────────────────────

export async function enqueueRequest(
  url: string,
  method: PendingRequest['method'],
  body: unknown,
  headers: Record<string, string>,
): Promise<void> {
  await db.pendingRequests.add({
    url,
    method,
    body: JSON.stringify(body),
    headers,
    created_at: new Date().toISOString(),
    attempts: 0,
    status: 'pending',
    last_error: null,
  });
  await refreshPendingCount();
}

// ─── Drain the queue ──────────────────────────────────────────────────────────

async function flushQueue(): Promise<void> {
  const items = await db.pendingRequests
    .where('status')
    .anyOf(['pending', 'retrying'])
    .sortBy('created_at');

  for (const item of items) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
        signal: AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        await db.pendingRequests.delete(item.id!);
        window.dispatchEvent(new CustomEvent('hs:sync-complete'));
      } else if (!isRetryable(res.status)) {
        await db.pendingRequests.update(item.id!, { status: 'failed', last_error: `HTTP ${res.status}` });
      } else {
        const attempts = item.attempts + 1;
        if (attempts >= MAX_ATTEMPTS) {
          await db.pendingRequests.update(item.id!, { status: 'failed', attempts, last_error: `Max tentativas (${MAX_ATTEMPTS})` });
        } else {
          await db.pendingRequests.update(item.id!, { status: 'retrying', attempts, last_error: `HTTP ${res.status}` });
          await new Promise((r) => setTimeout(r, backoffDelay(attempts)));
        }
      }
    } catch (err) {
      const attempts = item.attempts + 1;
      const last_error = err instanceof Error ? err.message : String(err);
      if (attempts >= MAX_ATTEMPTS) {
        await db.pendingRequests.update(item.id!, { status: 'failed', attempts, last_error });
      } else {
        await db.pendingRequests.update(item.id!, { status: 'retrying', attempts, last_error });
      }
    }
  }

  await refreshPendingCount();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initConnectionListener(): void {
  window.addEventListener('online', () => {
    isOnline.value = true;
    flushQueue();
  });
  window.addEventListener('offline', () => {
    isOnline.value = false;
  });

  // Flush any leftovers from a previous session on startup
  if (navigator.onLine) flushQueue();
  refreshPendingCount();
}
