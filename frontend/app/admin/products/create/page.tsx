'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Settings, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
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

export default function CreateProductPage() {
    const router = useRouter();
    const { token } = useAppStore();

    // Basic Info
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('10.00');
    const [categoryId, setCategoryId] = useState(''); // Will be set to first category dynamically
    const [imageUrl, setImageUrl] = useState(''); // Added image URL state
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesApi.getAll();
                setCategories(data);
                if (data.length > 0) {
                    setCategoryId(data[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    // Dynamic JSON Attributes Engine
    const [attributes, setAttributes] = useState<AppAttribute[]>([]);

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
            images: imageUrl ? [imageUrl] : ["https://placehold.co/600x400?text=App+Product"], // Pass as array of strings
            attributes
        };

        try {
            await productsApi.create(payload);
            alert("Dynamic Product generated successfully!");
            router.push('/admin/products');
        } catch (err) {
            console.error(err);
            alert('Failed to build product or network error.');
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <Link href="/admin/products" className="text-secondary text-sm flex items-center mb-4 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Products
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Dynamic Product Builder</h1>
                <p className="text-secondary">Configure the core product and define its flexible customization schema.</p>
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
                            <label className="form-label">Base Price ($)</label>
                            <input required type="number" step="0.01" className="form-input" value={basePrice} onChange={e => setBasePrice(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Main Image URL</label>
                            <input type="url" className="form-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
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
                <div className="card-no-hover" style={{ backgroundColor: '#F8FAFC', borderColor: 'var(--primary-color)', borderWidth: '2px' }}>
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
                            <div className="text-center py-6 text-secondary border-2 border-dashed border-gray-300 rounded-lg">
                                No customization options added yet. Product will only have the base price.
                            </div>
                        )}

                        {attributes.map((attr, attrIndex) => (
                            <div key={attr.id} className="card-no-hover" style={{ borderLeft: '4px solid var(--primary-color)' }}>

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
                                            <div key={optIndex} className="flex gap-2 items-center bg-white p-2 rounded border border-gray-200 shadow-sm relative group">
                                                <GripVertical size={16} className="text-gray-400" />
                                                <div className="flex-grow grid grid-cols-4 gap-2">
                                                    <input type="text" className="form-input text-sm px-2 py-1 h-8 col-span-2" value={opt.label} onChange={e => updateOption(attrIndex, optIndex, 'label', e.target.value)} placeholder="Label (e.g., 300g Matte)" />
                                                    <input type="text" className="form-input text-sm px-2 py-1 h-8" value={opt.value} onChange={e => updateOption(attrIndex, optIndex, 'value', e.target.value)} placeholder="System Value" />
                                                    <div className="flex items-center">
                                                        <span className="text-secondary text-sm mr-1 w-6">+ $</span>
                                                        <input type="number" step="0.01" className="form-input text-sm px-2 py-1 h-8 w-full" value={opt.priceAdded} onChange={e => updateOption(attrIndex, optIndex, 'priceAdded', parseFloat(e.target.value) || 0)} />
                                                    </div>
                                                </div>
                                                {attr.type === 'radio-image' && (
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="form-input text-sm px-2 py-1 h-8"
                                                        style={{ width: '150px' }}
                                                        onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    updateOption(attrIndex, optIndex, 'image', reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
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
                    <Link href="/admin/products" className="btn btn-secondary bg-white text-black border-gray-300 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" className="btn btn-primary shadow-lg" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>Inject Product Schema</button>
                </div>

            </form>
        </div>
    );
}
