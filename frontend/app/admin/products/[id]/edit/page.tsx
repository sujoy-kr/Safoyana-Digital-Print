'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Settings, GripVertical, Save } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { uploadApi } from '@/lib/api/upload';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Helper to generate a unique ID for dynamic attributes
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AppOption {
    value: string;
    label: string;
    priceAdded: number;
    image?: string;
}

interface AppAttribute {
    id: string;
    name: string;
    type: 'dropdown' | 'radio-text' | 'radio-image';
    options: AppOption[];
}

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { token } = useAppStore();

    // Basic Info
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('10.00');
    const [categoryId, setCategoryId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    
    // Dynamic JSON Attributes Engine
    const [attributes, setAttributes] = useState<AppAttribute[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch categories
                const cats = await categoriesApi.getAll();
                setCategories(cats || []);

                // Fetch existing product
                if (id) {
                    const prod = await productsApi.getById(id);
                    if (prod) {
                        setName(prod.name || '');
                        setDescription(prod.description || '');
                        setBasePrice(Number(prod.basePrice).toFixed(2) || '10.00');
                        setCategoryId(prod.categoryId ? prod.categoryId.toString() : (cats.length > 0 ? cats[0].id.toString() : ''));
                        setImageUrl(prod.images && prod.images.length > 0 ? prod.images[0] : '');
                        setAttributes(prod.attributes || []);
                    } else {
                        alert('Product not found');
                        router.push('/admin/products');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch initial data", err);
                alert('Failed to load product data');
                router.push('/admin/products');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [id, router]);

    const addAttribute = () => {
        setAttributes([...attributes, {
            id: generateId(),
            name: 'New Option Group',
            type: 'dropdown',
            options: [{ value: 'opt1', label: 'Default Option', priceAdded: 0 }]
        }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (index: number, key: keyof AppAttribute, val: any) => {
        const newAttrs = [...attributes];
        newAttrs[index] = { ...newAttrs[index], [key]: val };
        setAttributes(newAttrs);
    };

    const addOptionToAttribute = (attrIndex: number) => {
        const newAttrs = [...attributes];
        newAttrs[attrIndex].options.push({ value: `opt_${generateId()}`, label: 'New Choice', priceAdded: 0 });
        setAttributes(newAttrs);
    };

    const removeOption = (attrIndex: number, optIndex: number) => {
        const newAttrs = [...attributes];
        newAttrs[attrIndex].options = newAttrs[attrIndex].options.filter((_, i) => i !== optIndex);
        setAttributes(newAttrs);
    };

    const updateOption = (attrIndex: number, optIndex: number, key: keyof AppOption, val: any) => {
        const newAttrs = [...attributes];
        newAttrs[attrIndex].options[optIndex] = { ...newAttrs[attrIndex].options[optIndex], [key]: val };
        setAttributes(newAttrs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-generate a slug securely
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const payload = {
            name,
            slug,
            description,
            basePrice: parseFloat(basePrice) || 0,
            categoryId: categoryId.toString(),
            images: imageUrl ? [imageUrl] : ["https://placehold.co/600x400?text=App+Product"],
            attributes
        };

        try {
            await productsApi.update(id, payload);
            alert("Product updated successfully!");
            router.push(`/admin/products/${id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update product or network error.');
        }
    };

    if (loading) {
        return <div className="text-center py-10 animate-pulse text-secondary">Loading editor...</div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <Link href={`/admin/products/${id}`} className="text-secondary text-sm flex items-center mb-4 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Product
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Edit Product</h1>
                <p className="text-secondary">Modify the core details and dynamic customization schema for this product.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Core Details */}
                <Card noHover padding="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center"><Settings size={20} className="mr-2 text-primary" /> Core Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group col-span-2">
                            <label className="form-label">Product Name</label>
                            <input required type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Premium Business Cards" />
                        </div>

                        <div className="form-group col-span-2">
                            <label className="form-label">Description</label>
                            <textarea required className="form-input" style={{ minHeight: '100px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the physical qualities of this product..." />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Base Price (€)</label>
                            <input required type="number" step="0.01" className="form-input" value={basePrice} onChange={e => setBasePrice(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Image (File)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="form-input" 
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            const res = await uploadApi.upload(file);
                                            setImageUrl(res.url);
                                        } catch (err) {
                                            console.error('Upload failed', err);
                                            alert('Failed to upload image');
                                        }
                                    }
                                }} 
                            />
                            {imageUrl && (
                                <div className="mt-2 h-20 w-32 rounded border border-gray-700 overflow-hidden bg-gray-900 relative group">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="form-group col-span-2">
                            <label className="form-label">Category</label>
                            <select required className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                                {categories.length === 0 && <option value="" disabled>No Categories Found</option>}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Dynamic Schema Builder */}
                <div className="card-no-hover" style={{ borderColor: 'var(--border-color)', borderWidth: '1px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold">Customization Schema</h2>
                            <p className="text-sm text-secondary">Define the options the user will see (e.g., Paper Type, Size, Coating).</p>
                        </div>
                        <button type="button" onClick={addAttribute} className="btn btn-primary btn-sm flex items-center">
                            <Plus size={16} className="mr-1" /> Add Option Group
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        {attributes.length === 0 && (
                            <div className="text-center py-6 text-secondary border-2 border-dashed border-gray-800 rounded-lg">
                                No customization options added yet. Product will only have the base price.
                            </div>
                        )}

                        {attributes.map((attr, attrIndex) => (
                            <div key={attr.id} className="card-no-hover mb-6 last:mb-0" style={{ borderLeft: '4px solid var(--accent-color)', backgroundColor: 'var(--surface-hover)' }}>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4 flex-grow mr-4">
                                        <div className="form-group w-full mb-0">
                                            <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Group Name</label>
                                            <input type="text" className="form-input font-bold" value={attr.name} onChange={e => updateAttribute(attrIndex, 'name', e.target.value)} />
                                        </div>
                                        <div className="form-group mb-0" style={{ width: '200px' }}>
                                            <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">UI Type</label>
                                            <select className="form-input" value={attr.type} onChange={e => updateAttribute(attrIndex, 'type', e.target.value)}>
                                                <option value="dropdown">Dropdown List</option>
                                                <option value="radio-text">Text Boxes</option>
                                                <option value="radio-image">Image Boxes</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeAttribute(attrIndex)} className="btn text-secondary hover:text-error-color" style={{ border: 'none', background: 'transparent', padding: '0.5rem' }}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {/* Options List for this Attribute */}
                                <div className="pl-4 ml-2 mt-4" style={{ borderLeft: '2px solid var(--border-color)' }}>
                                    <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 block">Available Choices</label>

                                    <div className="flex flex-col gap-2">
                                        {attr.options.map((opt, optIndex) => (
                                            <div key={optIndex} className="flex gap-2 items-center bg-black/20 p-2 rounded border border-white/5 shadow-sm relative group">
                                                <GripVertical size={16} className="text-gray-400" />
                                                <div className="flex-grow grid grid-cols-4 gap-2">
                                                    <input type="text" className="form-input text-sm px-2 py-1 h-8 col-span-2" value={opt.label} onChange={e => updateOption(attrIndex, optIndex, 'label', e.target.value)} placeholder="Label (e.g., 300g Matte)" />
                                                    <input type="text" className="form-input text-sm px-2 py-1 h-8" value={opt.value} onChange={e => updateOption(attrIndex, optIndex, 'value', e.target.value)} placeholder="System Value" />
                                                    <div className="flex items-center">
                                                        <span className="text-secondary text-sm mr-1 w-6">+ €</span>
                                                        <input type="number" step="0.01" className="form-input text-sm px-2 py-1 h-8 w-full" value={opt.priceAdded} onChange={e => updateOption(attrIndex, optIndex, 'priceAdded', parseFloat(e.target.value) || 0)} />
                                                    </div>
                                                </div>
                                                {attr.type === 'radio-image' && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="form-input text-sm px-2 py-1 h-8"
                                                            style={{ width: '130px' }}
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    try {
                                                                        const res = await uploadApi.upload(file);
                                                                        updateOption(attrIndex, optIndex, 'image', res.url);
                                                                    } catch (err) {
                                                                        console.error('Upload failed', err);
                                                                        alert('Failed to upload option image');
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        {opt.image && (
                                                            <div className="w-8 h-8 rounded overflow-hidden">
                                                                <img src={opt.image} alt="prev" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <button type="button" onClick={() => removeOption(attrIndex, optIndex)} className="text-gray-400 hover:text-red-500 transition-colors ml-2" title="Remove choice">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button type="button" onClick={() => addOptionToAttribute(attrIndex)} className="text-sm font-semibold text-primary hover:underline mt-3 flex items-center">
                                        <Plus size={14} className="mr-1" /> Add Choice
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 mb-10">
                    <Link href={`/admin/products/${id}`} className="btn btn-secondary border-gray-700 hover:bg-gray-800">Cancel</Link>
                    <button type="submit" className="btn btn-primary shadow-lg flex items-center" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
                        <Save size={20} className="mr-2" /> Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
}
