"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

export const UserNavbar: React.FC = () => {
    const { token, logout, cart } = useAppStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="navbar">
            <div className="container flex items-center justify-between">
                <Link href="/" className="nav-brand">
                    SafoyanaPrint.
                </Link>

                <nav className="flex gap-4 items-center">
                    <Link href="/products" className="font-semibold text-primary hover:text-primary-hover">All Products</Link>

                    <div className="flex gap-3 ml-4">
                        {token ? (
                            <>
                                <Link href="/profile" className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                                    <User size={20} />
                                </Link>
                                <button onClick={handleLogout} className="btn cursor-pointer hover:bg-gray-100" style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--text-secondary)' }} title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="btn btn-secondary">
                                Login
                            </Link>
                        )}

                        <Link href="/cart" className="btn btn-primary relative" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span className="absolute" style={{ top: '-5px', right: '-5px', background: 'var(--error-color)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};
