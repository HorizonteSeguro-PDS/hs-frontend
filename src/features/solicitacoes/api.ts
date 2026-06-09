const apiUrl = import.meta.env.VITE_API_URL;

export interface Solicitacao {
  id: string
  name: string
  email: string
  phone: string | null
  roles: string[]
  status: 'pending' | 'approved' | 'rejected'
  request_type: string
  organization_id: string | null
  new_organization_name: string | null
  new_organization_cnpj: string | null
  new_organization_type: string | null
  new_organization_contact_email: string | null
  user_id: string | null
  created_organization_id: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
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
