import { getShelters, createShelter, type CreateShelterPayload } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/contexts/useAuthContext';

export const useShelters = (crisis_id: string) => {
  return useQuery({
    queryKey: ['shelters', crisis_id],
    queryFn: () => getShelters(crisis_id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000 * 15,
  });
}

export const useCreateShelter = (crisis_id: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (payload: CreateShelterPayload) => createShelter(payload, user.value?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelters', crisis_id] });
    },
  });
};