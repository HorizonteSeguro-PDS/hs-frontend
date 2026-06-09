import type { Crisis } from './types'

const apiUrl = import.meta.env.VITE_API_URL

export interface ApiCrisis {
  id: string
  name: string
  severity: string
  state: string
  city: string
  start_date: string | null
  shelters_count: number
  active: boolean
}

export const SEVERITY_MAP: Record<string, number> = {
  'MUITO BAIXA': 1,
  'BAIXA': 2,
  'MÉDIA': 3,
  'ALTA': 4,
  'CRÍTICA': 5,
}

export interface CreateCrisisPayload {
  name: string
  type: string
  severity: string
  state: string
  city: string
  start_date: string
  status: 'active' | 'closed'
}

export const createCrisis = async (payload: CreateCrisisPayload, token?: string): Promise<void> => {
  const response = await fetch(`${apiUrl}/crises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Error creating crisis: ${response.statusText}`)
  }
}

export function mapApiCrisis(item: ApiCrisis): Crisis {
  return {
    id: item.id,
    crisis_name: item.name,
    severity: SEVERITY_MAP[item.severity] ?? 3,
    state: item.state,
    city: item.city,
    start_date: item.start_date ?? '',
    shelters_count: item.shelters_count,
    active: item.active,
  }
}

export const getCrises = async (): Promise<{ mapped: Crisis[]; raw: ApiCrisis[] }> => {
  const response = await fetch(`${apiUrl}/crises`)
  if (!response.ok) throw new Error(`Error fetching crises: ${response.statusText}`)
  const raw: ApiCrisis[] = await response.json()
  return { mapped: raw.map(mapApiCrisis), raw }
}
