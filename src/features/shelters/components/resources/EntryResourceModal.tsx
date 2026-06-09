import { useState } from 'preact/hooks'
import { useResourceCategories, useCreateMovement } from '@/features/shelters/hooks'
import { showToast } from '@/shared/services/toast'

interface EntryResourceModalProps {
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

const buttonGradient =
  'rounded-[10px] bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)]'

export default function EntryResourceModal({ open, shelterId, onClose }: EntryResourceModalProps) {
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
      { category_id: categoryId, direction: 'in', quantity: Number(quantity) },
      {
        onSuccess: () => {
          showToast('Entrada registrada com sucesso!', 'success')
          handleClose()
        },
        onError: () => showToast('Erro ao registrar entrada.', 'error'),
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-[512px] flex-col items-start [overflow:clip] rounded-[14px] bg-neutral shadow-xl">
        <div className="flex w-full items-start justify-between p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[11.667px] bg-[rgba(136,233,67,0.20)] text-white">
              <EntryIcon />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Entrada de Recurso</h2>
              <p className="text-sm text-white/80">Registre a entrada de um recurso existente</p>
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
            className={`btn border-none text-white disabled:opacity-60 ${buttonGradient}`}
          >
            {isPending ? 'Registrando...' : 'Registrar Entrada'}
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

function EntryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10.6938 21.1262C10.9894 21.2969 11.3247 21.3867 11.666 21.3867C12.0073 21.3867 12.3426 21.2969 12.6382 21.1262L19.4438 17.2373C19.7391 17.0669 19.9844 16.8217 20.155 16.5265C20.3257 16.2313 20.4157 15.8964 20.416 15.5554V7.77763C20.4157 7.43664 20.3257 7.10175 20.155 6.80654C19.9844 6.51132 19.7391 6.26618 19.4438 6.09568L12.6382 2.2068C12.3426 2.03613 12.0073 1.94629 11.666 1.94629C11.3247 1.94629 10.9894 2.03613 10.6938 2.2068L3.88824 6.09568C3.59294 6.26618 3.34766 6.51132 3.17702 6.80654C3.00638 7.10175 2.91637 7.43664 2.91602 7.77763V15.5554C2.91637 15.8964 3.00638 16.2313 3.17702 16.5265C3.34766 16.8217 3.59294 17.0669 3.88824 17.2373L10.6938 21.1262Z" stroke="white" strokeWidth="1.94444" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.666 21.3887V11.6665" stroke="white" strokeWidth="1.94444" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.19727 6.80518L11.6653 11.6663L20.1334 6.80518" stroke="white" strokeWidth="1.94444" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.29102 4.15088L16.041 9.15782" stroke="white" strokeWidth="1.94444" strokeLinecap="round" strokeLinejoin="round"/>
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
