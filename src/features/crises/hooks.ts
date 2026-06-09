import { getCrises, createCrisis } from './api';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useCrises = () => {
    return useQuery({
        queryKey: ['crises'],
        queryFn: getCrises,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: () => {
            return 1000 * 15;
        }
    });
};

export const useCreateCrisis = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCrisis,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crises'] });
        },
    });
};