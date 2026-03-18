import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, LogOut, Settings, ListOrdered } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const AdminSidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAppStore();

    const handleLogout = () => {
        logout();
        document.cookie = 'token=; Max-Age=0; path=/;';
        document.cookie = 'role=; Max-Age=0; path=/;';
        router.push('/admin-login');
    };

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Orders', path: '/admin/orders', icon: <ListOrdered size={20} /> },
        { label: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { label: 'Categories', path: '/admin/categories', icon: <Package size={20} /> },
        { label: 'Customers', path: '/admin/users', icon: <Users size={20} /> },
    ];

    return (
        <aside className="admin-sidebar" style={{ position: 'sticky', top: 0, height: '100vh' }}>
            <div className="mb-8 mt-2">
                <h2 className="text-xl font-bold text-primary tracking-tight">Safoyana OS</h2>
                <span className="badge badge-admin mt-1">Admin Mode</span>
            </div>

            <nav className="flex flex-col gap-1 flex-grow">
                {menuItems.map(item => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`admin-nav-item ${pathname.startsWith(item.path) ? 'active' : ''}`}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="admin-nav-item" style={{ cursor: 'pointer' }} onClick={() => alert('Settings not configured in prototype')}>
                    <Settings size={20} /> System Settings
                </div>
                <div className="admin-nav-item" style={{ cursor: 'pointer', color: 'var(--error-color)' }} onClick={handleLogout}>
                    <LogOut size={20} /> Terminate Session
                </div>
            </div>
        </aside>
    );
};
