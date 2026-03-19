import { apiClient } from '../api-client';

export const ordersApi = {
    getAll: () => apiClient<any[]>('/order'),
    getById: (id: string) => apiClient<any>(`/order/${id}`),
    getByUser: async (userId: string) => {
        const orders = await apiClient<any[]>('/order');
        return orders.filter((order: any) => String(order.userId) === String(userId));
    },
    create: (data: any) => apiClient<any>('/order', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiClient<any>(`/order/${id}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status }) 
    }),
};
