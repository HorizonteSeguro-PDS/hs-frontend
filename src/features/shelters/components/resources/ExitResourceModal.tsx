import { useState } from 'preact/hooks'

interface ExitResourceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ResourceExitFormData) => void
}

interface ResourceExitFormData {
  category: string
  resource: string
  quantity: string
}

const initialFormData: ResourceExitFormData = {
  category: '',
  resource: '',
  quantity: '',
}

const categoryOptions = [
  { value: 'essenciais', label: 'Essenciais' },
  { value: 'saude', label: 'Saúde' },
  { value: 'infantil-idosos', label: 'Infantil e idosos' },
  { value: 'animais', label: 'Animais' },
  { value: 'infraestrutura', label: 'Infraestrutura' },
  { value: 'operacao', label: 'Operação' },
]

const resourceOptionsByCategory: Record<string, string[]> = {
  essenciais: ['Alimento', 'Água potável', 'Roupa', 'Cobertor', 'Colchão', 'Kit higiene', 'Kit limpeza'],
  saude: ['Medicamento', 'Material médico', 'Primeiros socorros', 'Serviço de saúde', 'Serviço psicológico'],
  'infantil-idosos': ['Fralda infantil', 'Fralda geriátrica', 'Absorvente', 'Brinquedo infantil'],
  animais: ['Ração animal', 'Caixa de transporte animal', 'Serviço veterinário'],
  infraestrutura: ['Lanterna', 'Pilha/Bateria', 'Carregador', 'Power bank', 'Gerador', 'Lona', 'Tenda/Barraca', 'Botijão de gás'],
  operacao: ['Voluntário', 'Transporte', 'Equipamento de resgate', 'Material de sinalização', 'Doação financeira', 'Outro'],
}

const unitByResource: Record<string, string> = {
  Alimento: 'kg',
  'Água potável': 'L',
  'Ração animal': 'kg',
  'Doação financeira': 'R$',
}

function getResourceUnit(resource: string) {
  return unitByResource[resource] ?? 'Un'
}

export default function ExitResourceModal({ open, onClose, onSubmit }: ExitResourceModalProps) {
  const [formData, setFormData] = useState<ResourceExitFormData>(initialFormData)

  if (!open) return null

  function updateField<K extends keyof ResourceExitFormData>(field: K, value: ResourceExitFormData[K]) {
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
      <div className="flex w-full max-w-[512px] flex-col items-start [overflow:clip] rounded-[14px] bg-neutral shadow-xl">
        <div className="flex w-full items-start justify-between p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[11.667px] bg-[rgba(229,72,77,0.20)] text-white">
              <ResourceIcon />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Saída de Recurso</h2>
              <p className="text-sm text-white/80">Cadastre um novo recurso disponível</p>
            </div>
          </div>
          <button type="button" aria-label="Fechar" onClick={handleClose} className="text-white/80 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-5 bg-white p-6">
          <Field label="Categoria do Recurso">
            <Select
              placeholder="Selecione uma categoria..."
              value={formData.category}
              options={categoryOptions}
              onChange={(value) => setFormData((prev) => ({ ...prev, category: value, resource: '' }))}
            />
          </Field>

          <Field label="Nome do Recurso">
            <Select
              placeholder={formData.category ? 'Selecione um recurso...' : 'Selecione a categoria primeiro...'}
              value={formData.resource}
              options={(resourceOptionsByCategory[formData.category] ?? []).map((label) => ({ value: label, label }))}
              onChange={(value) => updateField('resource', value)}
              disabled={!formData.category}
            />
          </Field>

          <Field label="Quantidade">
            <div className="flex items-stretch gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Digite a quantidade aqui.."
                  value={formData.quantity}
                  onInput={(value) => updateField('quantity', value)}
                />
              </div>
              {formData.resource ? (
                <span className="flex w-16 shrink-0 items-center justify-center rounded-xl border border-[#0A0A0A80] bg-[#0A0A0A0D] text-sm font-semibold text-[#0A0A0A80]">
                  {getResourceUnit(formData.resource)}
                </span>
              ) : null}
            </div>
          </Field>
        </div>

        <div className="flex w-full justify-end gap-3 rounded-b-[14px] bg-white p-4">
          <button type="button" onClick={handleClose} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} className="btn rounded-[10px] border-none bg-[#E5484D] text-white hover:bg-[#E5484D]/90">
            Registrar Saída
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-black">{label}:</label>
      {children}
    </div>
  )
}

function Input({
  placeholder,
  value,
  onInput,
}: {
  placeholder: string
  value: string
  onInput: (value: string) => void
}) {
  return (
    <input
      type="text"
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
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
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
