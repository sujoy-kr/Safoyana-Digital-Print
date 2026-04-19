import { apiClient } from '../api-client';

export const usersApi = {
    getAll: () => apiClient<any[]>('/user'),
    getById: (id: string) => apiClient<any>(`/user/${id}`),
    getProfile: () => apiClient<any>('/user/profile'),
    updateProfile: (data: any) => apiClient<any>('/user/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiClient<any>(`/user/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiClient<any>(`/user/${id}`, { method: 'DELETE' }),
};
