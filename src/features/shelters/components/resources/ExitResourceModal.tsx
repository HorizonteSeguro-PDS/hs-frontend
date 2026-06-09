import { useState } from 'preact/hooks'
import { useResourceCategories, useCreateMovement } from '@/features/shelters/hooks'
import { showToast } from '@/shared/services/toast'

interface ExitResourceModalProps {
  open: boolean
  shelterId: string
  onClose: () => void
}

const lotCategoryOptions = [
  { value: 'essenciais', label: 'Essenciais' },
  { value: 'saude', label: 'Saúde' },
  { value: 'infantil-idosos', label: 'Infantil e Idosos' },
  { value: 'animais', label: 'Animais' },
  { value: 'infraestrutura', label: 'Infraestrutura' },
  { value: 'operacao', label: 'Operação' },
]

export default function ExitResourceModal({ open, shelterId, onClose }: ExitResourceModalProps) {
  const [lotCategory, setLotCategory] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [quantity, setQuantity] = useState('')

  const { data: categories = [], isLoading: isLoadingCats } = useResourceCategories(lotCategory || undefined)
  const { mutate: createMovement, isPending } = useCreateMovement(shelterId)

  const selectedCategory = categories.find((c) => c.id === categoryId)

  if (!open) return null

  function handleClose() {
    setLotCategory('')
    setCategoryId('')
    setQuantity('')
    onClose()
  }

  function handleSubmit() {
    if (!categoryId || !quantity) return
    createMovement(
      { category_id: categoryId, direction: 'out', quantity: Number(quantity) },
      {
        onSuccess: () => {
          showToast('Saída registrada com sucesso!', 'success')
          handleClose()
        },
        onError: () => showToast('Erro ao registrar saída.', 'error'),
      },
    )
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
              <p className="text-sm text-white/80">Registre a saída de um recurso do abrigo</p>
            </div>
          </div>
          <button type="button" aria-label="Fechar" onClick={handleClose} className="text-white/80 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-5 bg-white p-6">
          <Field label="Categoria:">
            <select
              value={lotCategory}
              onChange={(e) => { setLotCategory((e.target as HTMLSelectElement).value); setCategoryId('') }}
              className="select select-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {lotCategoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>

          <Field label="Nome do Recurso:">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId((e.target as HTMLSelectElement).value)}
              disabled={!lotCategory}
              className="select select-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none disabled:bg-[#0A0A0A0D] disabled:text-[#0A0A0A40]"
            >
              <option value="" disabled>
                {!lotCategory ? 'Selecione a categoria primeiro...' : isLoadingCats ? 'Carregando...' : 'Selecione um recurso...'}
              </option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          <Field label="Quantidade:">
            <div className="flex items-stretch gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Digite a quantidade aqui..."
                  value={quantity}
                  onInput={(e) => setQuantity((e.target as HTMLInputElement).value)}
                  className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
                />
              </div>
              {selectedCategory && (
                <span className="flex w-16 shrink-0 items-center justify-center rounded-xl border border-[#0A0A0A80] bg-[#0A0A0A0D] text-sm font-semibold text-[#0A0A0A80]">
                  {selectedCategory.unit}
                </span>
              )}
            </div>
          </Field>
        </div>

        <div className="flex w-full justify-end gap-3 rounded-b-[14px] bg-white p-4">
          <button type="button" onClick={handleClose} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !categoryId || !quantity}
            className="btn rounded-[10px] border-none bg-[#E5484D] text-white hover:bg-[#E5484D]/90 disabled:opacity-60"
          >
            {isPending ? 'Registrando...' : 'Registrar Saída'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-black">{label}</label>
      {children}
    </div>
  )
}

function ResourceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <path d="M12.8333 25.3519C13.188 25.5567 13.5904 25.6645 14 25.6645C14.4096 25.6645 14.812 25.5567 15.1667 25.3519L23.3333 20.6852C23.6877 20.4806 23.982 20.1864 24.1868 19.8322C24.3916 19.4779 24.4996 19.0761 24.5 18.6669V9.33354C24.4996 8.92436 24.3916 8.52249 24.1868 8.16823C23.982 7.81398 23.6877 7.5198 23.3333 7.31521L15.1667 2.64854C14.812 2.44375 14.4096 2.33594 14 2.33594C13.5904 2.33594 13.188 2.44375 12.8333 2.64854L4.66667 7.31521C4.31231 7.5198 4.01798 7.81398 3.81321 8.16823C3.60843 8.52249 3.50042 8.92436 3.5 9.33354V18.6669C3.50042 19.0761 3.60843 19.4779 3.81321 19.8322C4.01798 20.1864 4.31231 20.4806 4.66667 20.6852L12.8333 25.3519Z" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 25.6667V14" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.83789 8.1665L13.9996 13.9998L24.1612 8.1665" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.75 4.98145L19.25 10.9898" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
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
