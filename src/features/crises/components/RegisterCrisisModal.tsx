import { useState } from 'preact/hooks'
import { useCreateCrisis } from '../hooks'

interface RegisterCrisisModalProps {
  open: boolean
  onClose: () => void
}

interface CrisisRegistrationFormData {
  crisisName: string
  severity: string
  state: string
  city: string
  startDate: string
  active: boolean
}

const initialFormData: CrisisRegistrationFormData = {
  crisisName: '',
  severity: '',
  state: '',
  city: '',
  startDate: '',
  active: true,
}

const severityOptions = [
  { value: 'MUITO BAIXA', label: 'Muito Baixa' },
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MÉDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'CRÍTICA', label: 'Crítica' },
]

export default function RegisterCrisisModal({ open, onClose }: RegisterCrisisModalProps) {
  const [formData, setFormData] = useState<CrisisRegistrationFormData>(initialFormData)
  const { mutate: createCrisis, isPending } = useCreateCrisis()

  if (!open) return null

  function updateField<K extends keyof CrisisRegistrationFormData>(field: K, value: CrisisRegistrationFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    setFormData(initialFormData)
    onClose()
  }

  function handleSubmit() {
    createCrisis(
      {
        name: formData.crisisName,
        severity: formData.severity,
        state: formData.state,
        city: formData.city,
        start_date: formData.startDate,
        active: formData.active,
      },
      { onSuccess: handleClose },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md [overflow:clip] rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-neutral shadow-xl">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                <CrisisIcon />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Cadastro de Crise</h2>
                <p className="text-sm text-white/80">Responda as perguntas abaixo</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar"
              onClick={handleClose}
              className="text-white/80 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-white p-6">
          <div className="flex flex-col gap-5">
            <Question number={1} label="Qual é o título da crise?">
              <Input
                placeholder="Digite o título da crise..."
                value={formData.crisisName}
                onInput={(value) => updateField('crisisName', value)}
              />
            </Question>

            <Question number={2} label="Qual a severidade da crise?">
              <Select
                placeholder="Selecione a severidade..."
                value={formData.severity}
                options={severityOptions}
                onChange={(value) => updateField('severity', value)}
              />
            </Question>

            <Question number={3} label="Onde a crise está ocorrendo?">
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Digite o estado..."
                  value={formData.state}
                  onInput={(value) => updateField('state', value)}
                />
                <Input
                  placeholder="Digite a cidade..."
                  value={formData.city}
                  onInput={(value) => updateField('city', value)}
                />
              </div>
            </Question>

            <Question number={4} label="Qual a data de início da crise?">
              <Input
                type="date"
                placeholder="Selecione a data..."
                value={formData.startDate}
                onInput={(value) => updateField('startDate', value)}
              />
            </Question>

            <Question number={5} label="Essa crise está ativa?">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(event) => updateField('active', (event.target as HTMLInputElement).checked)}
                  className="toggle border-[#0A0A0A33] [--tglbg:#fff] checked:bg-[#1FA6A0] checked:border-[#1FA6A0]"
                />
                <span className="text-sm text-[#0A0A0A80]">{formData.active ? 'Ativa' : 'Inativa'}</span>
              </label>
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
            disabled={isPending}
            className="btn rounded-[10px] border-none bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)] disabled:opacity-70"
          >
            {isPending ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Question({
  number,
  label,
  children,
}: {
  number: number
  label: string
  children: preact.ComponentChildren
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-xs font-semibold text-white">
          {number}
        </span>
        <label className="text-sm font-bold text-black">{label}</label>
      </div>
      {children}
    </div>
  )
}

function Input({
  type = 'text',
  placeholder,
  value,
  onInput,
}: {
  type?: string
  placeholder: string
  value: string
  onInput: (value: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onInput={(event) => onInput((event.target as HTMLInputElement).value)}
      className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
    />
  )
}

function Select({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange((event.target as HTMLSelectElement).value)}
      className="select select-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function CrisisIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.29 3.86-8.18 14.14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.89-2.99L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 18 18" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
