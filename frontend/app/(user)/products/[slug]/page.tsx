'use client';
import { useEffect, useState, use } from 'react';
import { UploadCloud, CheckCircle, Info, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { productsApi } from '@/lib/api/products';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProductConfiguratorPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { addToCart } = useAppStore();

    const [product, setProduct] = useState<any>(null);
    const [selectedConfig, setSelectedConfig] = useState<Record<string, any>>({});
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadUrl, setUploadUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Note: the slug variable here from Next app router actually aligns to the product ID in our schema route
        productsApi.getById(resolvedParams.slug)
            .then(data => {
                if (!data) return;
                setProduct(data);
                setTotalPrice(Number(data.basePrice));

                if (data.attributes && Array.isArray(data.attributes)) {
                    const initialConfig: Record<string, any> = {};
                    data.attributes.forEach((attr: any) => {
                        if (attr.options && attr.options.length > 0) {
                            initialConfig[attr.id] = attr.options[0].value;
                        }
                    });
                    setSelectedConfig(initialConfig);
                }
            })
            .catch(console.error);
    }, [resolvedParams.slug]);

    useEffect(() => {
        if (!product || !product.attributes) return;

        let calcPrice = Number(product.basePrice);

        product.attributes.forEach((attr: any) => {
            const selectedValue = selectedConfig[attr.id];
            if (selectedValue) {
                const matchedOption = attr.options.find((o: any) => o.value === selectedValue);
                if (matchedOption && matchedOption.priceAdded) {
                    calcPrice += Number(matchedOption.priceAdded);
                }
            }
        });

        setTotalPrice(calcPrice * quantity);
    }, [product, selectedConfig, quantity]);

    const handleConfigChange = (attrId: string, value: string) => {
        setSelectedConfig(prev => ({ ...prev, [attrId]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadFile(file);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await apiClient<any>('/upload', {
                method: 'POST',
                body: formData,
                headers: {}, // To prevent default application/json override
            });
            if (res && res.url) {
                setUploadUrl(res.url);
            } else {
                throw new Error('Upload failed or no URL returned');
            }
        } catch (err) {
            console.error(err);
            alert('File upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddToCart = () => {
        if (!uploadUrl) {
            alert("Please upload your print design first!");
            return;
        }

        addToCart({
            productId: product.id,
            name: product.name,
            quantity,
            totalPrice,
            customConfig: {
                ...selectedConfig,
                designFileUrl: uploadUrl
            }
        });

        alert("Added to cart!");
        router.push('/cart');
    };

    if (!product) {
        return <div className="container py-8 text-center animate-pulse">Loading configurator...</div>;
    }

    return (
        <div className="container py-4">
            <div className="text-secondary text-sm mb-4">
                Home / Products / <span className="text-primary font-semibold">{product.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <Card className="mb-4" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
                        <div className="text-center text-secondary">
                            <h2>{product.name} Preview Area</h2>
                            <p className="text-sm mt-2 max-w-xs">Change config options on the right to see updates here.</p>
                        </div>
                    </Card>

                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-secondary mb-4">{product.description || 'Premium quality prints for your business needs.'}</p>

                    <Card className="mb-4" style={{ backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }}>
                        <div className="flex items-start gap-3">
                            <Info className="text-primary mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-primary mb-1">Print Guidelines</h4>
                                <p className="text-secondary text-sm">Please ensure your design file is in CMYK format, has a minimum resolution of 300dpi, and includes a 3mm bleed area on all sides.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="animate-fade-in" style={{ position: 'sticky', top: '100px' }}>

                        {product.attributes?.map((attr: any) => (
                            <div key={attr.id} className="mb-5 pb-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <h3 className="font-bold mb-3">{attr.name}</h3>

                                {attr.type === 'dropdown' ? (
                                    <select
                                        className="form-input"
                                        value={selectedConfig[attr.id] || ''}
                                        onChange={(e) => handleConfigChange(attr.id, e.target.value)}
                                    >
                                        {attr.options.map((opt: any) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label} {opt.priceAdded > 0 ? `(+$${opt.priceAdded})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="options-grid">
                                        {attr.options.map((opt: any) => {
                                            const isSelected = selectedConfig[attr.id] === opt.value;
                                            return (
                                                <div
                                                    key={opt.value}
                                                    className={`option-box ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleConfigChange(attr.id, opt.value)}
                                                >
                                                    {attr.type === 'radio-image' && opt.image && (
                                                        <img src={opt.image} alt={opt.label} />
                                                    )}
                                                    <div className="text-sm mt-1 font-semibold">{opt.label}</div>
                                                    {opt.priceAdded !== 0 && (
                                                        <div className="option-price-label">
                                                            {opt.priceAdded > 0 ? '+' : '-'}${Math.abs(opt.priceAdded)}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="mb-5 pb-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <h3 className="font-bold mb-3">Upload Custom Design</h3>

                            {!uploadUrl ? (
                                <div style={{ border: '2px dashed var(--border-focus)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
                                    <UploadCloud size={32} className="mx-auto text-primary mb-2" />
                                    <p className="text-sm font-semibold mb-2">Drag and drop or click to upload</p>
                                    <p className="text-xs text-secondary mb-3">Supported formats: PDF, AI, PSD, JPEG, PNG (Max 50MB)</p>
                                    <input type="file" onChange={handleFileUpload} className="hidden" id="fileUpload" accept=".pdf,.png,.jpg,.jpeg,.ai,.psd" />
                                    <label htmlFor="fileUpload" className="btn btn-secondary cursor-pointer">
                                        {isUploading ? 'Uploading...' : 'Select File'}
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3" style={{ border: '1px solid var(--success-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#ECFDF5' }}>
                                    <CheckCircle className="text-success-color" size={24} />
                                    <div>
                                        <h4 className="font-bold text-success-color text-sm">File Uploaded Successfully</h4>
                                        <p className="text-xs text-success-color opacity-80">{uploadFile?.name}</p>
                                    </div>
                                    <button className="btn ml-auto text-xs" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setUploadUrl('')}>Replace</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <h3 className="font-bold mb-2">Quantity</h3>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-input"
                                    style={{ width: '100px' }}
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                />
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-secondary mb-1">Total Price (incl. VAT)</div>
                                <div className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</div>
                            </div>
                        </div>

                        <Button className="w-full text-lg animate-fade-in" style={{ padding: '1rem' }} onClick={handleAddToCart}>
                            <ShoppingBag className="mr-2" size={20} /> Add to Cart
                        </Button>

                    </Card>
                </div>

            </div>
        </div>
    );
}
