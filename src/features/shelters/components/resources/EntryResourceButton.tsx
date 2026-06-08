interface EntryResourceButtonProps {
  onClick: () => void
}

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(3deg,#1FA6A0_0%,#2F7DBB_58%,#3555A3_99%)] shadow-[0px_4px_6px_rgba(31,166,160,0.30),0px_10px_15px_rgba(31,166,160,0.30)]'

export default function EntryResourceButton({ onClick }: EntryResourceButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`btn gap-2 border-none text-white ${buttonGradient}`}>
      <PlusIcon />
      <span className="text-base font-medium leading-6">Entrada de Recurso</span>
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
