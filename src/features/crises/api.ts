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
  severity: string
  state: string
  city: string
  start_date: string
  active: boolean
}

export const createCrisis = async (payload: CreateCrisisPayload): Promise<void> => {
  const userRaw = localStorage.getItem('auth_user')
  const user = userRaw ? JSON.parse(userRaw) : null

  const response = await fetch(`${apiUrl}/crises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Error creating crisis: ${response.statusText}`)
  }
}

export const getCrises = async (): Promise<Crisis[]> => {
  const response = await fetch(`${apiUrl}/crises`)
  if (!response.ok) {
    throw new Error(`Error fetching crises: ${response.statusText}`)
  }
  const items: ApiCrisis[] = await response.json()
   return items.map((item) => ({
    id: item.id,
    crisis_name: item.name,
    severity: SEVERITY_MAP[item.severity] ?? 3,
    state: item.state,
    city: item.city,
    start_date: item.start_date ?? '',
    shelters_count: item.shelters_count,
    active: item.active,
   }));
}
