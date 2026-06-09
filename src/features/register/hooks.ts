import { useQuery, useMutation } from '@tanstack/react-query';
import {
  registerExistingOrg, registerNewOrg, fetchOrganizations,
  type RegisterExistingOrgPayload, type RegisterNewOrgPayload,
} from '@/features/register/api';
import { showToast } from '@/shared/services/toast';

export const useRegisterExistingOrg = () => {
  return useMutation<unknown, unknown, RegisterExistingOrgPayload>({
    mutationFn: registerExistingOrg,
    onError: () => {
      showToast('Erro ao enviar solicitação. Verifique os dados e tente novamente.', 'error');
    },
  });
};

export const useRegisterNewOrg = () => {
  return useMutation<unknown, unknown, RegisterNewOrgPayload>({
    mutationFn: registerNewOrg,
    onError: () => {
      showToast('Erro ao enviar solicitação. Verifique os dados e tente novamente.', 'error');
    },
  });
};

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });
};
