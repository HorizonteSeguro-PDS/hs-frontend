import { useQuery, useMutation } from '@tanstack/react-query';
import {
  registerExistingOrg, registerNewOrg, fetchOrganizations,
  type RegisterExistingOrgPayload, type RegisterNewOrgPayload,
} from '@/features/register/api';
import { showToast } from '@/shared/services/toast';

const onRegisterError = () => showToast('Erro ao enviar solicitação. Verifique os dados e tente novamente.', 'error');

export const useRegisterExistingOrg = () =>
  useMutation<unknown, unknown, RegisterExistingOrgPayload>({ mutationFn: registerExistingOrg, onError: onRegisterError });

export const useRegisterNewOrg = () =>
  useMutation<unknown, unknown, RegisterNewOrgPayload>({ mutationFn: registerNewOrg, onError: onRegisterError });

export const useOrganizations = (enabled = true) =>
  useQuery({ queryKey: ['organizations'], queryFn: fetchOrganizations, enabled });
