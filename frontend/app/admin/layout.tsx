'use client';
import { AdminSidebar } from '@/components/layout/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout animate-fade-in" suppressHydrationWarning>
            <AdminSidebar />
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
