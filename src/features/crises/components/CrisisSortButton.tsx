interface CrisisSortButtonProps {
  onClick: () => void
}

const borderGradient = 'bg-linear-to-b from-[#3555A3] to-[#1FA6A0]'

export default function CrisisSortButton({ onClick }: CrisisSortButtonProps) {
  return (
    <span className={`inline-block rounded-lg p-px ${borderGradient}`}>
      <button type="button" onClick={onClick} className="btn gap-2 rounded-lg border-none bg-white text-[#2F7DBB]">
        Ordenar
        <ArrowUpDownIcon />
      </button>
    </span>
  )
}

function ArrowUpDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  )
}
