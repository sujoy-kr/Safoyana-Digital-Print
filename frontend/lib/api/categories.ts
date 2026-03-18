import { apiClient } from '../api-client';

export const categoriesApi = {
    getAll: () => apiClient<any[]>('/categories'),
    getById: (id: string) => apiClient<any>(`/categories/${id}`),
    create: (data: any) => apiClient<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiClient<any>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiClient<any>(`/categories/${id}`, { method: 'DELETE' }),
};
