import { useState, useRef, useEffect } from 'preact/hooks'
import { useLocation } from 'wouter-preact'
import { Plus, X, ChevronLeft } from 'lucide-preact'
import HorizonteSeguroLogo from '@/assets/LOGO.svg'
import { useRegisterExistingOrg, useRegisterNewOrg, useOrganizations } from '@/features/register/hooks'
import { showToast } from '@/shared/services/toast'

interface FormData {
  name: string
  email: string
  phone: string
  organization_id: string
  password: string
  confirmPassword: string
}

interface NewOrgData {
  organization_name: string
  organization_type: string
  organization_cnpj: string
  organization_contact_email: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  organization_id: '',
  password: '',
  confirmPassword: '',
}

const initialNewOrg: NewOrgData = {
  organization_name: '',
  organization_type: 'shelter_operator',
  organization_cnpj: '',
  organization_contact_email: '',
}

const orgTypeOptions = [
  { value: 'shelter_operator', label: 'Operador de Abrigo' },
  { value: 'ngo', label: 'ONG' },
  { value: 'government', label: 'Governo' },
  { value: 'other', label: 'Outro' },
]

export default function Register() {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [newOrgData, setNewOrgData] = useState<NewOrgData>(initialNewOrg)
  const [passwordError, setPasswordError] = useState('')
  const [showNewOrg, setShowNewOrg] = useState(false)
  const [orgSearch, setOrgSearch] = useState('')
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const orgRef = useRef<HTMLDivElement>(null)
  const [, setLocation] = useLocation()

  const { mutate: registerExisting, isPending: isPendingExisting } = useRegisterExistingOrg()
  const { mutate: registerNew, isPending: isPendingNew } = useRegisterNewOrg()
  const { data: organizations = [], isLoading: isLoadingOrgs } = useOrganizations()

  const isPending = isPendingExisting || isPendingNew

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setOrgDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOrgName = organizations.find((o) => o.id === formData.organization_id)?.name ?? ''
  const filteredOrgs = organizations.filter((o) => o.name.toLowerCase().includes(orgSearch.toLowerCase()))

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'confirmPassword' || field === 'password') setPasswordError('')
  }

  function updateNewOrg(field: keyof NewOrgData, value: string) {
    setNewOrgData((prev) => ({ ...prev, [field]: value }))
  }

  function handleStep1(event: Event) {
    event.preventDefault()
    setStep(2)
  }

  function handleSubmit(event: Event) {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('As senhas não coincidem.')
      return
    }

    const onSuccess = () => {
      showToast('Solicitação enviada! Aguarde a aprovação.', 'success')
      setLocation('/login')
    }

    if (showNewOrg) {
      if (!newOrgData.organization_name.trim()) return
      registerNew(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          roles: ['shelter_manager'],
          organization_name: newOrgData.organization_name,
          organization_type: newOrgData.organization_type,
          organization_cnpj: newOrgData.organization_cnpj || null,
          organization_contact_email: newOrgData.organization_contact_email || undefined,
        },
        { onSuccess },
      )
    } else {
      registerExisting(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          organization_id: formData.organization_id,
          roles: ['shelter_manager'],
        },
        { onSuccess },
      )
    }
  }

  const inputClass = 'input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none'
  const inputSmClass = 'input input-bordered input-sm w-full rounded-lg bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none'
  const selectSmClass = 'select select-bordered select-sm w-full rounded-lg bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none'

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-white shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 p-8 pb-4">
          <img src={HorizonteSeguroLogo} alt="Logo horizonte seguro" className="h-20 w-auto" />
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-lg font-semibold text-black">Cadastro de Gestor de Abrigo</h1>
            <p className="text-sm text-[#0A0A0A80]">Preencha os dados para criar sua conta</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StepDot active={step === 1} done={step > 1} label="1" />
            <div className="h-px w-8 bg-[#E5E7EB]" />
            <StepDot active={step === 2} done={false} label="2" />
          </div>
        </div>

        {/* Etapa 1 — Dados pessoais */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-4 p-6 pt-2">
            <p className="text-xs font-semibold text-[#0A0A0A80] uppercase tracking-wide">Etapa 1 — Dados pessoais</p>

            <Field label="Nome completo">
              <input type="text" required placeholder="Digite seu nome..." value={formData.name}
                onInput={(e) => updateField('name', (e.target as HTMLInputElement).value)}
                className={inputClass} />
            </Field>

            <Field label="E-mail">
              <input type="email" required placeholder="Digite seu e-mail..." value={formData.email}
                onInput={(e) => updateField('email', (e.target as HTMLInputElement).value)}
                className={inputClass} />
            </Field>

            <Field label="Telefone">
              <input type="tel" required placeholder="Digite seu telefone..." value={formData.phone}
                onInput={(e) => updateField('phone', (e.target as HTMLInputElement).value)}
                className={inputClass} />
            </Field>

            <div className="flex flex-col gap-3 pt-2">
              <button type="submit"
                className="btn rounded-[10px] border-none bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)]">
                Continuar
              </button>
              <button type="button" onClick={() => setLocation('/login')}
                className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
                Já tenho uma conta
              </button>
            </div>
          </form>
        )}

        {/* Etapa 2 — Organização e senha */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 pt-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setStep(1)} className="text-[#0A0A0A80] hover:text-black transition-colors">
                <ChevronLeft size={18} />
              </button>
              <p className="text-xs font-semibold text-[#0A0A0A80] uppercase tracking-wide">Etapa 2 — Organização e senha</p>
            </div>

            <Field label="Organização">
              {!showNewOrg && (
                <>
                  <input type="text" required value={formData.organization_id} readOnly className="sr-only" tabIndex={-1} aria-hidden />
                  <div ref={orgRef} className="relative">
                    <input
                      type="text"
                      placeholder={isLoadingOrgs ? 'Carregando...' : selectedOrgName || 'Buscar organização...'}
                      value={orgDropdownOpen ? orgSearch : selectedOrgName}
                      onFocus={() => { setOrgDropdownOpen(true); setOrgSearch('') }}
                      onInput={(e) => { setOrgSearch((e.target as HTMLInputElement).value); setOrgDropdownOpen(true) }}
                      className={inputClass}
                    />
                    {orgDropdownOpen && (
                      <ul className="absolute z-20 mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-lg max-h-48 overflow-y-auto">
                        {filteredOrgs.length === 0 ? (
                          <li className="px-4 py-2 text-sm text-[#0A0A0A80]">Nenhuma organização encontrada</li>
                        ) : (
                          filteredOrgs.map((org) => (
                            <li key={org.id}
                              onMouseDown={() => { updateField('organization_id', org.id); setOrgSearch(''); setOrgDropdownOpen(false) }}
                              className={`cursor-pointer px-4 py-2 text-sm hover:bg-[#f0f9ff] transition-colors ${formData.organization_id === org.id ? 'font-semibold text-[#1FA6A0]' : 'text-[#0a0a0a]'}`}>
                              {org.name}
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {!showNewOrg ? (
                <button type="button" onClick={() => { setShowNewOrg(true); updateField('organization_id', '') }}
                  className="flex items-center gap-1 text-xs text-[#2F7DBB] hover:text-[#1FA6A0] transition-colors w-fit mt-0.5">
                  <Plus size={13} />
                  Criar nova organização
                </button>
              ) : (
                <div className="flex flex-col gap-2 rounded-xl border border-[#E5E7EB] bg-[#fafafa] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0a0a0a]">Nova organização</span>
                    <button type="button" onClick={() => setShowNewOrg(false)} className="text-[#0A0A0A80] hover:text-black">
                      <X size={14} />
                    </button>
                  </div>
                  <input required type="text" placeholder="Nome da organização *" value={newOrgData.organization_name}
                    onInput={(e) => updateNewOrg('organization_name', (e.target as HTMLInputElement).value)}
                    className={inputSmClass} />
                  <select required value={newOrgData.organization_type}
                    onChange={(e) => updateNewOrg('organization_type', (e.target as HTMLSelectElement).value)}
                    className={selectSmClass}>
                    {orgTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <input type="text" placeholder="CNPJ (opcional)" value={newOrgData.organization_cnpj}
                    onInput={(e) => updateNewOrg('organization_cnpj', (e.target as HTMLInputElement).value)}
                    className={inputSmClass} />
                  <input type="email" placeholder="E-mail de contato (opcional)" value={newOrgData.organization_contact_email}
                    onInput={(e) => updateNewOrg('organization_contact_email', (e.target as HTMLInputElement).value)}
                    className={inputSmClass} />
                </div>
              )}
            </Field>

            <Field label="Senha">
              <input type="password" required minLength={8} placeholder="Digite sua senha..." value={formData.password}
                onInput={(e) => updateField('password', (e.target as HTMLInputElement).value)}
                className={inputClass} />
            </Field>

            <Field label="Confirmar senha">
              <input type="password" required placeholder="Confirme sua senha..." value={formData.confirmPassword}
                onInput={(e) => updateField('confirmPassword', (e.target as HTMLInputElement).value)}
                className={`input input-bordered w-full rounded-xl bg-white focus:outline-none ${passwordError ? 'border-[#E5484D] text-[#E5484D] focus:border-[#E5484D]' : 'border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0]'}`} />
              {passwordError && <p className="text-xs text-[#E5484D]">{passwordError}</p>}
            </Field>

            <div className="flex flex-col gap-3 pt-2">
              <button type="submit" disabled={isPending}
                className="btn rounded-[10px] border-none bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)] disabled:opacity-70">
                {isPending ? 'Enviando...' : 'Enviar solicitação'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
      active ? 'bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white'
      : done ? 'bg-[#1FA6A0] text-white'
      : 'bg-[#E5E7EB] text-[#0A0A0A80]'
    }`}>
      {label}
    </div>
  )
}

function Field({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-black">{label}</span>
      {children}
    </div>
  )
}
