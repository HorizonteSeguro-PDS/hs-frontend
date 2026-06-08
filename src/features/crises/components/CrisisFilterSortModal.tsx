import { useState } from 'preact/hooks'

interface CrisisFilterSortModalProps {
  open: boolean
  onClose: () => void
  onSelect: (criterion: SortCriterion) => void
}

type SortCriterion = 'severity' | 'name' | 'occupancy' | 'shelters' | 'active'

interface SortOption {
  value: SortCriterion
  label: string
  description: string
}

const sortOptions: SortOption[] = [
  { value: 'severity', label: 'Por: Severidade', description: 'Ordena por nível de urgência' },
  { value: 'name', label: 'Por: Nome', description: 'Ordena alfabeticamente' },
  { value: 'occupancy', label: 'Por: Ocupação', description: 'Ordena por taxa de ocupação' },
  { value: 'shelters', label: 'Por: Abrigos', description: 'Ordena por número de abrigos' },
  { value: 'active', label: 'Por: Ativos', description: 'Ordena por atividade da crise' },
]

export default function CrisisFilterSortModal({ open, onClose, onSelect }: CrisisFilterSortModalProps) {
  const [selected, setSelected] = useState<SortCriterion>('severity')

  if (!open) return null

  function handleSelect(value: SortCriterion) {
    setSelected(value)
    onSelect(value)
    onClose()
  }

  return (
    <>
      <button type="button" aria-label="Fechar filtro" onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
      <div className="absolute left-0 top-full z-50 mt-2 w-72 [overflow:clip] rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-neutral shadow-xl">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <FunnelIcon />
            <h2 className="text-base font-semibold text-white">Filtrar e Ordenar</h2>
          </div>
          <p className="mt-1 text-xs text-white/70">Selecione um critério de ordenação</p>
        </div>

        <ul className="rounded-b-2xl bg-white">
          {sortOptions.map((option, index) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-start gap-2 border-b border-dotted border-[#0A0A0A26] p-3 text-left ${
                  index === sortOptions.length - 1 ? 'rounded-b-2xl' : ''
                } ${selected === option.value ? 'bg-[#1FA6A00D]' : ''}`}
              >
                <RadioMark active={selected === option.value} />
                <span>
                  <span className={`block text-sm font-semibold ${selected === option.value ? 'text-[#1FA6A0]' : 'text-black'}`}>
                    {option.label}
                  </span>
                  <span className="block text-xs text-[#0A0A0A80]">{option.description}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function RadioMark({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1FA6A0] text-white">
        <CheckIcon />
      </span>
    )
  }

  return <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full border-2 border-[#0A0A0A33]" />
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function FunnelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 19 18" fill="none" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.49937 14.9997C7.4993 15.1545 7.54238 15.3064 7.62378 15.4381C7.70518 15.5698 7.82168 15.6763 7.96021 15.7455L9.62687 16.5788C9.75395 16.6423 9.89516 16.6723 10.0371 16.6659C10.179 16.6594 10.3169 16.6168 10.4377 16.5421C10.5586 16.4674 10.6583 16.363 10.7274 16.2389C10.7965 16.1148 10.8328 15.9751 10.8327 15.833V9.99967C10.8329 9.58666 10.9864 9.18843 11.2635 8.88217L17.2827 2.22467C17.3906 2.10514 17.4615 1.95691 17.487 1.79791C17.5124 1.63891 17.4912 1.47595 17.426 1.32874C17.3607 1.18152 17.2542 1.05636 17.1194 0.968384C16.9845 0.880408 16.8271 0.833388 16.666 0.833008H1.66604C1.50488 0.833066 1.34719 0.879854 1.21208 0.967705C1.07697 1.05556 0.970232 1.1807 0.904795 1.32798C0.839357 1.47525 0.818029 1.63835 0.843395 1.7975C0.86876 1.95665 0.93973 2.10503 1.04771 2.22467L7.06854 8.88217C7.34565 9.18843 7.49919 9.58666 7.49937 9.99967V14.9997Z" />
    </svg>
  )
}
