'use client';
import { useAppStore } from '@/store/useAppStore';
import { Package, Users, ListOrdered, DollarSign, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api/orders';
import { productsApi } from '@/lib/api/products';
import { usersApi } from '@/lib/api/users';
import { Card } from '@/components/ui/Card';

export default function AdminDashboardPage() {
    const { token } = useAppStore();
    const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });

    useEffect(() => {
        if (!token) return;

        Promise.all([
            ordersApi.getAll(),
            productsApi.getAll(),
        ]).then(([orders, products]) => {
            const rev = Array.isArray(orders) ? orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0) : 0;
            setStats({
                orders: Array.isArray(orders) ? orders.length : 0,
                products: Array.isArray(products) ? products.length : 0,
                users: 12, // Mocked
                revenue: rev
            });
        }).catch(console.error);

    }, [token]);

    const statCards = [
        { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: <DollarSign size={24} className="text-secondary" />, link: '/admin/orders' },
        { title: 'Active Orders', value: stats.orders, icon: <ListOrdered size={24} className="text-primary" />, link: '/admin/orders' },
        { title: 'Products Listed', value: stats.products, icon: <Package size={24} className="text-success-color" />, link: '/admin/products' },
        { title: 'Registered Users', value: stats.users, icon: <Users size={24} style={{ color: '#8B5CF6' }} />, link: '/admin/users' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">Overview</h1>
                <p className="text-secondary">Welcome back. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <Card key={i} noHover padding="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-secondary text-sm font-semibold mb-1">{card.title}</h3>
                        <div className="text-3xl font-bold mb-3">{card.value}</div>

                        <Link href={card.link} className="text-sm font-semibold flex items-center gap-1 text-primary hover:underline">
                            View all <ArrowUpRight size={14} />
                        </Link>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Card noHover padding="p-6">
                    <h3 className="font-bold text-lg mb-4">Recent System Activity</h3>
                    <div className="flex flex-col gap-3">
                        <div className="text-sm pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <p><span className="font-semibold">System</span> generated daily revenue report.</p>
                            <span className="text-xs text-secondary">2 hours ago</span>
                        </div>
                        <div className="text-sm pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <p><span className="font-semibold">Admin</span> updated pricing for "Premium Business Cards".</p>
                            <span className="text-xs text-secondary">5 hours ago</span>
                        </div>
                    </div>
                </Card>

                <Card noHover padding="p-6" className="bg-slate-800 text-white">
                    <h3 className="font-bold text-lg mb-2 text-white">Quick Actions</h3>
                    <p className="text-sm mb-6 text-slate-400">Shortcuts to common administrative tasks.</p>

                    <div className="flex flex-col gap-3">
                        <Link href="/admin/products/create" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                            + Create New Dynamic Product
                        </Link>
                        <Link href="/admin/orders" className="btn bg-white text-black border-transparent hover:bg-gray-100" style={{ justifyContent: 'flex-start' }}>
                            Review Pending Orders
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
