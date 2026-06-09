import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser, fetchOrganizations, createOrganization, type RegisterUserPayload } from '@/features/register/api';
import { showToast } from '@/shared/services/toast';

export const useRegister = () => {
  return useMutation<unknown, unknown, RegisterUserPayload>({
    mutationFn: registerUser,
    onSuccess: () => {
      showToast('Conta criada com sucesso!', 'success');
    },
    onError: () => {
      showToast('Erro ao criar conta. Verifique os dados e tente novamente.', 'error');
    },
  });
};

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createOrganization(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      showToast('Organização criada com sucesso!', 'success');
    },
    onError: () => {
      showToast('Erro ao criar organização.', 'error');
    },
  });
};
