import { useState } from 'preact/hooks'
import { useCheckIn } from '@/features/shelters/hooks'
import { showToast } from '@/shared/services/toast'

interface RegisterPersonModalProps {
  open: boolean
  shelterId: string
  onClose: () => void
}

const initialFormData = { fullName: '', cpf: '', birthDate: '', phone: '' }

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)]'

export default function RegisterPersonModal({ open, shelterId, onClose }: RegisterPersonModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const { mutate: doCheckIn, isPending } = useCheckIn(shelterId)

  if (!open) return null

  function update(field: keyof typeof initialFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    setFormData(initialFormData)
    onClose()
  }

  function handleSubmit() {
    if (!formData.fullName || !formData.cpf || !formData.birthDate) return
    doCheckIn(
      { name: formData.fullName, cpf: formData.cpf, birth_date: formData.birthDate, phone: formData.phone || undefined },
      {
        onSuccess: () => {
          showToast('Pessoa cadastrada com sucesso!', 'success')
          handleClose()
        },
        onError: () => showToast('Erro ao cadastrar pessoa.', 'error'),
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md [overflow:clip] rounded-[14px] bg-neutral shadow-xl">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                <PersonIcon />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Cadastro/Entrada de Pessoa</h2>
                <p className="text-sm text-white/80">Responda as perguntas abaixo</p>
              </div>
            </div>
            <button type="button" aria-label="Fechar" onClick={handleClose} className="text-white/80 hover:text-white">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-white p-6">
          <div className="flex flex-col gap-5">
            <Question number={1} label="Qual é o nome completo da pessoa?">
              <Input placeholder="Digite o nome completo..." value={formData.fullName} onInput={(v) => update('fullName', v)} />
            </Question>
            <Question number={2} label="Qual é o CPF da pessoa?">
              <Input placeholder="XXX.XXX.XXX-XX" value={formData.cpf} onInput={(v) => update('cpf', v)} />
            </Question>
            <Question number={3} label="Qual é a data de nascimento da pessoa?">
              <Input placeholder="DD/MM/AAAA" value={formData.birthDate} onInput={(v) => update('birthDate', v)} />
            </Question>
            <Question number={4} label="Qual é o telefone de contato? (Opcional)">
              <Input placeholder="Digite o telefone aqui..." value={formData.phone} onInput={(v) => update('phone', v)} />
            </Question>
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-b-2xl bg-white p-4">
          <button type="button" onClick={handleClose} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !formData.fullName || !formData.cpf || !formData.birthDate}
            className={`btn border-none text-white disabled:opacity-60 ${buttonGradient}`}
          >
            {isPending ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Question({ number, label, children }: { number: number; label: string; children: preact.ComponentChildren }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F7DBB] text-xs font-semibold text-white">{number}</span>
        <label className="text-sm font-bold text-black">{label}</label>
      </div>
      {children}
    </div>
  )
}

function Input({ placeholder, value, onInput }: { placeholder: string; value: string; onInput: (v: string) => void }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onInput={(e) => onInput((e.target as HTMLInputElement).value)}
      className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
    />
  )
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 6 18 18" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
