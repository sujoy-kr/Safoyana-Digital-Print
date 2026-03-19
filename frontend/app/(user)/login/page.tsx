'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAppStore();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = isRegister
                ? await authApi.register({ email: formData.email, name: formData.name, password: formData.password })
                : await authApi.login({ email: formData.email, password: formData.password });

            if (data && data.access_token) {
                document.cookie = `token=${data.access_token}; path=/`;
                document.cookie = `role=${data.role}; path=/`;

                setAuth(data.access_token, data.role);
                router.push('/');
            } else {
                setError('Authentication failed - missing token in response');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto flex justify-center items-center py-6" style={{ minHeight: 'calc(100vh - 300px)' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="text-2xl font-bold mb-4 text-center">
                    {isRegister ? 'Create an Account' : 'Welcome Back'}
                </h1>

                {error && <div className="mb-4 text-sm font-semibold" style={{ color: 'var(--error-color)', backgroundColor: '#FEE2E2', padding: '0.75rem', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {isRegister && (
                        <Input
                            label="Full Name"
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="mb-0"
                        />
                    )}

                    <Input
                        label="Email Address"
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="mb-0"
                    />

                    <Input
                        label="Password"
                        required
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="mb-4"
                    />

                    <Button type="submit" isLoading={loading} className="w-full text-lg mb-4" style={{ padding: '0.75rem' }}>
                        {isRegister ? 'Register' : 'Sign In'}
                    </Button>
                </form>

                <div className="text-center text-sm text-secondary pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {isRegister ? 'Log in' : 'Sign up'}
                    </button>
                </div>
            </Card>
        </div>
    );
}
