export interface Crisis {
  id: string
  crisis_name: string
  severity: number
  state: string
  city: string
  start_date: string
  shelters_count: number
  active: boolean
}

export type SortField = 'crisis_name' | 'severity' | 'start_date' | 'shelters_count' | 'active'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface FilterConfig {
  status: 'all' | 'active' | 'inactive'
  severities: number[]
  states: string[]
}
