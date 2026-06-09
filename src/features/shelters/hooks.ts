import { useEffect, useState } from 'preact/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  lookupCep, searchAddress, fetchCrisisOperations, fetchShelterDetail,
  fetchResourceCategories, createInitialStock, createMovement, checkIn, checkOut,
  type AddressResult, type CepAddress, type InitialStockPayload, type MovementPayload, type CheckInPayload,
} from './api'
import { useAuth } from '@/shared/contexts/useAuthContext'

export function useCrisisOperations(crisis_id: string | null) {
  return useQuery({
    queryKey: ['crisis-operations', crisis_id],
    queryFn: () => fetchCrisisOperations(crisis_id!),
    enabled: !!crisis_id,
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
    queryFn: () => fetchResourceCategories(token, lot_category),
    enabled: !!lot_category,
  })
}

export function useInitialStock(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InitialStockPayload) =>
      createInitialStock(shelter_id, payload, user.value?.token ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crisis-operations'] }),
  })
}

export function useCreateMovement(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MovementPayload) =>
      createMovement(shelter_id, payload, user.value?.token ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crisis-operations'] }),
  })
}

export function useCheckIn(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CheckInPayload) =>
      checkIn(shelter_id, payload, user.value?.token ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crisis-operations'] }),
  })
}

export function useCheckOut(shelter_id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cpf: string) => checkOut(shelter_id, cpf, user.value?.token ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crisis-operations'] }),
  })
}

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