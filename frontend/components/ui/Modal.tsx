import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4 text-left backdrop-blur-sm" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="glass-panel p-6 w-full max-w-md relative" style={{ borderRadius: 'var(--radius-xl, 24px)' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary transition-colors text-xl font-bold p-2 leading-none">
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
