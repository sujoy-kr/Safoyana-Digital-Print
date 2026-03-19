import { apiClient } from '../api-client';

export const categoriesApi = {
    getAll: () => apiClient<any[]>('/category'),
    getById: (id: string) => apiClient<any>(`/category/${id}`),
    create: (data: any) => apiClient<any>('/category', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
    update: (id: string, data: any) => apiClient<any>(`/category/${id}`, { method: 'PATCH', body: data instanceof FormData ? data : JSON.stringify(data) }),
    delete: (id: string) => apiClient<any>(`/category/${id}`, { method: 'DELETE' }),
};
