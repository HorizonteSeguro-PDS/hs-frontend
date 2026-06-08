const apiUrl = import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string): Promise<any> => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error(`Error logging in: ${response.statusText}`);
    }
    return response.json();
};
