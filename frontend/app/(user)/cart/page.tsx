'use client';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import { Trash2, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ordersApi } from '@/lib/api/orders';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
    const { cart, removeFromCart, clearCart, token } = useAppStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleCheckout = async () => {
        if (!token) {
            alert("Please log in to complete your checkout.");
            router.push('/login');
            return;
        }

        setLoading(true);

        const orderPayload = {
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                customConfig: item.customConfig
            }))
        };

        try {
            const res = await ordersApi.create(orderPayload);
            if (res) {
                alert("Order successfully placed!");
                clearCart();
                router.push('/profile');
            } else {
                alert("Checkout Failed");
            }
        } catch (err) {
            console.error(err);
            alert('Network error during checkout.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container py-10 text-center animate-fade-in">
                <Card className="max-w-lg mx-auto py-10">
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-secondary mb-6">Looks like you haven't added any products to your cart yet.</p>
                    <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid grid-cols-3 gap-6">

                <div className="col-span-2">
                    {cart.map((item, index) => (
                        <Card key={index} className="flex gap-4 items-center mb-4">
                            <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
                                {/* Thumbnail placeholder */}
                            </div>

                            <div className="flex-grow">
                                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                <div className="text-sm text-secondary mb-2">
                                    <span className="font-semibold">Quantity:</span> {item.quantity}
                                    <br />
                                    <span className="font-semibold text-xs opacity-70">Custom config applied</span>
                                </div>
                            </div>

                            <div className="text-right mr-4">
                                <div className="font-bold text-xl">${item.totalPrice.toFixed(2)}</div>
                            </div>

                            <button
                                onClick={() => removeFromCart(index)}
                                className="btn"
                                style={{ color: 'var(--error-color)', padding: '0.5rem', border: 'none' }}
                                title="Remove from cart"
                            >
                                <Trash2 size={20} />
                            </button>
                        </Card>
                    ))}
                </div>

                <div>
                    <Card style={{ position: 'sticky', top: '100px' }}>
                        <h3 className="font-bold text-lg mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>Order Summary</h3>

                        <div className="flex justify-between mb-3 text-secondary">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-3 text-secondary">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>

                        <div className="flex justify-between mt-4 pt-4 mb-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-2xl text-primary">${cartTotal.toFixed(2)}</span>
                        </div>

                        <Button
                            className="w-full text-lg flex justify-center items-center"
                            style={{ padding: '1rem' }}
                            onClick={handleCheckout}
                            isLoading={loading}
                        >
                            <CreditCard className="mr-2" size={20} />
                            {loading ? 'Processing...' : 'Secure Checkout'}
                        </Button>

                        {!token && (
                            <p className="text-xs text-center text-secondary mt-3">
                                You will be asked to <Link href="/login" className="text-primary font-bold">log in</Link> before finalizing payment.
                            </p>
                        )}
                    </Card>
                </div>

            </div>
        </div>
    );
}
