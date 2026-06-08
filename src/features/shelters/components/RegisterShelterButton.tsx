interface RegisterShelterButtonProps {
  onClick: () => void
}

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)]'

export default function RegisterShelterButton({ onClick }: RegisterShelterButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`btn gap-2 border-none text-white ${buttonGradient}`}>
      <FunnelIcon />
      Cadastrar
    </button>
  )
}

function FunnelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 19 18" fill="none" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.49937 14.9997C7.4993 15.1545 7.54238 15.3064 7.62378 15.4381C7.70518 15.5698 7.82168 15.6763 7.96021 15.7455L9.62687 16.5788C9.75395 16.6423 9.89516 16.6723 10.0371 16.6659C10.179 16.6594 10.3169 16.6168 10.4377 16.5421C10.5586 16.4674 10.6583 16.363 10.7274 16.2389C10.7965 16.1148 10.8328 15.9751 10.8327 15.833V9.99967C10.8329 9.58666 10.9864 9.18843 11.2635 8.88217L17.2827 2.22467C17.3906 2.10514 17.4615 1.95691 17.487 1.79791C17.5124 1.63891 17.4912 1.47595 17.426 1.32874C17.3607 1.18152 17.2542 1.05636 17.1194 0.968384C16.9845 0.880408 16.8271 0.833388 16.666 0.833008H1.66604C1.50488 0.833066 1.34719 0.879854 1.21208 0.967705C1.07697 1.05556 0.970232 1.1807 0.904795 1.32798C0.839357 1.47525 0.818029 1.63835 0.843395 1.7975C0.86876 1.95665 0.93973 2.10503 1.04771 2.22467L7.06854 8.88217C7.34565 9.18843 7.49919 9.58666 7.49937 9.99967V14.9997Z" />
    </svg>
  )
}
