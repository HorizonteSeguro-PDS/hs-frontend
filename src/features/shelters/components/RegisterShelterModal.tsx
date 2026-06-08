import { useEffect, useMemo, useState } from 'preact/hooks'
import { useAddressSearch, useCepLookup } from '../hooks'
import { reverseGeocode, type AddressResult } from '../api'
import AddressMapPicker from './AddressMapPicker'

interface RegisterShelterModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ShelterRegistrationFormData) => void
}

interface ShelterRegistrationFormData {
  nome: string
  telefone: string
  email: string
  bio: string
  cep: string
  endereco: string
  bairro: string
  cidade: string
  estado: string
  latitude: string
  longitude: string
  capacidadeTotal: string
  pessoasAtuais: string
  vagasDisponiveis: string
  condicoesAcesso: string
  necessidadesEspeciais: string
}

const initialFormData: ShelterRegistrationFormData = {
  nome: '',
  telefone: '',
  email: '',
  bio: '',
  cep: '',
  endereco: '',
  bairro: '',
  cidade: '',
  estado: '',
  latitude: '',
  longitude: '',
  capacidadeTotal: '',
  pessoasAtuais: '',
  vagasDisponiveis: '',
  condicoesAcesso: '',
  necessidadesEspeciais: '',
}

const addressFieldRows: { field: keyof ShelterRegistrationFormData; placeholder: string; className: string }[][] = [
  [{ field: 'cep', placeholder: 'CEP', className: 'w-full' }],
  [
    { field: 'bairro', placeholder: 'Bairro', className: 'flex-1' },
    { field: 'cidade', placeholder: 'Cidade', className: 'flex-1' },
    { field: 'estado', placeholder: 'Estado', className: 'flex-1' },
  ],
  [{ field: 'endereco', placeholder: 'Ex: Rua das Flores, 123, Apto 4', className: 'w-full' }],
]

const gradientBackground = 'bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)]'
const buttonGradient = `rounded-[10px] ${gradientBackground} shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)]`

