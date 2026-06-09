const apiUrl = import.meta.env.VITE_API_URL;

export interface RegisterUserPayload {
  name: string
  email: string
  password: string
  phone: string
  organization_id: string
  roles: ['shelter_manager']
}

export interface Organization {
  id: string
  name: string
}

export const registerUser = async (payload: RegisterUserPayload): Promise<any> => {
  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erro ao criar conta');
  return response.json();
};

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await fetch(`${apiUrl}/organizations`);
  if (!response.ok) throw new Error('Erro ao buscar organizações');
  return response.json();
};

export const createOrganization = async (name: string): Promise<Organization> => {
  const response = await fetch(`${apiUrl}/organizations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Erro ao criar organização');
  return response.json();
};
