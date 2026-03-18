'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageSearch, Trash2, Plus } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productsApi.getAll();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await productsApi.delete(String(id));
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Failed to delete product.");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Product Catalog</h1>
                    <p className="text-secondary">Manage your store's inventory and customizable print products.</p>
                </div>
                <Link href="/admin/products/create" className="btn btn-primary shadow-md">
                    <Plus size={18} className="mr-1" /> Add New Product
                </Link>
            </div>

            <Table
                columns={['ID', 'Image', 'Product Name', 'Description', 'Base Price', 'Attributes', 'Actions']}
                isLoading={loading}
                isEmpty={products.length === 0}
                emptyMessage={
                    <>
                        <PackageSearch size={40} className="mx-auto text-secondary mb-3 opacity-50" />
                        <h3 className="text-lg font-bold mb-1 text-secondary">No Products Found</h3>
                        <p className="text-sm text-secondary mb-4">You haven't added any products to your catalog yet.</p>
                        <Link href="/admin/products/create" className="btn btn-secondary text-sm">Create First Product</Link>
                    </>
                }
            >
                {products.map(p => (
                            <tr key={p.id}>
                                <td className="font-semibold text-secondary">
                                    <Link href={`/admin/products/${p.id}`} className="hover:underline text-primary">#{p.id}</Link>
                                </td>
                                <td>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '4px' }}></div>
                                </td>
                                <td className="font-bold">
                                    <Link href={`/admin/products/${p.id}`} className="hover:underline text-primary">
                                        {p.name}
                                    </Link>
                                </td>
                                <td className="text-sm text-secondary" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {p.description || '-'}
                                </td>
                                <td className="font-semibold text-primary">${Number(p.basePrice).toFixed(2)}</td>
                                <td>
                                    <span className="badge badge-user">{p.attributes ? p.attributes.length : 0} Option Groups</span>
                                </td>
                                <td className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Link href={`/admin/products/${p.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                            View
                                        </Link>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(p.id)}
                                            style={{ padding: '0.4rem', border: 'none' }}
                                            title="Delete Product"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
            </Table>
        </div>
    );
}
