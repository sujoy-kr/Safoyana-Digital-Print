'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoriesApi } from '@/lib/api/categories';
import { productsApi } from '@/lib/api/products';
import { PackageSearch, ArrowRight, Star } from 'lucide-react';

export default function Home() {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingProds, setLoadingProds] = useState(true);

    useEffect(() => {
        categoriesApi.getAll().then(data => {
            setCategories(data || []);
            setLoadingCats(false);
        }).catch(() => setLoadingCats(false));

        productsApi.getAll().then(data => {
            setProducts((data || []).slice(0, 8)); // Show only first 8 products
            setLoadingProds(false);
        }).catch(() => setLoadingProds(false));
    }, []);

    return (
        <>
            <section className="container py-8 md:py-12 text-center">
                <div className="mx-auto text-center w-full py-8 md:py-12 px-4 md:px-0">
                    <h1 className="font-bold mb-6 text-5xl md:text-[4.5rem] leading-tight" style={{ letterSpacing: '-0.04em' }}>
                        Print that makes an <br className="hidden md:block" /><span style={{ color: 'var(--accent-color)' }}>impact.</span>
                    </h1>
                    <div className="flex justify-center w-full">
                        <p className="text-lg md:text-xl mb-8 text-secondary px-4 md:px-0 text-center" style={{ maxWidth: '600px' }}>
                            Professional grade digital printing for your business. From premium business cards to large format banners, we deliver exceptional quality at scale.
                        </p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Link href="/products" className="btn btn-primary text-lg" style={{ padding: '0.75rem 2.5rem', borderRadius: 'var(--radius-full)' }}>
                            Explore All Products
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container mb-12">
                <div className="card text-center py-10" style={{ backgroundColor: 'var(--surface-hover)' }}>
                    <h2 className="text-3xl font-bold mb-4">Bring Your Ideas to Life</h2>
                    <p className="text-secondary max-w-2xl mx-auto mb-6">
                        Whether you need promotional materials, office stationery, or personalized gifts, our advanced printing technology ensures vibrant colors and lasting impressions.
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-semibold flex-wrap">
                        <span className="flex items-center"><Star size={16} className="text-primary mr-1" /> High Quality</span>
                        <span className="flex items-center"><Star size={16} className="text-primary mr-1" /> Fast Delivery</span>
                        <span className="flex items-center"><Star size={16} className="text-primary mr-1" /> Vivid Color</span>
                    </div>
                </div>
            </section>

            <section className="container mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Shop by Category</h2>
                </div>

                {loadingCats ? (
                    <div className="flex justify-center py-6 text-secondary animate-pulse">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-6 text-secondary">No categories available at the moment.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Link href={`/categories/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={cat.id} className="card text-center cursor-pointer transition-transform hover:-translate-y-1">
                                <div
                                    style={{
                                        height: '160px',
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        marginBottom: 'var(--space-4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    <span className="opacity-50 text-4xl">{cat.name.charAt(0)}</span>
                                </div>
                                <h3 className="font-semibold text-lg">{cat.name}</h3>
                                <p className="text-sm text-secondary truncate">{cat.description || 'View products'}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="container my-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Featured Products</h2>
                    <Link href="/products" className="text-primary font-semibold text-sm hover:underline flex items-center">
                        View All <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                {loadingProds ? (
                    <div className="flex justify-center py-6 text-secondary animate-pulse">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-6 text-secondary border rounded-lg p-10 bg-slate-50">
                        <PackageSearch size={48} className="mx-auto text-secondary mb-3" />
                        <h3 className="font-bold text-lg">No products found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {products.map(p => (
                            <Link href={`/products/${p.id}`} key={p.id} className="card flex-col flex" style={{ height: '100%' }}>
                                <div
                                    style={{
                                        height: '180px',
                                        backgroundColor: '#F1F5F9',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    <span>[Image]</span>
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
            </section>

            <section className="py-12 mt-auto" style={{ backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container flex flex-col md:grid md:grid-cols-3 gap-8 text-center">
                    <div style={{ padding: 'var(--space-4)' }}>
                        <div className="mb-4 text-3xl font-bold flex justify-center text-primary">⏱️</div>
                        <h4 className="font-bold text-xl mb-2">Fast Turnaround</h4>
                        <p className="text-secondary text-sm leading-relaxed">We print and ship 90% of our orders within 24 hours of file approval.</p>
                    </div>
                    <div style={{ padding: 'var(--space-4)' }}>
                        <div className="mb-4 text-3xl font-bold flex justify-center text-primary">✨</div>
                        <h4 className="font-bold text-xl mb-2">Premium Quality</h4>
                        <p className="text-secondary text-sm leading-relaxed">State of the art digital presses ensuring crisp colors and thick luxurious paper.</p>
                    </div>
                    <div style={{ padding: 'var(--space-4)' }}>
                        <div className="mb-4 text-3xl font-bold flex justify-center text-primary">✓</div>
                        <h4 className="font-bold text-xl mb-2">Satisfaction Guarantee</h4>
                        <p className="text-secondary text-sm leading-relaxed">If you aren't completely happy with your print, we will reprint it for free.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
