"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api/products';

export const UserNavbar: React.FC = () => {
    const { token, logout, cart } = useAppStore();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowDropdown(true);

        const debounceTimer = setTimeout(async () => {
            try {
                const results = await productsApi.search(searchQuery);
                setSearchResults(results || []);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    return (
        <header className="navbar relative" suppressHydrationWarning>
            <div className="container mx-auto px-4 md:px-0 flex items-center justify-between">
                <Link href="/" className="nav-brand flex-shrink-0">
                    <img src="/logo.png" alt="SafoyanaPrint Logo" className="h-10 md:h-12 w-auto" />
                </Link>

                <nav className="flex items-center gap-2 md:gap-4 flex-grow justify-end">
                    
                    {/* Desktop Search Bar */}
                    <div className="hidden md:block relative max-w-sm w-full mx-4" ref={searchRef}>
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                            />
                            {isSearching && <div className="absolute right-3 w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>}
                        </div>

                        {/* Search Dropdown */}
                        {showDropdown && (
                            <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
                                {searchResults.length === 0 && !isSearching ? (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No products found for "{searchQuery}"</div>
                                ) : (
                                    searchResults.map(prod => (
                                        <Link 
                                            key={prod.id} 
                                            href={`/products/${prod.id}`} 
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                {prod.images && prod.images.length > 0 ? (
                                                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900">{prod.name}</div>
                                                <div className="text-xs text-primary font-bold">€{Number(prod.basePrice).toFixed(2)}</div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-4 items-center mr-4">
                        <Link href="/products" className="font-semibold text-primary hover:text-primary-hover whitespace-nowrap">All Products</Link>
                        <Link href="/about" className="font-semibold text-primary hover:text-primary-hover whitespace-nowrap">About Us</Link>
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
