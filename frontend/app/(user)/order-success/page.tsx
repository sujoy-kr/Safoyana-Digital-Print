'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="container mx-auto py-12 md:py-20 px-4 animate-fade-in flex justify-center items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Card className="max-w-2xl w-full text-center py-12 px-6 md:px-12 relative overflow-hidden">
                {/* Decorative background circle */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
                    style={{ backgroundColor: 'var(--success-color, #10B981)', filter: 'blur(40px)' }}
                ></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color, #10B981)' }}
                    >
                        <CheckCircle size={40} strokeWidth={2.5} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Successful!</h1>
                    
                    <p className="text-secondary text-lg mb-8 max-w-md mx-auto">
                        Thank you for your purchase. We've received your order and are getting it ready to be processed.
                    </p>

                    {orderId && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 mb-8 w-full max-w-sm" style={{ border: '1px solid var(--border-color)' }}>
                            <div className="text-sm text-secondary uppercase tracking-wider font-semibold mb-1">Order Number</div>
                            <div className="text-xl font-mono font-bold">{orderId}</div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full mt-2">
                        <Link href="/profile" className="w-full sm:w-auto">
                            <Button variant="secondary" className="w-full flex items-center justify-center gap-2" style={{ padding: '0.75rem 1.5rem' }}>
                                <Package size={18} />
                                View Order
                            </Button>
                        </Link>
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button className="w-full flex items-center justify-center gap-2" style={{ padding: '0.75rem 1.5rem' }}>
                                <ShoppingBag size={18} />
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
