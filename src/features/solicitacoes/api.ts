const apiUrl = import.meta.env.VITE_API_URL;

export interface Solicitacao {
  id: string
  name: string
  email: string
  phone: string
  organization_id: string
  roles: string[]
  verified: boolean
  created_at: string
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const fetchSolicitacoes = async (token: string): Promise<Solicitacao[]> => {
  const response = await fetch(`${apiUrl}/users?role=shelter_manager&verified=false`, {
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Erro ao buscar solicitações');
  return response.json();
};

export const aprovarSolicitacao = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${apiUrl}/users/${id}/verify`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ verified: true }),
  });
  if (!response.ok) throw new Error('Erro ao aprovar solicitação');
};

export const rejeitarSolicitacao = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Erro ao rejeitar solicitação');
};
