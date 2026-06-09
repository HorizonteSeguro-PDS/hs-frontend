import { useState } from 'preact/hooks'
import { useCheckIn } from '@/features/shelters/hooks'
import { showToast } from '@/shared/services/toast'
import type { VulnerabilityType } from '@/features/shelters/api'

interface RegisterPersonModalProps {
  open: boolean
  shelterId: string
  onClose: () => void
}

const initialFormData = { fullName: '', cpf: '', birthDate: '', phone: '', vulnerability: '' as VulnerabilityType | '', notes: '' }

const vulnerabilityOptions: { value: VulnerabilityType; label: string }[] = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'child', label: 'Criança' },
  { value: 'elderly', label: 'Idoso(a)' },
  { value: 'pregnant', label: 'Gestante' },
  { value: 'disabled', label: 'Pessoa com deficiência' },
  { value: 'chronic_illness', label: 'Doença crônica' },
  { value: 'other', label: 'Outra' },
]

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function rawCpf(formatted: string): string {
  return formatted.replace(/\D/g, '')
}

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
      {
        name: formData.fullName,
        cpf: rawCpf(formData.cpf),
        birth_date: formData.birthDate,
        phone: formData.phone || undefined,
        vulnerability: formData.vulnerability || undefined,
        notes: formData.notes || undefined,
      },
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
              <CpfInput value={formData.cpf} onInput={(v) => update('cpf', v)} />
            </Question>
            <Question number={3} label="Qual é a data de nascimento da pessoa?">
              <input
                type="date"
                value={formData.birthDate}
                onInput={(e) => update('birthDate', (e.target as HTMLInputElement).value)}
                className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
              />
            </Question>
            <Question number={4} label="Vulnerabilidade (Opcional)">
              <select
                value={formData.vulnerability}
                onChange={(e) => update('vulnerability', (e.target as HTMLSelectElement).value as VulnerabilityType)}
                className="select select-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
              >
                <option value="">Selecione...</option>
                {vulnerabilityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Question>
            <Question number={5} label="Qual é o telefone de contato? (Opcional)">
              <Input placeholder="Digite o telefone aqui..." value={formData.phone} onInput={(v) => update('phone', v)} />
            </Question>
            <Question number={6} label="Observações (Opcional)">
              <textarea
                placeholder="Informações adicionais sobre a pessoa..."
                value={formData.notes}
                onInput={(e) => update('notes', (e.target as HTMLTextAreaElement).value)}
                rows={3}
                className="textarea textarea-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
              />
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

function CpfInput({ value, onInput }: { value: string; onInput: (v: string) => void }) {
  const isComplete = rawCpf(value).length === 11
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        placeholder="000.000.000-00"
        value={value}
        maxLength={14}
        onInput={(e) => onInput(formatCpf((e.target as HTMLInputElement).value))}
        className={`input input-bordered w-full rounded-xl bg-white focus:outline-none
          ${isComplete
            ? 'border-[#1FA6A0] text-[#0A0A0A]'
            : 'border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0]'
          }`}
      />
      {isComplete && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1FA6A0]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
    </div>
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
