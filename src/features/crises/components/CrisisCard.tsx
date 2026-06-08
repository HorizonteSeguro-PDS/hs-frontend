import { Link } from 'wouter-preact'
import type { Crisis } from '../types'

interface CrisisCardProps {
  crisis: Crisis
}

const severityConfig: Record<number, { label: string; badgeColor: string; badgeBg: string; borderColor: string }> = {
  1: { label: 'Muito Baixa', badgeColor: '#0d9488', badgeBg: '#ccfbf1', borderColor: '#14b8a6' },
  2: { label: 'Baixa',       badgeColor: '#16a34a', badgeBg: '#dcfce7', borderColor: '#22c55e' },
  3: { label: 'Média',       badgeColor: '#b45309', badgeBg: '#fef3c7', borderColor: '#f59e0b' },
  4: { label: 'Alta',        badgeColor: '#dc2626', badgeBg: '#fee2e2', borderColor: '#ef4444' },
  5: { label: 'Crítica',     badgeColor: '#991b1b', badgeBg: '#fecaca', borderColor: '#b91c1c' },
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export default function CrisisCard({ crisis }: CrisisCardProps) {
  const sev = severityConfig[crisis.severity] ?? severityConfig[4]
  const inactive = !crisis.active

  const cardStyle = inactive
    ? { border: '1px solid #e5e7eb' }
    : { border: '1px solid #e5e7eb', borderLeftColor: sev.borderColor, borderLeftWidth: '4px' }

  const textMuted = inactive ? 'text-[#9ca3af]' : 'text-[#717182]'
  const titleColor = inactive ? 'text-[#9ca3af]' : 'text-[#0a0a0a]'
  const statusColor = inactive ? 'text-[#9ca3af]' : 'text-[#0a0a0a]'

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm" style={cardStyle}>
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-bold text-lg leading-tight line-clamp-2 flex-1 ${titleColor}`}>
          {crisis.crisis_name}
        </h3>
        {inactive ? (
          <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide text-[#9ca3af] bg-[#f3f4f6]">
            Inativo
          </span>
        ) : (
          <span
            className="shrink-0 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
            style={{ color: sev.badgeColor, backgroundColor: sev.badgeBg }}
          >
            {sev.label}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <div className={`flex items-center gap-2.5 text-sm ${textMuted}`}>
          <LocationIcon />
          <span>{crisis.city}, {crisis.state}</span>
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${textMuted}`}>
          <CalendarIcon />
          <span>Iniciada em {formatDate(crisis.start_date)}</span>
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${textMuted}`}>
          <ShelterIcon />
          <span>{crisis.shelters_count} {crisis.shelters_count === 1 ? 'abrigo cadastrado' : 'abrigos cadastrados'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${inactive ? 'bg-[#9ca3af]' : 'bg-[#22c55e]'}`} />
          <span className={`text-sm font-medium ${statusColor}`}>
            {inactive ? 'Inativa' : 'Ativa'}
          </span>
        </div>
        {inactive ? (
          <Link
            href="/crise/overview"
            className="btn btn-sm rounded-xl bg-white border border-[#d1d5db] text-[#9ca3af] font-semibold px-4 text-sm hover:bg-[#f9fafb]"
          >
            Ver detalhes
          </Link>
        ) : (
          <Link
            href="/crise/overview"
            className="btn btn-sm rounded-xl border-none text-white font-semibold px-4 text-sm"
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
          >
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  )
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="shrink-0">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function ShelterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="shrink-0">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
