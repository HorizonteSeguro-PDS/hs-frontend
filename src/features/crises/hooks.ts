import { getCrises, createCrisis, type ApiCrisis } from './api';
import { useAuth } from '@/shared/contexts/useAuthContext';
import { getCachedCrises } from '@/shared/services/offlineCache';
import { isOnline } from '@/shared/services/syncQueue';
import { db } from '@/db/database';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Crisis } from './types';

export const useCrises = () => {
    return useQuery({
        queryKey: ['crises'],
        queryFn: async (): Promise<Crisis[]> => {
            try {
                const { mapped, raw } = await getCrises();
                // Persist raw API response to Dexie for offline use
                await db.crises.bulkPut(raw.map((c: ApiCrisis) => ({
                    id: c.id,
                    name: c.name,
                    state: c.state as any,
                    city: c.city,
                    start_date: c.start_date,
                    status: c.active ? 'active' : 'closed',
                    type: 'other' as const,
                    severity_initial: null,
                    severity_calculated: null,
                    severity_calculated_at: null,
                    organization_id: null,
                    description: null,
                    latitude: null,
                    longitude: null,
                    created_by: '',
                    created_at: '',
                    updated_at: '',
                    closed_at: null,
                    closed_by: null,
                    close_reason: null,
                })));
                return mapped;
            } catch {
                const cached = await getCachedCrises();
                if (cached.length > 0) return cached.map((c) => ({
                    id: c.id,
                    crisis_name: c.name,
                    severity: c.severity_calculated ?? c.severity_initial ?? 0,
                    state: c.state,
                    city: c.city,
                    start_date: c.start_date ?? '',
                    shelters_count: 0,
                    active: c.status === 'active',
                }));
                throw new Error('Sem conexão e nenhum dado em cache.');
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: isOnline.value ? 3 : 0,
    });
};

export const useCreateCrisis = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    return useMutation({
        mutationFn: (payload: Parameters<typeof createCrisis>[0]) =>
            createCrisis(payload, user.value?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crises'] });
        },
    });
};