'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { Card } from '@/components/ui/Card';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productsApi.getAll()
            .then(data => {
                setProducts(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto py-4 px-4 md:px-0">
            <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h1 className="text-3xl font-bold mb-2">All Products</h1>
                <p className="text-secondary text-lg">Select a product below to customize your print options and upload your design.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-6 text-secondary animate-pulse">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <Card noHover className="text-center py-6">
                    <PackageSearch size={48} className="mx-auto text-secondary mb-3" />
                    <h3 className="font-bold text-lg mb-1">No products found</h3>
                    <p className="text-secondary mb-4">Please wait for the admin to add products to the catalog.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(p => (
                        <Link href={`/products/${p.id}`} key={p.id} className="card flex-col flex" style={{ height: '100%' }}>
                            <div
                                style={{
                                    height: '180px',
                                    backgroundColor: '#F1F5F9', // light slate
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    overflow: 'hidden'
                                }}
                            >
                                {p.images && p.images.length > 0 ? (
                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>[Image Thumbnail]</span>
                                )}
                            </div>
                            <div className="flex flex-col flex-grow pt-4">
                                <h3 className="font-bold mb-1">{p.name}</h3>
                                <p className="text-sm text-secondary mb-3 flex-grow">{p.category?.name || 'Uncategorized'}</p>

                                <div className="flex justify-between items-center mt-auto pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <span className="text-xs text-secondary font-semibold uppercase tracking-wide">Starting at</span>
                                    <span className="font-bold text-primary text-xl">€{Number(p.basePrice).toFixed(2)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
