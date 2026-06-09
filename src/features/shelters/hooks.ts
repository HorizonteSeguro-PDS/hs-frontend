import { useEffect, useState } from 'preact/hooks'
import { lookupCep, searchAddress, type AddressResult, type CepAddress } from './api'
import { useQuery } from '@tanstack/react-query';
import { getShelters } from './api';

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

export const useShelters = (crisis_id: string) => {
  return useQuery({
    queryKey: ['shelters', crisis_id],
    queryFn: () => getShelters(crisis_id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000 * 15,
  });
}