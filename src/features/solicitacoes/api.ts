const apiUrl = import.meta.env.VITE_API_URL;

export interface Solicitacao {
  id: string
  name: string
  email: string
  phone: string
  roles: string[]
  status: 'pending' | 'approved' | 'rejected'
  type: 'existing_organization' | 'new_organization'
  organization_id?: string
  organization_name?: string
  created_at: string
  reviewed_at?: string
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const fetchSolicitacoes = async (token: string): Promise<Solicitacao[]> => {
  const response = await fetch(`${apiUrl}/registration-requests`, {
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Erro ao buscar solicitações');
  return response.json();
};

export const aprovarSolicitacao = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${apiUrl}/registration-requests/${id}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Erro ao aprovar solicitação');
};

export const rejeitarSolicitacao = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${apiUrl}/registration-requests/${id}/reject`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Erro ao rejeitar solicitação');
};
