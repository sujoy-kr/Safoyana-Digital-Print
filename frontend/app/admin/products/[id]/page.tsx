'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Package, Settings, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProductOption {
    value: string;
    label: string;
    priceAdded: number;
    image?: string;
}

interface ProductAttribute {
    id: string;
    name: string;
    type: string;
    options: ProductOption[];
}

interface ProductDetail {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    categoryId: number;
    attributes: ProductAttribute[];
    category?: { name: string };
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const data = await productsApi.getById(id);
            if (data) {
                setProduct(data);
            } else {
                alert('Failed to load product details');
                router.push('/admin/products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Failed to load product details');
            router.push('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you absolutely sure you want to delete this product? This action cannot be undone.')) return;

        try {
            await productsApi.delete(id);
            alert('Product deleted successfully');
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return <div className="animate-pulse text-center py-10">Loading product details...</div>;
    }

    if (!product) {
        return <div className="text-center py-10 text-error-color">Product not found.</div>;
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <Link href="/admin/products" className="text-secondary text-sm flex items-center mb-6 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Products
            </Link>

            <div className="flex justify-between items-start mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{product.name}</h1>
                    <div className="flex gap-4 text-sm text-secondary items-center">
                        <span className="flex items-center"><Tag size={16} className="mr-1" /> Category ID: {product.categoryId}</span>
                        <span className="flex items-center"><DollarSign size={16} className="mr-1" /> Base: ${Number(product.basePrice).toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" className="bg-white border-gray-300" onClick={() => alert('Edit feature not in prototype scope.')}>
                        <Settings size={18} className="mr-2" /> Edit Product
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <Trash2 size={18} className="mr-2" /> Delete Product
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Core Info */}
                <div className="col-span-1 flex flex-col gap-6">
                    <Card noHover>
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Package size={20} className="mr-2 text-primary" /> Product Core</h2>

                        <div className="mb-4">
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider mb-1 block">Slug (URL)</label>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded block truncate">{product.slug}</code>
                        </div>

                        <div>
                            <label className="text-xs text-secondary uppercase font-bold tracking-wider mb-1 block">Description</label>
                            <p className="text-sm leading-relaxed text-secondary whitespace-pre-wrap">{product.description}</p>
                        </div>
                    </Card>
                </div>

                {/* Schema Structure */}
                <div className="col-span-2">
                    <Card noHover className="h-full" style={{ backgroundColor: '#F8FAFC', borderColor: 'var(--primary-color)', borderWidth: '2px' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center"><Settings size={20} className="mr-2 text-primary" /> Dynamic Schema Layout</h2>
                            <span className="badge badge-admin">{product.attributes?.length || 0} Config Groups</span>
                        </div>

                        {!product.attributes || product.attributes.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300 shadow-sm">
                                <Settings size={32} className="mx-auto text-secondary mb-3 opacity-50" />
                                <h3 className="font-bold text-lg mb-1">No Dynamic Attributes</h3>
                                <p className="text-secondary text-sm">This product only has its base price.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {product.attributes.map(attr => (
                                    <div key={attr.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                                        <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <h3 className="font-bold text-lg">{attr.name}</h3>
                                            <span className="badge badge-user uppercase text-xs">{attr.type}</span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-secondary text-xs uppercase tracking-wider">
                                                        <th className="pb-2 font-bold w-1/3">Label</th>
                                                        <th className="pb-2 font-bold w-1/3">Sys Value</th>
                                                        <th className="pb-2 font-bold text-right">Added Price</th>
                                                        {attr.type === 'radio-image' && <th className="pb-2 font-bold text-right pl-2">Asset</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attr.options.map((opt, idx) => (
                                                        <tr key={idx} className="border-t border-gray-100">
                                                            <td className="py-2 font-medium">{opt.label}</td>
                                                            <td className="py-2 font-mono text-xs text-secondary">{opt.value}</td>
                                                            <td className="py-2 text-right text-success-color font-bold pl-2">
                                                                {opt.priceAdded > 0 ? `+$${Number(opt.priceAdded).toFixed(2)}` : '—'}
                                                            </td>
                                                            {attr.type === 'radio-image' && (
                                                                <td className="py-2 text-right pl-2">
                                                                    {opt.image ? (
                                                                        <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden ml-auto inline-block bg-gray-50">
                                                                            <img src={opt.image} alt="Config" className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ) : (
                                                                        <ImageIcon size={16} className="text-gray-300 inline-block" />
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
