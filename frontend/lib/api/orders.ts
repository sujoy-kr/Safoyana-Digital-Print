import { apiClient } from '../api-client';

export const ordersApi = {
    getAll: () => apiClient<any[]>('/orders'),
    getById: (id: string) => apiClient<any>(`/orders/${id}`),
    getByUser: (userId: string) => apiClient<any[]>(`/orders/user/${userId}`),
    create: (data: any) => apiClient<any>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiClient<any>(`/orders/${id}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status }) 
    }),
};
