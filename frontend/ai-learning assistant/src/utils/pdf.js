const baseUrl = import.meta.env.VITE_API_URL;

export const getPdfUrl = (id) => `${baseUrl}/api/documents/${id}`;