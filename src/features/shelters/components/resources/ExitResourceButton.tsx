interface ExitResourceButtonProps {
  onClick: () => void
}

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(221deg,#F68B5E_37.79%,#F5B84B_90.47%,#E75D5C_143.16%)] shadow-[0_10px_15px_0_rgba(31,166,160,0.30),0_4px_6px_0_rgba(31,166,160,0.30)]'

export default function ExitResourceButton({ onClick }: ExitResourceButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`btn btn-sm h-9 min-h-9 flex items-center gap-1.5 border-none px-3.5 text-white ${buttonGradient}`}>
      <MinusIcon />
      <span className="text-sm font-medium leading-5">Saída de Recurso</span>
    </button>
  )
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4.16602 10H15.8327" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
