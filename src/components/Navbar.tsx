'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface NavbarProps {
    user?: { email: string; role: string } | null;
}

export function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    if (isAuthPage) return null;

    return (
        <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur sticky top-0 z-50">
            <div className="container h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tight text-[var(--primary)]">
                    Earnify
                </Link>

                {loading ? (
                    <Loader2 className="animate-spin text-[var(--muted-foreground)]" />
                ) : (
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm font-medium hover:text-[var(--primary)] ${pathname === '/dashboard' ? 'text-[var(--primary)]' : ''}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/settings"
                                    className={`text-sm font-medium hover:text-[var(--primary)] ${pathname === '/dashboard/settings' ? 'text-[var(--primary)]' : ''}`}
                                >
                                    Settings
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className={`text-sm font-medium hover:text-[var(--primary)] ${pathname === '/admin' ? 'text-[var(--primary)]' : ''}`}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="w-px h-6 bg-[var(--border)] mx-2" />
                                <button
                                    onClick={async () => {
                                        await fetch('/api/auth/logout', { method: 'POST' });
                                        window.location.href = '/login';
                                    }}
                                    className="text-sm font-medium hover:text-red-400"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium hover:text-[var(--primary)]">
                                    Log In
                                </Link>
                                <Link href="/signup" className="btn btn-primary text-sm py-2 px-4">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
