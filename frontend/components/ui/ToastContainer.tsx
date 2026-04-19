'use client';
import { useEffect, useState } from 'react';

interface Toast {
    id: string;
    message: string;
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const originalAlert = window.alert;
            
            window.alert = (message?: any) => {
                const id = Math.random().toString(36).substr(2, 9);
                const msgStr = typeof message === 'string' ? message : String(message);
                
                setToasts(prev => [...prev, { id, message: msgStr }]);
                
                // Auto-remove after 3.5 seconds
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                }, 3500);
            };

            return () => {
                window.alert = originalAlert;
            };
        }
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setToasts([])}>
            <div className="flex flex-col gap-3 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className="flex items-center justify-between p-5 bg-white text-gray-900 rounded-xl shadow-2xl relative overflow-hidden"
                        style={{ 
                            borderLeft: '5px solid var(--primary-color)',
                            animation: 'fadeInUp 0.3s ease-out forwards'
                        }}
                    >
                        <span className="text-base font-semibold mr-6">{toast.message}</span>
                        <button 
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                            style={{ fontSize: '1.25rem', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
                            title="Close"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
