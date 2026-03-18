'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api/orders';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await ordersApi.getAll();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, currentStatus: string, action: 'advance' | 'cancel' | 'delete') => {
        try {
            if (action === 'delete') {
                if (!confirm("Are you sure you want to completely delete this order history?")) return;
                // Since delete order doesn't exist in ordersApi yet, we could use a custom fetch or add it if needed.
                // For now we'll do:
                await fetch(`http://localhost:3000/order/${orderId}`, { method: 'DELETE' });
                fetchOrders();
                return;
            }
            
            if (action === 'cancel') {
                if (!confirm("Cancel this order?")) return;
                await fetch(`http://localhost:3000/order/${orderId}/cancel`, { method: 'PATCH' });
                fetchOrders();
                return;
            }
            
            if (action === 'advance') {
                let nextStatus = 'PENDING';
                if (currentStatus === 'PENDING') nextStatus = 'PROCESSING';
                else if (currentStatus === 'PROCESSING') nextStatus = 'COMPLETED';
                else return; // Can't advance from completed/cancelled

                await ordersApi.updateStatus(String(orderId), nextStatus);
                fetchOrders();
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
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

    if (loading) return <div className="animate-pulse">Loading orders network...</div>;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">Order Management</h1>
                <p className="text-secondary">View, advance, and manage all incoming print orders.</p>
            </div>

            <Table
                columns={['Order ID', 'Date', 'Items', 'Total', 'Status', 'Actions']}
                isLoading={loading}
                isEmpty={orders.length === 0}
                emptyMessage="No orders found in database."
            >
                {orders.map(order => (
                            <tr key={order.id}>
                                <td className="font-bold">
                                    <Link href={`/admin/orders/${order.id}`} className="hover:underline text-primary">
                                        #{order.id.toString().slice(0, 8)}
                                    </Link>
                                </td>
                                <td className="text-sm text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="text-sm">
                                    {order.items?.length || 0} item(s)
                                    {order.items && order.items.length > 0 && order.items[0].customConfig?.designFileUrl && (
                                        <div className="mt-1">
                                            <a href={order.items[0].customConfig.designFileUrl} target="_blank" className="text-primary text-xs hover:underline font-semibold">
                                                Download Design [File 1]
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="font-bold">${Number(order.totalAmount).toFixed(2)}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {order.status === 'PENDING' && (
                                            <Button onClick={() => handleStatusChange(order.id, order.status, 'advance')} variant="primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                Start Processing
                                            </Button>
                                        )}
                                        {order.status === 'PROCESSING' && (
                                            <Button onClick={() => handleStatusChange(order.id, order.status, 'advance')} variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                Mark Completed
                                            </Button>
                                        )}
                                        {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                            <Button onClick={() => handleStatusChange(order.id, order.status, 'cancel')} variant="danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                Cancel
                                            </Button>
                                        )}
                                        <button onClick={() => handleStatusChange(order.id, order.status, 'delete')} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>
                                            Drop
                                        </button>
                                        <Link href={`/admin/orders/${order.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                            View
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
            </Table>
        </div>
    );
}
