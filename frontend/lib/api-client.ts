import { useAppStore } from '@/store/useAppStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
    // Add custom options if needed
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Default headers
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Inject Auth Token
    // We only access useAppStore safely on the client side
    if (typeof window !== 'undefined') {
        const token = useAppStore.getState().token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);

    // If response is not OK, we read the error and throw
    if (!response.ok) {
        let errorMessage = 'An error occurred while fetching data';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // Could not parse JSON error
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    // For 204 No Content, return empty object/null (or handle specifically)
    if (response.status === 204) {
        return null as any;
    }

    // Return parsed JSON
    return response.json();
}