export default function RegisterShelterModal({ open, onClose, onSubmit }: RegisterShelterModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<ShelterRegistrationFormData>(initialFormData)

  const addressQuery = useMemo(() => {
    const parts = [formData.endereco, formData.bairro, formData.cidade, formData.estado, formData.cep]
      .map((part) => part.trim())
      .filter(Boolean)

    if (parts.length === 0) return ''

    return [...parts, 'Brasil'].join(', ')
  }, [formData.endereco, formData.bairro, formData.cidade, formData.estado, formData.cep])

  const { results: addressResults, isSearching: isSearchingAddress } = useAddressSearch(addressQuery)

  const { address: cepAddress, isLoading: isLoadingCep } = useCepLookup(formData.cep)

  useEffect(() => {
    if (!cepAddress) return

    setFormData((prev) => ({
      ...prev,
      endereco: prev.endereco || cepAddress.rua,
      bairro: cepAddress.bairro || prev.bairro,
      cidade: cepAddress.cidade || prev.cidade,
      estado: cepAddress.estado || prev.estado,
    }))
  }, [cepAddress])

  if (!open) return null

  function updateField(field: keyof ShelterRegistrationFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function selectAddress(result: AddressResult) {
    setFormData((prev) => ({ ...prev, latitude: String(result.latitude), longitude: String(result.longitude) }))
  }

  function selectCoordinates(latitude: number, longitude: number) {
    setFormData((prev) => ({ ...prev, latitude: String(latitude), longitude: String(longitude) }))

    reverseGeocode(latitude, longitude).then((result) => {
      if (!result) return

      setFormData((prev) => ({
        ...prev,
        endereco: result.endereco || prev.endereco,
        bairro: result.bairro || prev.bairro,
        cidade: result.cidade || prev.cidade,
        estado: result.estado || prev.estado,
        cep: result.cep || prev.cep,
      }))
    })
  }

  function handleClose() {
    setStep(1)
    setFormData(initialFormData)
    onClose()
  }

  function handleSubmit() {
    onSubmit(formData)
    handleClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md [overflow:clip] rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-neutral shadow-xl">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                <ShelterIcon />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Cadastro de Abrigo</h2>
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

          <div className="mt-4 flex items-center gap-3">
            <StepBadge active={step === 1} number={1} />
            <span className={`text-xs ${step === 1 ? 'font-semibold text-white' : 'text-white/60'}`}>
              Informações Básicas
            </span>
            <div className="h-px flex-1 border-t border-dotted border-white/40" />
            <StepBadge active={step === 2} number={2} />
            <span className={`text-xs ${step === 2 ? 'font-semibold text-white' : 'text-white/60'}`}>
              Recursos e Acesso
            </span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-white p-6">
          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <Question number={1} label="Qual é o nome do abrigo?">
                <Input
                  placeholder="Digite o nome do abrigo..."
                  value={formData.nome}
                  onInput={(value) => updateField('nome', value)}
                />
              </Question>

              <Question number={2} label="Quais são os contatos do abrigo?">
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Telefone"
                    value={formData.telefone}
                    onInput={(value) => updateField('telefone', value)}
                  />
                  <Input
                    placeholder="E-mail"
                    value={formData.email}
                    onInput={(value) => updateField('email', value)}
                  />
                </div>
              </Question>

              <Question number={3} label="Conte um pouco sobre o abrigo">
                <TextArea
                  placeholder="Ex: Abrigo comunitário com capacidade para famílias, oferece refeições e suporte médico básico..."
                  value={formData.bio}
                  onInput={(value) => updateField('bio', value)}
                />
              </Question>

              <Question number={4} label="Onde está localizado o abrigo?">
                <div className="relative flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    {addressFieldRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex flex-col gap-1">
                        {row.length === 1 && row[0].field === 'endereco' ? (
                          <p className="text-xs text-[#0A0A0A80]">
                            Endereço completo (rua, número e complemento)
                          </p>
                        ) : null}
                        <div className="flex gap-2">
                          {row.map(({ field, placeholder, className }) => (
                            <div key={field} className={className}>
                              <Input
                                placeholder={placeholder}
                                value={formData[field]}
                                onInput={(value) => updateField(field, value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {isLoadingCep ? <p className="text-xs text-[#0A0A0A80]">Buscando dados do CEP...</p> : null}
                  <AddressMapPicker
                    latitude={formData.latitude ? Number(formData.latitude) : null}
                    longitude={formData.longitude ? Number(formData.longitude) : null}
                    onSelect={selectCoordinates}
                  />
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      <SearchIcon />
                    </span>
                    <p className="flex h-12 w-full items-center rounded-xl border border-[#0A0A0A33] bg-white pl-10 pr-3 text-sm text-[#0A0A0A80]">
                      {addressQuery || 'Preencha os campos acima para localizar o abrigo no mapa'}
                    </p>
                  </div>
                  {isSearchingAddress ? <p className="text-xs text-[#0A0A0A80]">Buscando localização...</p> : null}
                  {addressResults.length > 0 ? (
                    <ul className="overflow-hidden rounded-xl border border-[#0A0A0A33] bg-white">
                      {addressResults.map((result, index) => (
                        <li key={`${result.label}-${index}`}>
                          <button
                            type="button"
                            onClick={() => selectAddress(result)}
                            className="block w-full border-b border-dotted border-[#0A0A0A26] p-3 text-left text-sm text-[#0A0A0A80] last:border-b-0 hover:bg-[#1FA6A00D] hover:text-[#1FA6A0]"
                          >
                            {result.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {formData.latitude && formData.longitude ? (
                    <p className="text-xs text-[#1FA6A0]">
                      Localização selecionada — lat: {formData.latitude}, lng: {formData.longitude}
                    </p>
                  ) : null}
                </div>
              </Question>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <Question number={1} label="Qual é a capacidade total do abrigo?">
                <Input
                  placeholder="Digite a capacidade total do abrigo."
                  value={formData.capacidadeTotal}
                  onInput={(value) => updateField('capacidadeTotal', value)}
                />
              </Question>

              <Question number={2} label="Quantas pessoas estão atualmente no abrigo?">
                <Input
                  placeholder="Digite a quantidade..."
                  value={formData.pessoasAtuais}
                  onInput={(value) => updateField('pessoasAtuais', value)}
                />
              </Question>

              <Question number={3} label="Quantas vagas ainda estão disponíveis?">
                <Input
                  placeholder="Digite a quantidade..."
                  value={formData.vagasDisponiveis}
                  onInput={(value) => updateField('vagasDisponiveis', value)}
                />
              </Question>

              <Question number={4} label="Quais são as condições de acesso ao abrigo?">
                <TextArea
                  placeholder="Ex: Acessível 24h, requer documentação, possui rampa de acesso..."
                  value={formData.condicoesAcesso}
                  onInput={(value) => updateField('condicoesAcesso', value)}
                />
              </Question>

              <Question number={5} label="O abrigo atende necessidades especiais?">
                <TextArea
                  placeholder="Ex: Pessoas com mobilidade reduzida, idosos, crianças, pets..."
                  value={formData.necessidadesEspeciais}
                  onInput={(value) => updateField('necessidadesEspeciais', value)}
                />
              </Question>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 rounded-b-2xl bg-white p-4">
          {step === 1 ? (
            <>
              <button type="button" onClick={handleClose} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
                Cancelar
              </button>
              <button type="button" onClick={() => setStep(2)} className={`btn border-none text-white ${buttonGradient}`}>
                Continuar
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]">
                Voltar
              </button>
              <button type="button" onClick={handleSubmit} className={`btn border-none text-white ${buttonGradient}`}>
                Cadastrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StepBadge({ active, number }: { active: boolean; number: number }) {
  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
        active ? 'bg-white text-[#1FA6A0]' : 'bg-white/15 text-white/70'
      }`}
    >
      {number}
    </span>
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
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white ${gradientBackground}`}>
          {number}
        </span>
        <label className="text-sm font-bold text-black">{label}</label>
      </div>
      {children}
    </div>
  )
}

function Input({
  placeholder,
  value,
  onInput,
  className = '',
}: {
  placeholder: string
  value: string
  onInput: (value: string) => void
  className?: string
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onInput={(event) => onInput((event.target as HTMLInputElement).value)}
      className={`input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none ${className}`}
    />
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: '#99A1AF' }}>
      <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5003 17.4998L13.917 13.9165" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TextArea({
  placeholder,
  value,
  onInput,
}: {
  placeholder: string
  value: string
  onInput: (value: string) => void
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onInput={(event) => onInput((event.target as HTMLTextAreaElement).value)}
      className="textarea textarea-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
      rows={3}
    />
  )
}

function ShelterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z" />
      <path d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6" />
      <path d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18" />
      <path d="M10 6H14" />
      <path d="M10 10H14" />
      <path d="M10 14H14" />
      <path d="M10 18H14" />
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
