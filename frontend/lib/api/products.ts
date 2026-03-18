import { apiClient } from '../api-client';

export const productsApi = {
    getAll: () => apiClient<any[]>('/products'),
    getById: (id: string) => apiClient<any>(`/products/${id}`),
    getBySlug: (slug: string) => apiClient<any>(`/products/${slug}`),
    
    // Admin routes
    create: (data: any) => apiClient<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiClient<any>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiClient<any>(`/products/${id}`, { method: 'DELETE' }),
    uploadImages: (id: string, formData: FormData) => {
        // FormData should NOT have ‘Content-Type: application/json’
        // The fetch API will automatically set the correct multipart/form-data boundary
        return apiClient<any>(`/products/${id}/images`, {
            method: 'POST',
            body: formData,
            headers: {
                // By providing a generic Headers object we override the default 'application/json'
                // This lets browser fetch set it to 'multipart/form-data' with the boundary
            }
        });
    }
};
