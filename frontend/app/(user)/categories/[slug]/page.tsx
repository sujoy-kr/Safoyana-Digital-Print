'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageSearch, ArrowLeft } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { Card } from '@/components/ui/Card';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [products, setProducts] = useState<any[]>([]);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            categoriesApi.getAll(),
            productsApi.getAll()
        ])
            .then(([cats, prods]) => {
                const foundCat = (cats || []).find((c: any) =>
                    (c.slug === slug) ||
                    (c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
                );

                if (foundCat) setCategory(foundCat);

                const filtered = (prods || []).filter((p: any) => {
                    const pCatSlug = p.category?.slug || (p.category?.name ? p.category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
                    return pCatSlug === slug || (foundCat && p.categoryId === foundCat.id);
                });

                setProducts(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    return (
        <div className="container mx-auto py-4 px-4 md:px-0">
            <Link href="/" className="inline-flex items-center text-sm text-secondary hover:text-primary mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>

            <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h1 className="text-3xl font-bold mb-2 capitalize">{category?.name || slug.replace(/-/g, ' ')}</h1>
                <p className="text-secondary text-lg">
                    {category?.description || `Explore our high-quality printing options for ${category?.name || slug.replace(/-/g, ' ')}.`}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-6 text-secondary animate-pulse">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <Card noHover className="text-center py-6">
                    <PackageSearch size={48} className="mx-auto text-secondary mb-3" />
                    <h3 className="font-bold text-lg mb-1">No products found</h3>
                    <p className="text-secondary mb-4">We are currently updating our catalog for this category.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        </div>
    );
}
