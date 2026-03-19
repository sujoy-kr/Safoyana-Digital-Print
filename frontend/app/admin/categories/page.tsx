'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Archive } from 'lucide-react';
import { categoriesApi } from '@/lib/api/categories';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
    isActive: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [editingCategory, setEditingCategory] = useState<any>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', finalSlug);
            
            // Only basic fields needed by CreateCategoryDto
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (editingCategory && imagePreview) {
                // If editing and didn't pick a new file, we can optionally pass the old string url
                formData.append('image', imagePreview);
            }

            if (editingCategory) {
                await categoriesApi.update(editingCategory.id, formData);
            } else {
                await categoriesApi.create(formData);
            }
            
            setShowModal(false);
            setName('');
            setSlug('');
            setDescription('');
            setImagePreview('');
            setImageFile(null);
            fetchCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
            alert('Failed to create category or network error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesApi.delete(String(id));
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Failed to delete category or network error');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-secondary">Manage product catalog categories.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center">
                    <Plus size={18} className="mr-2" /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 animate-pulse text-secondary">Loading categories...</div>
            ) : categories.length === 0 ? (
                <div className="card-no-hover text-center py-16">
                    <Archive size={48} className="mx-auto text-secondary mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No categories found</h3>
                    <p className="text-secondary mb-6">Create your first category to start organizing products.</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        Create Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Card key={category.id} className="flex flex-col h-full">
                            {category.image && (
                                <div className="h-40 -mt-6 -mx-6 mb-4 bg-gray-100 rounded-t-xl overflow-hidden relative">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-xl">{category.name}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDelete(category.id)} className="text-secondary hover:text-error-color transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-secondary text-sm flex-grow mb-4">{category.description || 'No description provided.'}</p>
                            <div className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                                Status:
                                <span className={category.isActive ? "text-success-color" : "text-error-color"}>
                                    {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Category Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Category"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
                    <Input
                        label="Category Name *"
                        required
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mb-0"
                    />

                    <div className="form-group mb-0">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label">Category Image (File)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-input"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        {imagePreview && (
                            <div className="mt-2 h-20 w-32 rounded border border-gray-700 overflow-hidden bg-gray-900">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="border border-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Category
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
