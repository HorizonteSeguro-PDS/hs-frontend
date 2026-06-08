interface ExitResourceButtonProps {
  onClick: () => void
}

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(221deg,#F68B5E_37.79%,#F5B84B_90.47%,#E75D5C_143.16%)] shadow-[0_10px_15px_0_rgba(31,166,160,0.30),0_4px_6px_0_rgba(31,166,160,0.30)]'

export default function ExitResourceButton({ onClick }: ExitResourceButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`btn flex items-center gap-2 border-none px-6 py-3 text-white ${buttonGradient}`}>
      <PlusIcon />
      <span className="text-base font-medium leading-6">Saída de Recurso</span>
    </button>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4.16602 10H15.8327" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 4.1665V15.8332" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
