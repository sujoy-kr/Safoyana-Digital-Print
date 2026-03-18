import { apiClient } from '../api-client';

export const usersApi = {
    getAll: () => apiClient<any[]>('/users'),
    getById: (id: string) => apiClient<any>(`/users/${id}`),
    getProfile: () => apiClient<any>('/users/profile'),
    updateProfile: (data: any) => apiClient<any>('/users/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiClient<any>(`/user/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiClient<any>(`/users/${id}`, { method: 'DELETE' }),
};
