import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSolicitacoes, aprovarSolicitacao, rejeitarSolicitacao } from '@/features/solicitacoes/api';
import { showToast } from '@/shared/services/toast';
import { useAuth } from '@/shared/contexts/useAuthContext';

export const useSolicitacoes = () => {
  const { user } = useAuth();
  const token = user.value?.token ?? '';

  return useQuery({
    queryKey: ['solicitacoes'],
    queryFn: () => fetchSolicitacoes(token),
    enabled: !!token,
  });
};

export const useAprovarSolicitacao = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aprovarSolicitacao(id, user.value?.token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      showToast('Cadastro aprovado com sucesso!', 'success');
    },
    onError: () => {
      showToast('Erro ao aprovar cadastro.', 'error');
    },
  });
};

export const useRejeitarSolicitacao = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejeitarSolicitacao(id, user.value?.token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      showToast('Cadastro rejeitado.', 'info');
    },
    onError: () => {
      showToast('Erro ao rejeitar cadastro.', 'error');
    },
  });
};
