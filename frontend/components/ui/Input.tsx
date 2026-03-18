import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label}</label>}
            <input className="form-input" {...props} />
            {error && <p className="text-xs text-error-color mt-1">{error}</p>}
        </div>
    );
};
