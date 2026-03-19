'use client';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { Package, MapPin, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api/orders';
import { usersApi } from '@/lib/api/users';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
    const { token, role, logout } = useAppStore();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'address'>('orders');

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Address states
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [stateProp, setStateProp] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    // Since we rely on simple JWT, if there is no token it shouldn't be here (middleware should catch it, but double checking client side)
    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch orders using ordersApi
                // The API client automatically adds the token
                const ordersData = await ordersApi.getAll();
                setOrders(Array.isArray(ordersData) ? ordersData : []);

                // For prototype user fetching, we fetch the first user (mock behavior for profile)
                const meData = await usersApi.getById('1');
                if (meData) {
                    setUser(meData);
                    setName(meData.name || '');
                    setEmail(meData.email || '');

                    if (meData.address) {
                        setStreet(meData.address.street || '');
                        setCity(meData.address.city || '');
                        setStateProp(meData.address.state || '');
                        setZipCode(meData.address.zipCode || '');
                        setCountry(meData.address.country || '');
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch profile/orders', err);
                logout();
                router.push('/login');
            }
        };

        fetchData();
    }, [token, router, logout]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Using user 1 for prototype
            const res = await usersApi.update('1', { name, email });
            if (res) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            alert('Error updating profile');
        }
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Using user 1 for prototype
            const res = await usersApi.update('1', { address: { street, city, state: stateProp, zipCode, country } });
            if (res) {
                alert('Address updated successfully!');
            } else {
                alert('Failed to update address');
            }
        } catch (err) {
            alert('Error updating address');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
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
        return <div className="container mx-auto py-8 text-center animate-pulse">Loading profile data...</div>;
    }

    return (
        <div className="container mx-auto py-8 animate-fade-in">
            <div className="flex justify-between items-end mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Account</h1>
                    <p className="text-secondary">Manage your orders and personal details.</p>
                </div>
                <Button variant="secondary" onClick={handleLogout}>Log Out</Button>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {/* Sidebar Nav (Pseudo) */}
                <div className="col-span-1">
                    <Card noHover className="p-4 pb-2">
                        <div
                            className={`admin-nav-item ${activeTab === 'orders' ? 'active font-semibold' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Package size={18} /> Order History
                        </div>
                        <div
                            className={`admin-nav-item ${activeTab === 'profile' ? 'active font-semibold' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('profile')}
                        >
                            <UserIcon size={18} /> Profile Details
                        </div>
                        <div
                            className={`admin-nav-item ${activeTab === 'address' ? 'active font-semibold' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('address')}
                        >
                            <MapPin size={18} /> Addresses
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="col-span-3">
                    {activeTab === 'orders' && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Order History</h2>

                            {orders.length === 0 ? (
                                <Card className="text-center py-8">
                                    <Package size={32} className="mx-auto text-secondary mb-3" />
                                    <h3 className="font-bold text-lg mb-2">No orders yet</h3>
                                    <p className="text-secondary mb-4">When you place an order, it will appear here so you can track its status.</p>
                                    <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                                </Card>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {orders.map((order: any) => (
                                        <Card noHover key={order.id}>
                                            <div className="flex justify-between items-center mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <div>
                                                    <span className="text-xs text-secondary uppercase font-bold tracking-wider">Order #{order.id.slice(0, 8)}</span>
                                                    <div className="text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="mb-1">{getStatusBadge(order.status)}</div>
                                                    <div className="font-bold text-primary">€{Number(order.totalAmount).toFixed(2)}</div>
                                                </div>
                                            </div>

                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 items-center mt-3">
                                                    <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}></div>
                                                    <div>
                                                        <h4 className="font-bold text-sm">{item.product?.name || 'Unknown Product'}</h4>
                                                        <div className="text-xs text-secondary">
                                                            Qty: {item.quantity} | Unit Price: €{Number(item.unitPrice).toFixed(2)}
                                                        </div>
                                                        {item.customConfig && (item.customConfig.designFileUrl || item.customConfig.designFile) && (
                                                            <a href={item.customConfig.designFileUrl || item.customConfig.designFile} target="_blank" className="text-primary text-xs hover:underline mt-1 inline-block">View Design File →</a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'profile' && (
                        <Card noHover className="max-w-2xl">
                            <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
                            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                                <Input
                                    label="Full Name"
                                    required
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="mb-0"
                                />
                                <Input
                                    label="Email Address"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="mb-0"
                                />
                                <div className="mt-2">
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {activeTab === 'address' && (
                        <Card noHover className="max-w-2xl">
                            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                            <form onSubmit={handleUpdateAddress} className="flex flex-col gap-4">
                                <Input
                                    label="Street Address"
                                    required
                                    type="text"
                                    value={street}
                                    onChange={e => setStreet(e.target.value)}
                                    className="mb-0"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        required
                                        type="text"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        className="mb-0"
                                    />
                                    <Input
                                        label="State / Province"
                                        required
                                        type="text"
                                        value={stateProp}
                                        onChange={e => setStateProp(e.target.value)}
                                        className="mb-0"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Zip / Postal Code"
                                        required
                                        type="text"
                                        value={zipCode}
                                        onChange={e => setZipCode(e.target.value)}
                                        className="mb-0"
                                    />
                                    <Input
                                        label="Country"
                                        required
                                        type="text"
                                        value={country}
                                        onChange={e => setCountry(e.target.value)}
                                        className="mb-0"
                                    />
                                </div>
                                <div className="mt-4">
                                    <Button type="submit">Save Address</Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
