import { apiClient } from '../api-client';

export const productsApi = {
    getAll: () => apiClient<any[]>('/product'),
    search: (q: string) => apiClient<any[]>(`/product/search?q=${encodeURIComponent(q)}`),
    getById: (id: string) => apiClient<any>(`/product/${id}`),
    getBySlug: (slug: string) => apiClient<any>(`/product/${slug}`),
    
    // Admin routes
    create: (data: any) => apiClient<any>('/product', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiClient<any>(`/product/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiClient<any>(`/product/${id}`, { method: 'DELETE' })
};
