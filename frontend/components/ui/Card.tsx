import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noHover?: boolean;
    padding?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noHover = false, padding = 'p-6', style }) => {
    return (
        <div className={`${noHover ? 'card-no-hover' : 'card'} ${padding} ${className}`} style={style}>
            {children}
        </div>
    );
};
