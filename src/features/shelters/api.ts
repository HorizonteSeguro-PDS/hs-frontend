const apiUrl = import.meta.env.VITE_API_URL

import type { ApiCrisis } from '@/features/crises/api'
import type { Crisis } from '@/features/crises/types'
import { SEVERITY_MAP } from '@/features/crises/api'

interface ApiShelter {
  id: string
  name: string
  address: string
  city: string
  state: string
  urgent_needs: string[]
  capacity: number
  current_occupancy: number
  severity: string
  latitude: number
  longitude: number
}

export interface Shelter {
  id: string
  name: string
  address: string
  city: string
  state: string
  urgent_needs: string[]
  capacity: number
  current_occupancy: number
  severity: number
  latitude: number
  longitude: number
}

interface ApiCrisisShelters extends ApiCrisis {
  shelters: ApiShelter[]
}

interface CrisisShelters extends Crisis {
  shelters: Shelter[]
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

export const getShelters = async (crisis_id: string): Promise<CrisisShelters> => {
  const userRaw = localStorage.getItem('auth_user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  const response = await fetch(`${apiUrl}/crises/${crisis_id}`, {
    headers: {
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
    }
  });
  if (!response.ok) {
    console.error(`A API retornou erro ${response.status} para o ID de crise: ${crisis_id}. Verifique se a variável VITE_API_URL está correta e se o ID existe.`);
    throw new Error(`Error fetching shelters: ${response.statusText}`);
  }
  const items: ApiCrisisShelters = await response.json();
  
  return {
    id: items.id,
    crisis_name: items.name,
    severity: SEVERITY_MAP[items.severity] ?? 3,
    state: items.state,
    city: items.city,
    start_date: items.start_date ?? '',
    shelters_count: items.shelters_count,
    active: items.active,
    shelters: (items.shelters || []).map((shelter) => ({
      id: shelter.id,
      name: shelter.name,
      address: shelter.address || 'Endereço não informado',
      city: shelter.city,
      state: shelter.state,
      latitude: shelter.latitude,
      longitude: shelter.longitude,
      urgent_needs: shelter.urgent_needs || [],
      capacity: shelter.capacity,
      current_occupancy: shelter.current_occupancy,
      severity: SEVERITY_MAP[shelter.severity] ?? 3,
    })),
  }
}
