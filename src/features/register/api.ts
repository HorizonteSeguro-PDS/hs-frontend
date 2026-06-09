const apiUrl = import.meta.env.VITE_API_URL;

export interface RegisterExistingOrgPayload {
  name: string
  email: string
  password: string
  phone: string
  organization_id: string
  roles: ['shelter_manager']
}

export interface RegisterNewOrgPayload {
  name: string
  email: string
  password: string
  phone: string
  roles: ['shelter_manager']
  organization_name: string
  organization_type: string
  organization_cnpj?: string | null
  organization_contact_email?: string
}

export interface Organization {
  id: string
  name: string
}

export const registerExistingOrg = async (payload: RegisterExistingOrgPayload): Promise<any> => {
  const response = await fetch(`${apiUrl}/registration-requests/existing-organization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erro ao criar solicitação');
  return response.json();
};

export const registerNewOrg = async (payload: RegisterNewOrgPayload): Promise<any> => {
  const response = await fetch(`${apiUrl}/registration-requests/new-organization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erro ao criar solicitação');
  return response.json();
};

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await fetch(`${apiUrl}/organizations`);
  if (!response.ok) throw new Error('Erro ao buscar organizações');
  return response.json();
};
