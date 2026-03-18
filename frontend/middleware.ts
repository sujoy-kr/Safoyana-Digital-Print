import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Basic Auth Checks (Cookie / Token check)
    // Since we are using Zustand (localStorage), the server won't easily see it unless we sync to cookies.
    // For this architecture without a true session cookie setup, we will do a basic check here, 
    // but rely heavily on client-side wrapping for the Role. 
    // Next.js middleware works best with proper NextAuth/Cookies.

    // Here we assume standard JWT is stored in a cookie `token` and `role`
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;

    // 1. Protect Admin Routes
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
        if (!token || role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/admin-login', request.url));
        }
    }

    // 2. Protect Secured User Routes
    if (pathname.startsWith('/profile') || pathname.startsWith('/cart')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. Prevent logged-in Admins from accessing user login
    if (pathname === '/admin-login' && role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/profile/:path*',
        '/cart/:path*',
        '/admin-login'
    ],
};
