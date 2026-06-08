import { useState } from 'preact/hooks'

interface RegisterResourceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ResourceRegistrationFormData) => void
}

interface ResourceRegistrationFormData {
  category: string
  type: string
  quantity: string
  unit: string
}

const initialFormData: ResourceRegistrationFormData = {
  category: '',
  type: '',
  quantity: '',
  unit: '',
}

const unitOptions = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'L' },
  { value: 'un', label: 'Un' },
]

const categoryOptions = [
  { value: 'essenciais', label: 'Essenciais' },
  { value: 'saude', label: 'Saúde' },
  { value: 'infantil-idosos', label: 'Infantil e idosos' },
  { value: 'animais', label: 'Animais' },
  { value: 'infraestrutura', label: 'Infraestrutura' },
  { value: 'operacao', label: 'Operação' },
]

const typeOptionsByCategory: Record<string, string[]> = {
  essenciais: ['Alimento', 'Água potável', 'Roupa', 'Cobertor', 'Colchão', 'Kit higiene', 'Kit limpeza'],
  saude: ['Medicamento', 'Material médico', 'Primeiros socorros', 'Serviço de saúde', 'Serviço psicológico'],
  'infantil-idosos': ['Fralda infantil', 'Fralda geriátrica', 'Absorvente', 'Brinquedo infantil'],
  animais: ['Ração animal', 'Caixa de transporte animal', 'Serviço veterinário'],
  infraestrutura: ['Lanterna', 'Pilha/Bateria', 'Carregador', 'Power bank', 'Gerador', 'Lona', 'Tenda/Barraca', 'Botijão de gás'],
  operacao: ['Voluntário', 'Transporte', 'Equipamento de resgate', 'Material de sinalização', 'Doação financeira', 'Outro'],
}

const headerGradient =
  'bg-[linear-gradient(90deg,#1FA6A0_0%,#21A0A4_7.14%,#249BA9_14.29%,#2695AD_21.43%,#288FB0_28.57%,#2B89B4_35.71%,#2D83B8_42.86%,#2F7DBB_50%,#3177B8_57.14%,#3272B4_64.29%,#336CB1_71.43%,#3466AD_78.57%,#3460AA_85.71%,#355BA6_92.86%,#3555A3_100%)]'

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)]'

export default function RegisterResourceModal({ open, onClose, onSubmit }: RegisterResourceModalProps) {
  const [formData, setFormData] = useState<ResourceRegistrationFormData>(initialFormData)

  if (!open) return null

  function updateField<K extends keyof ResourceRegistrationFormData>(field: K, value: ResourceRegistrationFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    setFormData(initialFormData)
    onClose()
  }

  function handleSubmit() {
    onSubmit(formData)
    handleClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-[512px] flex-col items-start [overflow:clip] rounded-[14px] shadow-xl">
        <div className={`flex w-full items-start justify-between rounded-t-[16px] p-4 ${headerGradient}`}>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
              <ResourceIcon />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Entrada de Recurso Especial</h2>
              <p className="text-sm text-white/80">Cadastre um novo recurso disponível</p>
            </div>
          </div>
          <button type="button" aria-label="Fechar" onClick={handleClose} className="text-white/80 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-5 bg-white p-6">
          <Field label="Categoria do Recurso" required>
            <Select
              placeholder="Selecione a categoria..."
              value={formData.category}
              options={categoryOptions}
              onChange={(value) => setFormData((prev) => ({ ...prev, category: value, type: '' }))}
            />
          </Field>

          <Field label="Tipo de Recurso" required hint="Crie um novo tipo dentro da categoria escolhida">
            <Input
              placeholder={
                formData.category
                  ? `Ex: ${(typeOptionsByCategory[formData.category] ?? []).slice(0, 3).join(', ')}...`
                  : 'Selecione a categoria primeiro...'
              }
              value={formData.type}
              onInput={(value) => updateField('type', value)}
              disabled={!formData.category}
            />
          </Field>

          <Field label="Unidade de Medida" required hint="Informe a quantidade e o tipo de medida">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Ex: 5, 10, 100..."
                  value={formData.quantity}
                  onInput={(value) => updateField('quantity', value)}
                />
              </div>
              <div className="w-24">
                <Select
                  placeholder="Un."
                  value={formData.unit}
                  options={unitOptions}
                  onChange={(value) => updateField('unit', value)}
                />
              </div>
            </div>
          </Field>
        </div>

        <div className="flex w-full justify-end gap-3 rounded-b-[14px] bg-white p-4">
          <button type="button" onClick={handleClose} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} className={`btn border-none text-white ${buttonGradient}`}>
            Cadastrar Recurso
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: preact.ComponentChildren
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-black">
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
      {hint ? <p className="text-xs text-[#0A0A0A80]">{hint}</p> : null}
    </div>
  )
}

function Input({
  placeholder,
  value,
  onInput,
  disabled,
}: {
  placeholder: string
  value: string
  onInput: (value: string) => void
  disabled?: boolean
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onInput={(event) => onInput((event.target as HTMLInputElement).value)}
      disabled={disabled}
      className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none disabled:bg-[#0A0A0A0D] disabled:text-[#0A0A0A40]"
    />
  )
}

function Select({
  placeholder,
  value,
  options,
  onChange,
  disabled,
}: {
  placeholder: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange((event.target as HTMLSelectElement).value)}
      disabled={disabled}
      className="select select-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none disabled:bg-[#0A0A0A0D] disabled:text-[#0A0A0A40]"
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

function ResourceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path
        d="M12.8333 25.3519C13.188 25.5567 13.5904 25.6645 14 25.6645C14.4096 25.6645 14.812 25.5567 15.1667 25.3519L23.3333 20.6852C23.6877 20.4806 23.982 20.1864 24.1868 19.8322C24.3916 19.4779 24.4996 19.0761 24.5 18.6669V9.33354C24.4996 8.92436 24.3916 8.52249 24.1868 8.16823C23.982 7.81398 23.6877 7.5198 23.3333 7.31521L15.1667 2.64854C14.812 2.44375 14.4096 2.33594 14 2.33594C13.5904 2.33594 13.188 2.44375 12.8333 2.64854L4.66667 7.31521C4.31231 7.5198 4.01798 7.81398 3.81321 8.16823C3.60843 8.52249 3.50042 8.92436 3.5 9.33354V18.6669C3.50042 19.0761 3.60843 19.4779 3.81321 19.8322C4.01798 20.1864 4.31231 20.4806 4.66667 20.6852L12.8333 25.3519Z"
        stroke="white"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 25.6667V14" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.83789 8.1665L13.9996 13.9998L24.1612 8.1665" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.75 4.98145L19.25 10.9898" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
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
