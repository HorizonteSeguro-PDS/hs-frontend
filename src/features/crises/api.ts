import type { Crisis } from './types'

const apiUrl = import.meta.env.VITE_API_URL

interface ApiCrisis {
  id: string
  name: string
  severity: string
  state: string
  city: string
  start_date: string | null
  shelters_count: number
  active: boolean
}

const SEVERITY_MAP: Record<string, number> = {
  'MUITO BAIXA': 1,
  'BAIXA': 2,
  'MÉDIA': 3,
  'ALTA': 4,
  'CRÍTICA': 5,
}

export const getCrises = async (): Promise<Crisis[]> => {
  const response = await fetch(`${apiUrl}/crises`)
  if (!response.ok) {
    throw new Error(`Error fetching crises: ${response.statusText}`)
  }
  const items: ApiCrisis[] = await response.json()
  return items.map((item) => ({
    crisis_name: item.name,
    severity: SEVERITY_MAP[item.severity] ?? 3,
    state: item.state,
    city: item.city,
    start_date: item.start_date ?? '',
    shelters_count: item.shelters_count,
    active: item.active,
  }))
}
