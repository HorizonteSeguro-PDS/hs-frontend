const API_URL = import.meta.env.VITE_API_URL as string

export interface ApiSupply {
  name: string
  current_quantity: number
  unit: string
  max_capacity: number
  status: 'Sufficient' | 'Critical' | 'Attention'
  lot_category: string
}

export interface ApiResource {
  created_at: string
  type: 'in' | 'out'
  category: string
  name: string
  quantity: number
  unit: string
  source: string | null
  created_by: string | null
}

export interface ApiPerson {
  name: string
  age: number
  vulnerabilities: string
  cpf: string
}

export interface ApiShelter {
  id: string
  name: string
  city: string
  state: string
  severity: string
  capacity: number
  current_occupancy: number
  relative_occupation: number
  active_managers: number
  supplies: ApiSupply[]
  resources: ApiResource[]
  people: ApiPerson[]
}

export interface CrisisOperations {
  id: string
  name: string
  city: string
  shelters: ApiShelter[]
}

export async function fetchCrisisOperations(crisis_id: string): Promise<CrisisOperations> {
  const response = await fetch(`${API_URL}/crises/${crisis_id}/operations`)
  if (!response.ok) throw new Error('Failed to fetch crisis operations')
  return response.json()
}

export interface ShelterDetail {
  id: string
  name: string
  email: string
  phone: string
  address: string
  neighborhood: string
  city: string
  state: string
  bio: string
  capacity: number
  occupation: number
  shelter_type: string
  status: string
  entry_requirements: string
  attended_special_needs: string
}

export async function fetchShelterDetail(shelter_id: string, token: string): Promise<ShelterDetail> {
  const response = await fetch(`${API_URL}/shelters/${shelter_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Failed to fetch shelter detail')
  return response.json()
}

export interface ResourceCategory {
  id: string
  name: string
  unit: string
  lot_category: string
}

export async function fetchResourceCategories(token: string, lot_category?: string): Promise<ResourceCategory[]> {
  const params = lot_category ? `?lot_category=${lot_category}` : ''
  const response = await fetch(`${API_URL}/resource-categories${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Failed to fetch resource categories')
  return response.json()
}

export interface InitialStockPayload {
  category: { name: string; unit: string; lot_category: string; description?: string }
  quantity: number
  source?: string
  notes?: string
}

export async function createInitialStock(shelter_id: string, payload: InitialStockPayload, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/shelters/${shelter_id}/inventory/initial-stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to create initial stock')
}

export interface MovementPayload {
  category_id: string
  direction: 'in' | 'out'
  quantity: number
  reason?: string
}

export async function createMovement(shelter_id: string, payload: MovementPayload, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/shelters/${shelter_id}/inventory/movements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to create movement')
}

export type VulnerabilityType = 'child' | 'elderly' | 'pregnant' | 'disabled' | 'chronic_illness' | 'none' | 'other'

export interface CheckInPayload {
  name: string
  cpf: string
  birth_date: string
  phone?: string
  vulnerability?: VulnerabilityType
  notes?: string
}

export async function checkIn(shelter_id: string, payload: CheckInPayload, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/shelters/${shelter_id}/check-ins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to check in')
}

export async function checkOut(shelter_id: string, cpf: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/shelters/${shelter_id}/check-outs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ cpf }),
  })
  if (!response.ok) throw new Error('Failed to check out')
}

export interface AddressResult {
  label: string
  latitude: number
  longitude: number
}

export interface CepAddress {
  rua: string
  bairro: string
  cidade: string
  estado: string
}

export async function lookupCep(cep: string): Promise<CepAddress | null> {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) return null

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
  const data = await response.json()

  if (data.erro) return null

  return {
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    estado: data.uf ?? '',
  }
}

export interface ReverseGeocodeResult {
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult | null> {
  const response = await fetch(`https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`)
  const data = await response.json()
  const feature = data.features?.[0]
  if (!feature) return null

  const { name, housenumber, street, district, city, state, postcode } = feature.properties ?? {}

  return {
    endereco: [street ?? name, housenumber].filter(Boolean).join(', '),
    bairro: district ?? '',
    cidade: city ?? '',
    estado: state ?? '',
    cep: postcode ?? '',
  }
}

export async function searchAddress(query: string): Promise<AddressResult[]> {
  const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`)
  const data = await response.json()

  return (data.features ?? []).map((feature: any) => {
    const { name, housenumber, street, city, state, country } = feature.properties ?? {}
    const [longitude, latitude] = feature.geometry?.coordinates ?? [0, 0]
    const streetLine = [street ?? name, housenumber].filter(Boolean).join(', ')
    return {
      label: [streetLine, city, state, country].filter(Boolean).join(', '),
      latitude,
      longitude,
    }
  })
}
