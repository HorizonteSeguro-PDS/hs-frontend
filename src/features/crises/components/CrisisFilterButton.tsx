interface CrisisFilterButtonProps {
  onClick: () => void
}

const borderGradient = 'bg-linear-to-b from-[#3555A3] to-[#1FA6A0]'

export default function CrisisFilterButton({ onClick }: CrisisFilterButtonProps) {
  return (
    <span className={`inline-block rounded-lg p-px ${borderGradient}`}>
      <button type="button" onClick={onClick} className="btn gap-2 rounded-lg border-none bg-white text-[#2F7DBB]">
        Filtrar
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
