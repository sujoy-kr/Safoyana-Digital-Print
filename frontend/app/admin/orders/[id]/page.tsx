'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User as UserIcon, Calendar, Euro, Settings, Receipt } from 'lucide-react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api/orders';
import { Card } from '@/components/ui/Card';

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    customConfig: Record<string, any>;
    product?: { name: string; slug: string };
}

interface OrderDetail {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    userId: string;
    user?: { name: string; email: string };
    items: OrderItem[];
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const data = await ordersApi.getById(id);
            if (data) {
                setOrder(data);
            } else {
                alert('Failed to load order details');
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            alert('Failed to load order details');
            router.push('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const updated = await ordersApi.updateStatus(id, newStatus);
            if (updated) {
                setOrder(updated);
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status or network error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <span className="badge badge-pending text-sm px-3 py-1">PENDING</span>;
            case 'PROCESSING': return <span className="badge badge-processing text-sm px-3 py-1">PROCESSING</span>;
            case 'COMPLETED': return <span className="badge badge-success text-sm px-3 py-1">COMPLETED</span>;
            case 'CANCELLED': return <span className="badge badge-danger text-sm px-3 py-1">CANCELLED</span>;
            default: return <span className="badge badge-user text-sm px-3 py-1">{status}</span>;
        }
    };

    if (loading) {
        return <div className="animate-pulse text-center py-10">Loading order details...</div>;
    }

    if (!order) {
        return <div className="text-center py-10 text-error-color">Order not found.</div>;
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto pb-10">
            <Link href="/admin/orders" className="text-secondary text-sm flex items-center mb-6 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Orders
            </Link>

            <div className="flex justify-between items-start mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight flex items-center">
                        Order #{order.id.slice(0, 8)}
                    </h1>
                    <div className="flex gap-4 text-sm text-secondary items-center">
                        <span className="flex items-center"><Calendar size={16} className="mr-1 text-primary" /> {new Date(order.createdAt).toLocaleString()}</span>
                        <span className="flex items-center"><Receipt size={16} className="mr-1 text-primary" /> Total: <strong className="ml-1 text-black">€{Number(order.totalAmount).toFixed(2)}</strong></span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    <select
                        className="form-input text-sm py-1 h-auto mt-2 cursor-pointer"
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updatingStatus}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Details */}
                <div className="col-span-1 flex flex-col gap-6">
                    <Card noHover>
                        <h2 className="text-xl font-bold mb-4 flex items-center"><UserIcon size={20} className="mr-2 text-primary" /> Customer Info</h2>

                        <div className="mb-4">
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider mb-1 block">Name</label>
                            <div className="font-semibold text-lg">{order.user?.name || 'Unknown User'}</div>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider mb-1 block">Account</label>
                            <div className="text-sm">{order.user?.email || order.userId}</div>
                        </div>

                        <Link href={`/admin/users/${order.userId}`} className="text-primary hover:underline text-sm font-semibold flex items-center mt-2 w-max">
                            View Full Profile <ArrowLeft size={14} className="ml-1 rotate-180" />
                        </Link>
                    </Card>

                    <Card noHover>
                        <h2 className="text-lg font-bold mb-3 flex items-center"><Euro size={18} className="mr-2 text-primary" /> Payment Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">Subtotal</span>
                                <span>€{Number(order.totalAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary">Shipping</span>
                                <span>€0.00</span>
                            </div>
                            <div className="flex justify-between pt-2 mt-2 font-bold text-base" style={{ borderTop: '1px solid var(--border-color)' }}>
                                <span>Total</span>
                                <span>€{Number(order.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Ordered Items */}
                <div className="col-span-2">
                    <Card noHover className="h-full" style={{ backgroundColor: '#F8FAFC', borderColor: 'var(--primary-color)', borderWidth: '2px' }}>
                        <h2 className="text-xl font-bold mb-6 flex items-center"><Package size={20} className="mr-2 text-primary" /> Order Manifest / Line Items</h2>

                        {order.items && order.items.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {order.items.map((item, idx) => (
                                    <div key={item.id || idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                                        <div className="flex justify-between items-start mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                                                    <Package size={24} className="text-secondary opacity-50" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{item.product?.name || `Product #${item.productId}`}</h3>
                                                    <div className="text-xs text-secondary font-mono mt-1">Item ID: {item.id}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg">€{(item.unitPrice * item.quantity).toFixed(2)}</div>
                                                <div className="text-sm text-secondary">{item.quantity} × €{Number(item.unitPrice).toFixed(2)}</div>
                                            </div>
                                        </div>

                                        {/* Configuration Details - The critical part for digital print */}
                                        <div>
                                            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 flex items-center">
                                                <Settings size={14} className="mr-1" /> Customer Configuration
                                            </h4>

                                            {item.customConfig ? (
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 p-3 rounded border border-gray-100 text-sm">
                                                    {Object.entries(item.customConfig)
                                                        .filter(([key]) => key !== 'designFileUrl' && key !== 'designFile') // separate file rendering
                                                        .map(([key, val]) => (
                                                            <div key={key} className="flex flex-col">
                                                                <span className="text-xs text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                                <span className="font-medium">{String(val)}</span>
                                                            </div>
                                                        ))
                                                    }

                                                    {/* Handling file separately */}
                                                    {(item.customConfig.designFileUrl || item.customConfig.designFile) && (
                                                        <div className="col-span-2 mt-2 pt-2" style={{ borderTop: '1px solid #E5E7EB' }}>
                                                            <span className="text-xs text-secondary capitalize block mb-1">Design Asset</span>
                                                            {item.customConfig.designFile && item.customConfig.designFile.startsWith('data:image') ? (
                                                                <div className="mt-1">
                                                                    <a href={item.customConfig.designFile} download={`design_asset_order_${order.id.slice(0, 4)}.png`} className="text-primary hover:underline font-medium text-xs">
                                                                        Download Design Asset (Base64)
                                                                    </a>
                                                                    <div className="w-24 h-24 mt-2 border rounded overflow-hidden">
                                                                        <img src={item.customConfig.designFile} alt="Design Design" className="w-full h-full object-cover" />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <a
                                                                    href={item.customConfig.designFileUrl || item.customConfig.designFile}
                                                                    target="_blank"
                                                                    className="text-primary hover:underline font-medium"
                                                                >
                                                                    View Supplied File ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-secondary italic">Standard item. No custom configuration provided.</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-secondary border border-dashed border-gray-300 rounded-lg">
                                No items found in this order logic.
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
