'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Save } from 'lucide-react';
import Link from 'next/link';
import { categoriesApi } from '@/lib/api/categories';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function EditCategoryPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await categoriesApi.getById(id);
                if (data) {
                    setName(data.name || '');
                    setDescription(data.description || '');
                    setImagePreview(data.image || '');
                } else {
                    alert('Category not found');
                    router.push('/admin/categories');
                }
            } catch (err) {
                console.error("Failed to fetch category", err);
                alert('Failed to load category data');
                router.push('/admin/categories');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCategory();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (description) formData.append('description', description);
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (imagePreview && !imagePreview.startsWith('blob:')) {
                formData.append('image', imagePreview);
            }

            await categoriesApi.update(id, formData);
            alert("Category updated successfully!");
            router.push(`/admin/categories`);
        } catch (err) {
            console.error(err);
            alert('Failed to update category or network error.');
        }
    };

    if (loading) {
        return <div className="text-center py-10 animate-pulse text-secondary">Loading editor...</div>;
    }

    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <Link href="/admin/categories" className="text-secondary text-sm flex items-center mb-4 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to Categories
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Edit Category</h1>
                <p className="text-secondary">Modify the details of this product category.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Card noHover padding="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center"><Settings size={20} className="mr-2 text-primary" /> Category Information</h2>
                    <div className="flex flex-col gap-4">
                        <div className="form-group">
                            <label className="form-label">Category Name</label>
                            <input required type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category Image</label>
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
                                <div className="mt-3 h-32 w-48 rounded border border-gray-300 overflow-hidden relative shadow-sm">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-3 mt-2 mb-10">
                    <Link href="/admin/categories" className="btn btn-secondary border-gray-300 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" className="btn btn-primary shadow-md flex items-center">
                        <Save size={18} className="mr-2" /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
