
import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Paths that require auth
    const protectedPaths = ['/dashboard', '/admin', '/wallet'];

    if (protectedPaths.some((path) => pathname.startsWith(path))) {
        if (!sessionToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const session = await verifySession(sessionToken);

        // Redirect to login if session is invalid
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Role based protection
        if (pathname.startsWith('/admin') && session.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Paths that are for guests only (e.g. login/signup)
    const authPaths = ['/login', '/signup'];
    if (authPaths.some((path) => pathname.startsWith(path))) {
        if (sessionToken) {
            const session = await verifySession(sessionToken);
            if (session) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
