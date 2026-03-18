'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function AdminLoginPage() {
    const router = useRouter();
    const { setAuth } = useAppStore();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authApi.login({ email: formData.email, password: formData.password });

            // Enforce Admin strictness
            if (data.role !== 'ADMIN') {
                setError('Access Denied: You do not have administrator privileges.');
                setLoading(false);
                return;
            }

            // Set mock cookies for middleware
            document.cookie = `token=${data.access_token}; path=/`;
            document.cookie = `role=ADMIN; path=/`;

            setAuth(data.access_token, 'ADMIN');
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
            <Card className="w-full max-w-sm" style={{ borderTop: '4px solid var(--primary-color)' }}>
                <div className="text-center mb-6">
                    <ShieldCheck size={40} className="mx-auto text-primary mb-2" />
                    <h1 className="text-2xl font-bold">Admin Secured Access</h1>
                    <p className="text-sm text-secondary">Authorized personnel only</p>
                </div>

                {error && <div className="mb-4 text-sm font-semibold text-center" style={{ color: 'var(--error-color)', backgroundColor: '#FEE2E2', padding: '0.75rem', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Administrator Email" 
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="admin@safoyanaprint.com" 
                        className="mb-4"
                    />

                    <Input 
                        label="Master Password" 
                        required 
                        type="password" 
                        value={formData.password} 
                        onChange={e => setFormData({ ...formData, password: e.target.value })} 
                        placeholder="••••••••" 
                        className="mb-6"
                    />

                    <Button type="submit" isLoading={loading} className="w-full text-lg mb-2" style={{ padding: '0.75rem' }}>
                        Secure Login
                    </Button>
                </form>
            </Card>
        </div>
    );
}
