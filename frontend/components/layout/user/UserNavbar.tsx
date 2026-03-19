"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

export const UserNavbar: React.FC = () => {
    const { token, logout, cart } = useAppStore();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="navbar relative">
            <div className="container mx-auto px-4 md:px-0 flex items-center justify-between">
                <Link href="/" className="nav-brand flex-shrink-0">
                    <img src="/logo.png" alt="SafoyanaPrint Logo" className="h-10 md:h-12 w-auto" />
                </Link>

                <nav className="flex items-center gap-2 md:gap-4">
                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-4 items-center mr-4">
                        <Link href="/products" className="font-semibold text-primary hover:text-primary-hover">All Products</Link>
                        <Link href="/about" className="font-semibold text-primary hover:text-primary-hover">About Us</Link>
                    </div>

                    {/* Persistent Icons (Cart, User, Mobile Menu Toggle) */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {token ? (
                            <>
                                <Link href="/profile" className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                                    <User size={18} />
                                </Link>
                                <button onClick={handleLogout} className="btn cursor-pointer hover:bg-gray-100 hidden sm:flex" style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-secondary)' }} title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="btn btn-secondary text-xs sm:text-sm px-3 md:px-4">
                                Login
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            className="relative bg-white border border-gray-200 rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            title="Cart"
                        >
                            <ShoppingCart size={18} className="text-black" />
                            {cart.length > 0 && (
                                <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full w-[16px] h-[16px] text-[10px] flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="md:hidden flex items-center justify-center p-2 text-primary"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full p-4 flex flex-col gap-4 shadow-xl z-50 border-t" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                    <Link 
                        href="/products" 
                        className="font-semibold text-primary text-lg border-b pb-3" 
                        style={{ borderColor: 'var(--border-color)' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        All Products
                    </Link>
                    <Link 
                        href="/about" 
                        className="font-semibold text-primary text-lg border-b pb-3" 
                        style={{ borderColor: 'var(--border-color)' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    {/* Logout button duplicated for mobile if they are logged in, since we hide it on extremely small screens (sm:hidden) */}
                    {token && (
                        <button 
                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                            className="font-semibold text-error text-lg text-left text-red-500 pb-2"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};
