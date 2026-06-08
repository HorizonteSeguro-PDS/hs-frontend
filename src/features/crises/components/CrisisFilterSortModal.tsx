import { useState } from 'preact/hooks'
import type { FilterConfig } from '../types'

interface CrisisFilterModalProps {
  onClose: () => void
  filterConfig: FilterConfig
  onApply: (config: FilterConfig) => void
  availableStates: string[]
}

const severityLabels: Record<number, string> = {
  1: 'Muito Baixa',
  2: 'Baixa',
  3: 'Média',
  4: 'Alta',
  5: 'Crítica',
}

export default function CrisisFilterModal({
  onClose,
  filterConfig,
  onApply,
  availableStates,
}: CrisisFilterModalProps) {
  const [config, setConfig] = useState<FilterConfig>(filterConfig)

  function handleApply() {
    onApply(config)
    onClose()
  }

  function handleClear() {
    const cleared: FilterConfig = { status: 'all', severities: [], states: [] }
    setConfig(cleared)
    onApply(cleared)
    onClose()
  }

  function toggleSeverity(level: number) {
    setConfig((prev) => ({
      ...prev,
      severities: prev.severities.includes(level)
        ? prev.severities.filter((s) => s !== level)
        : [...prev.severities, level],
    }))
  }

  function toggleState(state: string) {
    setConfig((prev) => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter((s) => s !== state)
        : [...prev.states, state],
    }))
  }

  return (
    <>
      <button
        type="button"
        aria-label="Fechar filtro"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />
      <div className="absolute left-0 top-full z-50 mt-2 w-80 [overflow:clip] rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-neutral shadow-xl">
        {/* Header */}
        <div className="p-3">
          <div className="flex items-center gap-2">
            <FunnelIcon />
            <h2 className="text-base font-semibold text-white">Filtrar crises</h2>
          </div>
          <p className="mt-1 text-xs text-white/70">Selecione os critérios de filtragem</p>
        </div>

        {/* Body */}
        <div className="bg-white max-h-[60vh] overflow-y-auto">
          {/* Status */}
          <div className="p-3 border-b border-dotted border-[#0A0A0A26]">
            <p className="text-xs font-bold text-[#0A0A0A80] uppercase tracking-wide mb-2">Status</p>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive'] as const).map((s) => {
                const label = s === 'all' ? 'Todas' : s === 'active' ? 'Ativa' : 'Inativa'
                const active = config.status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, status: s }))}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors border cursor-pointer ${
                      active
                        ? 'bg-[#1FA6A0] text-white border-[#1FA6A0]'
                        : 'bg-white text-[#0a0a0a] border-black/15 hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Severity */}
          <div className="p-3 border-b border-dotted border-[#0A0A0A26]">
            <p className="text-xs font-bold text-[#0A0A0A80] uppercase tracking-wide mb-2">Severidade</p>
            <div className="flex flex-col gap-1">
              {[1, 2, 3, 4, 5].map((level) => {
                const checked = config.severities.includes(level)
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleSeverity(level)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                      checked ? 'bg-[#1FA6A00D]' : 'hover:bg-[#f3f4f6]'
                    }`}
                  >
                    <CheckboxMark checked={checked} />
                    <span className={`text-sm font-semibold ${checked ? 'text-[#1FA6A0]' : 'text-black'}`}>
                      {severityLabels[level]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* States */}
          {availableStates.length > 1 && (
            <div className="p-3 border-b border-dotted border-[#0A0A0A26]">
              <p className="text-xs font-bold text-[#0A0A0A80] uppercase tracking-wide mb-2">Estado</p>
              <div className="flex flex-col gap-1">
                {availableStates.map((state) => {
                  const checked = config.states.includes(state)
                  return (
                    <button
                      key={state}
                      type="button"
                      onClick={() => toggleState(state)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                        checked ? 'bg-[#1FA6A00D]' : 'hover:bg-[#f3f4f6]'
                      }`}
                    >
                      <CheckboxMark checked={checked} />
                      <span className={`text-sm font-semibold ${checked ? 'text-[#1FA6A0]' : 'text-black'}`}>
                        {state}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 bg-white rounded-b-[14px] px-3 py-2.5">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-[#0A0A0A80] hover:text-[#0a0a0a] transition-colors"
          >
            Limpar filtros
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn btn-sm border-none bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white text-xs"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  )
}

function CheckboxMark({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#1FA6A0] text-white">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    )
  }
  return <span className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-[#0A0A0A33]" />
}

function FunnelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 19 18" fill="none" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.49937 14.9997C7.4993 15.1545 7.54238 15.3064 7.62378 15.4381C7.70518 15.5698 7.82168 15.6763 7.96021 15.7455L9.62687 16.5788C9.75395 16.6423 9.89516 16.6723 10.0371 16.6659C10.179 16.6594 10.3169 16.6168 10.4377 16.5421C10.5586 16.4674 10.6583 16.363 10.7274 16.2389C10.7965 16.1148 10.8328 15.9751 10.8327 15.833V9.99967C10.8329 9.58666 10.9864 9.18843 11.2635 8.88217L17.2827 2.22467C17.3906 2.10514 17.4615 1.95691 17.487 1.79791C17.5124 1.63891 17.4912 1.47595 17.426 1.32874C17.3607 1.18152 17.2542 1.05636 17.1194 0.968384C16.9845 0.880408 16.8271 0.833388 16.666 0.833008H1.66604C1.50488 0.833066 1.34719 0.879854 1.21208 0.967705C1.07697 1.05556 0.970232 1.1807 0.904795 1.32798C0.839357 1.47525 0.818029 1.63835 0.843395 1.7975C0.86876 1.95665 0.93973 2.10503 1.04771 2.22467L7.06854 8.88217C7.34565 9.18843 7.49919 9.58666 7.49937 9.99967V14.9997Z" />
    </svg>
  )
}
