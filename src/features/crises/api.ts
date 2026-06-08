const apiUrl = import.meta.env.API_URL

export const getCrises = async (): Promise<any> => {
    const response = await fetch(`${apiUrl}/crises`);
    if (!response.ok) {
        throw new Error(`Error fetching crises: ${response.statusText}`);
    }
    return response.json();
};