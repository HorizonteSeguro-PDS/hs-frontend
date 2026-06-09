import { getCrises } from './api';

import { useQuery } from '@tanstack/react-query';

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