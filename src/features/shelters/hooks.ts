import { useEffect, useState } from 'preact/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  lookupCep, searchAddress, fetchCrisisOperations, fetchShelterDetail,
  fetchResourceCategories,
  type AddressResult, type CepAddress, type InitialStockPayload, type MovementPayload, type CheckInPayload,
} from './api'
import { useAuth } from '@/shared/contexts/useAuthContext'
import { mutateOffline, getCachedResourceCategories } from '@/shared/services/offlineCache'
import { isOnline } from '@/shared/services/syncQueue'
import { showToast } from '@/shared/services/toast'
import { db } from '@/db/database'

const API_URL = import.meta.env.VITE_API_URL as string

export function useCrisisOperations(crisis_id: string | null) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handler = () => queryClient.invalidateQueries({ queryKey: ['crisis-operations', crisis_id] })
    window.addEventListener('hs:sync-complete', handler)
    return () => window.removeEventListener('hs:sync-complete', handler)
  }, [crisis_id])

  return useQuery({
    queryKey: ['crisis-operations', crisis_id],
    queryFn: async () => {
      try {
        const data = await fetchCrisisOperations(crisis_id!)
        db.operationsCache.put({
          crisis_id: crisis_id!,
          payload: data,
          cached_at: new Date().toISOString(),
        }).catch((e) => console.error('[Dexie] operationsCache.put failed:', e))
        return data
      } catch (fetchErr) {
        console.warn('[offline] fetch falhou, tentando cache:', fetchErr)
        const cached = await db.operationsCache.get(crisis_id!)
        if (cached) return cached.payload as Awaited<ReturnType<typeof fetchCrisisOperations>>
        throw new Error('Sem conexão e nenhum dado em cache.')
      }
    },
    enabled: !!crisis_id,
    retry: false,
    staleTime: 2 * 60 * 1000,
  })
}

export function useShelterDetail(shelter_id: string | null) {
  const { user } = useAuth()
  const token = user.value?.token ?? ''
  return useQuery({
    queryKey: ['shelter-detail', shelter_id],
    queryFn: () => fetchShelterDetail(shelter_id!, token),
    enabled: !!shelter_id,
  })
}

export function useResourceCategories(lot_category?: string) {
  const { user } = useAuth()
  const token = user.value?.token ?? ''
  return useQuery({
    queryKey: ['resource-categories', lot_category],
    queryFn: async () => {
      try {
        return await fetchResourceCategories(token, lot_category)
      } catch {
        return getCachedResourceCategories(lot_category)
      }
    },
    enabled: !!lot_category,
    staleTime: 10 * 60 * 1000,
  })
}

export function useInitialStock(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InitialStockPayload) => {
      const token = user.value?.token ?? ''
      return mutateOffline(
        `${API_URL}/shelters/${shelter_id}/inventory/initial-stock`,
        'POST', payload,
        { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      )
    },
    onSuccess: (res) => {
      if (res === null) showToast('Salvo offline. Será enviado quando houver conexão.', 'info')
      queryClient.refetchQueries({ queryKey: ['crisis-operations'] })
    },
  })
}

export function useCreateMovement(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MovementPayload) => {
      const token = user.value?.token ?? ''
      return mutateOffline(
        `${API_URL}/shelters/${shelter_id}/inventory/movements`,
        'POST', payload,
        { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      )
    },
    onSuccess: (res) => {
      if (res === null) showToast('Salvo offline. Será enviado quando houver conexão.', 'info')
      queryClient.refetchQueries({ queryKey: ['crisis-operations'] })
    },
  })
}

export function useCheckIn(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CheckInPayload) => {
      const token = user.value?.token ?? ''
      return mutateOffline(
        `${API_URL}/shelters/${shelter_id}/check-ins`,
        'POST', payload,
        { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      )
    },
    onSuccess: (res) => {
      if (res === null) showToast('Check-in salvo offline. Será sincronizado em breve.', 'info')
      queryClient.invalidateQueries({ queryKey: ['crisis-operations'] })
    },
  })
}

export function useCheckOut(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cpf: string) => {
      const token = user.value?.token ?? ''
      return mutateOffline(
        `${API_URL}/shelters/${shelter_id}/check-outs`,
        'POST', { cpf },
        { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      )
    },
    onSuccess: (res) => {
      if (res === null) showToast('Check-out salvo offline. Será sincronizado em breve.', 'info')
      queryClient.invalidateQueries({ queryKey: ['crisis-operations'] })
    },
  })
}

export { isOnline }

export function useAddressSearch(query: string) {
  const [results, setResults] = useState<AddressResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([])
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(() => {
      searchAddress(query)
        .then(setResults)
        .finally(() => setIsSearching(false))
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [query])

  return { results, isSearching }
}

export function useCepLookup(cep: string) {
  const [address, setAddress] = useState<CepAddress | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setAddress(null)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      lookupCep(cep)
        .then(setAddress)
        .finally(() => setIsLoading(false))
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [cep])

  return { address, isLoading }
}