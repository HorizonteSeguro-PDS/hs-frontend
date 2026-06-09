import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSolicitacoes, aprovarSolicitacao, rejeitarSolicitacao, type Solicitacao } from '@/features/solicitacoes/api';
import { showToast } from '@/shared/services/toast';
import { useAuth } from '@/shared/contexts/useAuthContext';

const MOCK_SOLICITACOES: Solicitacao[] = [
  { id: '1', name: 'João da Silva', email: 'joao.silva@email.com', phone: '(82) 99999-1111', organization_id: 'org-1', roles: ['shelter_manager'], verified: false, created_at: '2026-06-05T10:30:00Z' },
  { id: '2', name: 'Maria Souza', email: 'maria.souza@email.com', phone: '(82) 98888-2222', organization_id: 'org-2', roles: ['shelter_manager'], verified: false, created_at: '2026-06-06T14:15:00Z' },
  { id: '3', name: 'Carlos Ferreira', email: 'carlos.f@email.com', phone: '(82) 97777-3333', organization_id: 'org-1', roles: ['shelter_manager'], verified: false, created_at: '2026-06-07T09:00:00Z' },
  { id: '4', name: 'Ana Paula Costa', email: 'ana.costa@email.com', phone: '(82) 96666-4444', organization_id: 'org-3', roles: ['shelter_manager'], verified: false, created_at: '2026-06-08T08:45:00Z' },
]

const USE_MOCK = true

export const useSolicitacoes = () => {
  const { user } = useAuth();
  const token = user.value?.token ?? '';

  return useQuery({
    queryKey: ['solicitacoes'],
    queryFn: USE_MOCK ? () => Promise.resolve(MOCK_SOLICITACOES) : () => fetchSolicitacoes(token),
    enabled: USE_MOCK || !!token,
  });
};

export const useAprovarSolicitacao = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => USE_MOCK ? Promise.resolve() : aprovarSolicitacao(id, user.value?.token ?? ''),
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
    mutationFn: (id: string) => USE_MOCK ? Promise.resolve() : rejeitarSolicitacao(id, user.value?.token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      showToast('Cadastro rejeitado.', 'info');
    },
    onError: () => {
      showToast('Erro ao rejeitar cadastro.', 'error');
    },
  });
};
