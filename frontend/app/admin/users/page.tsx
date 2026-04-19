'use client';
import { useAppStore } from '@/store/useAppStore';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
    const { token } = useAppStore();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        usersApi.getAll()
            .then(data => {
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
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
                columns={['ID', 'Name', 'Email Address', 'Role', 'Orders', 'Actions']}
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
                                <td className="text-sm text-secondary">{u._count?.orders ?? 0} order(s)</td>
                                <td className="text-right">
                                    <Button variant="secondary" className="text-xs ml-auto" style={{ padding: '0.25rem 0.75rem' }}>View History</Button>
                                </td>
                            </tr>
                        ))}
            </Table>
        </div>
    );
}
