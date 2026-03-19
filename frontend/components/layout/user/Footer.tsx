import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
    return (
        <footer className="mt-12" style={{ backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 'var(--space-8) 0 var(--space-6)', marginTop: 'auto' }}>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 px-4">
                <div>
                    <Link href="/">
                        <img src="/logo.png" alt="SafoyanaPrint Logo" className="h-10 mb-4 w-auto" />
                    </Link>
                    <p className="text-sm text-secondary" style={{ color: 'var(--text-secondary)' }}>High quality digital print solutions tailored for your business needs.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Company</h4>
                    <ul className="flex-col gap-2 text-sm text-secondary" style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0 }}>
                        <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link href="/products" className="hover:text-primary transition-colors">Our Products</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Contact</h4>
                    <p className="text-sm text-secondary break-all" style={{ color: 'var(--text-secondary)' }}>support@safoyanaprint.com<br />+1 234 567 890</p>
                </div>
            </div>
        </footer>
    );
};
