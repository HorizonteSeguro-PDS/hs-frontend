interface CrisisFilterButtonProps {
  onClick: () => void
  activeCount?: number
}

const borderGradient = 'bg-linear-to-b from-[#3555A3] to-[#1FA6A0]'

export default function CrisisFilterButton({ onClick, activeCount = 0 }: CrisisFilterButtonProps) {
  return (
    <span className={`inline-block rounded-lg p-px ${borderGradient}`}>
      <button type="button" onClick={onClick} className="btn gap-2 rounded-lg border-none bg-white text-[#2F7DBB] relative">
        Filtrar
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#1FA6A0] text-[10px] font-bold text-white flex items-center justify-center leading-none">
            {activeCount}
          </span>
        )}
        <ChevronDownIcon />
      </button>
    </span>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
