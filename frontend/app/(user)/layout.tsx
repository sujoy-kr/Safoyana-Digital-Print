import { UserNavbar } from '@/components/layout/user/UserNavbar';
import { Footer } from '@/components/layout/user/Footer';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <UserNavbar />
            <main className="main-content animate-fade-in" style={{ flexGrow: 1 }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
