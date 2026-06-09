import { useState } from 'preact/hooks'
import type { SortConfig, SortField } from '../types'

interface CrisisSortModalProps {
  open: boolean
  onClose: () => void
  currentConfig: SortConfig
  onApply: (config: SortConfig) => void
}

const fieldOptions: { value: SortField; label: string }[] = [
  { value: 'severity', label: 'Severidade' },
  { value: 'crisis_name', label: 'Nome' },
  { value: 'start_date', label: 'Data de início' },
  { value: 'shelters_count', label: 'Número de abrigos' },
  { value: 'active', label: 'Status (ativa/inativa)' },
]

export default function CrisisSortModal({ open, onClose, currentConfig, onApply }: CrisisSortModalProps) {
  const [config, setConfig] = useState<SortConfig>(currentConfig)

  if (!open) return null

  function handleApply() {
    onApply(config)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm [overflow:clip] rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-neutral shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SortIcon />
              <h2 className="text-base font-semibold text-white">Ordenar crises</h2>
            </div>
            <button type="button" onClick={onClose} className="text-white/80 hover:text-white">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">Ordenar por</label>
            <div className="flex flex-col gap-1.5">
              {fieldOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, field: opt.value }))}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    config.field === opt.value
                      ? 'bg-[#1FA6A00D] border border-[#1FA6A0]'
                      : 'border border-transparent bg-[#f3f4f6] hover:bg-[#eceef2]'
                  }`}
                >
                  <RadioMark active={config.field === opt.value} />
                  <span className={config.field === opt.value ? 'font-semibold text-[#1FA6A0]' : 'text-[#0a0a0a]'}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">Direção</label>
            <div className="flex gap-2">
              {(['asc', 'desc'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, direction: dir }))}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors border cursor-pointer ${
                    config.direction === dir
                      ? 'bg-[#1FA6A0] text-white border-[#1FA6A0]'
                      : 'bg-white text-[#0a0a0a] border-black/10 hover:bg-[#f3f4f6]'
                  }`}
                >
                  {dir === 'asc' ? 'Crescente' : 'Decrescente'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 bg-white px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn border-none bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white shadow-[0_4px_6px_-4px_rgba(31,166,160,0.30)]"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}

function RadioMark({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1FA6A0] text-white">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    )
  }
  return <span className="h-5 w-5 shrink-0 rounded-full border-2 border-[#0A0A0A33]" />
}

function SortIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 18 18" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
