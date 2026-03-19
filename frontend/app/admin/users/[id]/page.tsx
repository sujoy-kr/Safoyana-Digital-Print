'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, MapPin, Package, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usersApi } from '@/lib/api/users';
import { ordersApi } from '@/lib/api/orders';
import { Card } from '@/components/ui/Card';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    address: Address | null;
    orders: Order[];
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const userData = await usersApi.getById(id);
            if (userData) {
                let ordersData = [];
                try {
                    ordersData = await ordersApi.getByUser(id);
                } catch (err) {
                    console.warn('Could not fetch user orders', err);
                }

                setUser({
                    ...userData,
                    orders: Array.isArray(ordersData) ? ordersData : []
                });
            } else {
                alert('Failed to load user details');
                router.push('/admin/users');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Failed to load user details');
            router.push('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <span className="badge badge-pending">PENDING</span>;
            case 'PROCESSING': return <span className="badge badge-processing">PROCESSING</span>;
            case 'COMPLETED': return <span className="badge badge-success">COMPLETED</span>;
            case 'CANCELLED': return <span className="badge badge-danger">CANCELLED</span>;
            default: return <span className="badge badge-user">{status}</span>;
        }
    };

    if (loading) {
        return <div className="animate-pulse text-center py-10">Loading customer details...</div>;
    }

    if (!user) {
        return <div className="text-center py-10 text-error-color">Customer not found.</div>;
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <Link href="/admin/users" className="text-secondary text-sm flex items-center mb-6 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Customers
            </Link>

            <div className="flex justify-between items-end mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Customer Details</h1>
                    <p className="text-secondary">Viewing complete profile and order history for {user.name}.</p>
                </div>
                <div className="flex gap-2 text-sm text-secondary items-center">
                    <Calendar size={16} />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="col-span-1 flex flex-col gap-6">
                    <Card noHover>
                        <h2 className="text-xl font-bold mb-4 flex items-center"><UserIcon size={20} className="mr-2 text-primary" /> Profile</h2>

                        <div className="mb-4">
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider">Full Name</label>
                            <div className="font-semibold text-lg">{user.name}</div>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider">Email Address</label>
                            <div className="font-semibold">{user.email}</div>
                        </div>

                        <div>
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider mb-1 block">Account Role</label>
                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                                {user.role}
                            </span>
                        </div>
                    </Card>

                    <Card noHover>
                        <h2 className="text-xl font-bold mb-4 flex items-center"><MapPin size={20} className="mr-2 text-primary" /> Address</h2>

                        {user.address ? (
                            <div className="text-sm leading-relaxed">
                                <div className="font-semibold mb-1">{user.address.street}</div>
                                <div>{user.address.city}, {user.address.state} {user.address.zipCode}</div>
                                <div>{user.address.country}</div>
                            </div>
                        ) : (
                            <div className="text-sm text-secondary italic">
                                No address provided by this customer yet.
                            </div>
                        )}
                    </Card>
                </div>

                {/* Order History */}
                <div className="col-span-2">
                    <Card noHover className="h-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Package size={20} className="mr-2 text-primary" /> Order History</h2>

                        {user.orders && user.orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.orders.map(order => (
                                            <tr key={order.id}>
                                                <td className="font-mono text-sm">{order.id.slice(0, 8)}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="font-bold">€{Number(order.totalAmount).toFixed(2)}</td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td>
                                                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline text-sm font-semibold">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <Package size={32} className="mx-auto text-secondary mb-3 opacity-50" />
                                <h3 className="font-bold text-lg mb-1">No orders yet</h3>
                                <p className="text-secondary text-sm">This customer hasn't placed any orders.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
