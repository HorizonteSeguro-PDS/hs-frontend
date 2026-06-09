import type { ApiCrisis } from '@/features/crises/api'
import type { Crisis } from '@/features/crises/types'
import { SEVERITY_MAP } from '@/features/crises/api'

const apiUrl = import.meta.env.VITE_API_URL

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