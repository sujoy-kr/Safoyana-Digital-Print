import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'user';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    isLoading = false, 
    className = '', 
    disabled, 
    ...props 
}) => {
    return (
        <button 
            className={`btn btn-${variant} flex items-center justify-center ${className}`} 
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? <span className="animate-pulse">Loading...</span> : children}
        </button>
    );
};
