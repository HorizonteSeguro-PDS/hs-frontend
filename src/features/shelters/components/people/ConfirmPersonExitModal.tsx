interface ConfirmPersonExitModalProps {
  open: boolean
  personName: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmPersonExitModal({ open, personName, onClose, onConfirm }: ConfirmPersonExitModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-[14px] bg-white p-6 shadow-xl">
        <button type="button" aria-label="Fechar" onClick={onClose} className="absolute right-4 top-4 text-[#0A0A0A80] hover:text-black">
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5484D1A] text-[#E5484D]">
            <WarningIcon />
          </span>
          <h2 className="text-lg font-bold text-black">Confirmar Saída</h2>
          <p className="text-sm text-[#0A0A0A80]">Você está prestes a registrar a saída de:</p>
          <div className="w-full rounded-xl border border-[#E5E7EB] bg-[#0A0A0A0D] px-4 py-2 text-sm font-semibold text-black">
            {personName}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={onClose} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="btn rounded-[10px] border-none bg-[#E5484D] text-white hover:bg-[#E5484D]/90">
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
