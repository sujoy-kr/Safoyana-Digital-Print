import { apiClient } from '../api-client';

export const uploadApi = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient<{ url: string }>('/upload', {
            method: 'POST',
            body: formData,
            headers: {}
        });
        
        // Ensure the URL is absolute so it displays correctly and passes @IsUrl validation
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        if (res.url && res.url.startsWith('/')) {
            res.url = `${baseUrl}${res.url}`;
        }
        return res;
    }
};
