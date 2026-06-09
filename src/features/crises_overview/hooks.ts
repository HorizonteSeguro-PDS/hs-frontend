import { getShelters } from './api';
import { useQuery } from '@tanstack/react-query';

export const useShelters = (crisis_id: string) => {
  return useQuery({
    queryKey: ['shelters', crisis_id],
    queryFn: () => getShelters(crisis_id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000 * 15,
  });
}