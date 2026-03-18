'use client';
import { useAppStore } from '@/store/useAppStore';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
    const { token } = useAppStore();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Note: The NestJS prototype doesn't have a GET /users endpoint yet.
        // For now, we mock some users to demonstrate the UI layout.
        setTimeout(() => {
            setUsers([
                { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', joined: '2024-05-12' },
                { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'USER', joined: '2024-05-15' },
                { id: '3', name: 'Admin Master', email: 'admin@safoyanaprint.com', role: 'ADMIN', joined: '2024-01-01' }
            ]);
            setLoading(false);
        }, 1000);
    }, [token]);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Customer Directory</h1>
                    <p className="text-secondary">View and manage all registered users on your platform.</p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="form-input pl-10 mb-0"
                        style={{ width: '250px' }}
                    />
                    <Search size={18} className="absolute text-secondary" style={{ top: '10px', left: '12px' }} />
                </div>
            </div>

            <Table 
                columns={['ID', 'Name', 'Email Address', 'Role', 'Joined Date', 'Actions']}
                isLoading={loading}
                isEmpty={users.length === 0}
                emptyMessage="No users found."
            >
                {users.map(u => (
                            <tr key={u.id}>
                                <td className="font-semibold text-secondary">#{u.id}</td>
                                <td className="font-bold flex items-center gap-2">
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                        {u.name.charAt(0)}
                                    </div>
                                    {u.name}
                                </td>
                                <td className="text-sm">{u.email}</td>
                                <td>
                                    {u.role === 'ADMIN' ?
                                        <span className="badge badge-admin text-xs">ADMIN</span> :
                                        <span className="badge badge-user text-xs">USER</span>
                                    }
                                </td>
                                <td className="text-sm text-secondary">{new Date(u.joined).toLocaleDateString()}</td>
                                <td className="text-right">
                                    <Button variant="secondary" className="text-xs ml-auto" style={{ padding: '0.25rem 0.75rem' }}>View History</Button>
                                </td>
                            </tr>
                        ))}
            </Table>
        </div>
    );
}
