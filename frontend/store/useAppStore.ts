import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    name: string;
    quantity: number;
    totalPrice: number;
    customConfig: Record<string, any>;
}

interface AppState {
    // Auth State
    token: string | null;
    role: 'USER' | 'ADMIN' | null;
    setAuth: (token: string, role: 'USER' | 'ADMIN') => void;
    logout: () => void;

    // Cart State
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Auth Initial
            token: null,
            role: null,

            setAuth: (token, role) => set({ token, role }),
            logout: () => set({ token: null, role: null, cart: [] }),

            // Cart Initial
            cart: [],

            addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
            removeFromCart: (index) => set((state) => ({
                cart: state.cart.filter((_, i) => i !== index)
            })),
            clearCart: () => set({ cart: [] }),
        }),
        {
            name: 'safoyana-storage',
        }
    )
);
