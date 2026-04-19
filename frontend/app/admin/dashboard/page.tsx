'use client';
import { useAppStore } from '@/store/useAppStore';
import { Package, Users, ListOrdered, Euro, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api/orders';
import { productsApi } from '@/lib/api/products';
import { usersApi } from '@/lib/api/users';
import { Card } from '@/components/ui/Card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

export default function AdminDashboardPage() {
    const { token } = useAppStore();
    const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
    const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

    const revenueData = [
        { name: 'Mon', revenue: 120 },
        { name: 'Tue', revenue: 300 },
        { name: 'Wed', revenue: 550 },
        { name: 'Thu', revenue: 480 },
        { name: 'Fri', revenue: 700 },
        { name: 'Sat', revenue: 850 },
        { name: 'Sun', revenue: stats.revenue || 400 }, // Link today to actual dynamic revenue
    ];

    useEffect(() => {
        if (!token) return;

        Promise.all([
            ordersApi.getAll(),
            productsApi.getAll(),
            usersApi.getAll()
        ]).then(([orders, products, users]) => {
            const orderArray = Array.isArray(orders) ? orders : [];
            const rev = orderArray.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
            
            setStats({
                orders: orderArray.length,
                products: Array.isArray(products) ? products.length : 0,
                users: Array.isArray(users) ? users.length : 0,
                revenue: rev
            });

            const pending = orderArray.filter(o => o.status === 'PENDING').length;
            const processing = orderArray.filter(o => o.status === 'PROCESSING').length;
            const completed = orderArray.filter(o => o.status === 'COMPLETED').length;
            const cancelled = orderArray.filter(o => o.status === 'CANCELLED').length;

            setOrderStatusData([
                { name: 'Pending', value: pending, color: '#F59E0B' },
                { name: 'Processing', value: processing, color: '#3B82F6' },
                { name: 'Completed', value: completed, color: '#10B981' },
                { name: 'Cancelled', value: cancelled, color: '#EF4444' },
            ].filter(d => d.value > 0));

        }).catch(console.error);

    }, [token]);

    const statCards = [
        { title: 'Total Revenue', value: `€${stats.revenue.toFixed(2)}`, icon: <Euro size={24} className="text-secondary" />, link: '/admin/orders' },
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Line Chart */}
                <Card noHover padding="p-6">
                    <h3 className="font-bold text-lg mb-6">Revenue Trend (Last 7 Days)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `€${val}`} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Orders Pie Chart */}
                <Card noHover padding="p-6">
                    <h3 className="font-bold text-lg mb-6">Order Status Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        {orderStatusData.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-secondary">
                                No active orders to display.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">

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
