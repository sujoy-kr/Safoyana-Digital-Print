import { apiClient } from '../api-client';

export const authApi = {
    login: (credentials: { email: string; password: string }) => {
        return apiClient<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
    register: (data: { email: string; name: string; password: string }) => {
        return apiClient<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
