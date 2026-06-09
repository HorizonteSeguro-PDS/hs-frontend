import { db } from '@/db/database';
import { isOnline, enqueueRequest } from '@/shared/services/syncQueue';
import type { Table } from 'dexie';

// ─── Generic offline-aware GET ────────────────────────────────────────────────
// Tries the network first. On success writes result into the Dexie table.
// If offline (or network fails), returns the cached Dexie data instead.

export async function fetchWithCache<T>(
  url: string,
  headers: Record<string, string>,
  table: Table<T, string>,
  cacheKey?: string,        // if provided, fetches a single record by key
  indexQuery?: () => Promise<T[]>, // custom Dexie query for array results
): Promise<T | T[]> {
  if (isOnline.value) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
      if (res.ok) {
        const data: T | T[] = await res.json();

        // Write to Dexie
        if (Array.isArray(data)) {
          await table.bulkPut(data);
        } else if (data && typeof data === 'object') {
          await table.put(data);
        }

        return data;
      }
    } catch {
      // Network error → fall through to cache
    }
  }

  // Offline fallback
  if (cacheKey) {
    const cached = await table.get(cacheKey);
    if (cached) return cached;
    throw new Error('Sem conexão e nenhum dado em cache.');
  }

  if (indexQuery) return indexQuery();

  return table.toArray();
}

// ─── Offline-aware mutation (POST/PUT/PATCH/DELETE) ───────────────────────────
// If online, fires immediately. If offline, enqueues for later sync.

export async function mutateOffline(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body: unknown,
  headers: Record<string, string>,
): Promise<Response | null> {
  if (isOnline.value) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return res;
    } catch {
      // Network error → enqueue
    }
  }

  await enqueueRequest(url, method, body, headers);
  return null; // caller should handle null as "queued offline"
}

// ─── Helpers for common cache reads ──────────────────────────────────────────

export async function getCachedCrises() {
  return db.crises.toArray();
}

export async function getCachedShelters(crisisId?: string) {
  if (crisisId) {
    const links = await db.crisesShelters.where('crisis_id').equals(crisisId).toArray();
    const shelterIds = links.map((l) => l.shelter_id);
    return db.shelters.where('id').anyOf(shelterIds).toArray();
  }
  return db.shelters.toArray();
}

export async function getCachedResourceCategories(lotCategory?: string) {
  if (lotCategory) {
    return db.resourceCategories.where('lot_category').equals(lotCategory).toArray();
  }
  return db.resourceCategories.toArray();
}

export async function getCachedInventory(shelterId: string) {
  return db.inventoryItems.where('shelter_id').equals(shelterId).toArray();
}

export async function getCachedStays(shelterId: string, activeOnly = true) {
  const query = db.shelterStays.where('shelter_id').equals(shelterId);
  const all = await query.toArray();
  return activeOnly ? all.filter((s) => s.checked_out_at === null) : all;
}
