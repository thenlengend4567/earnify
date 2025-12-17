
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Login failed');
            }

            router.push('/dashboard');
            router.refresh(); // Refresh to update Navbar state
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="card w-full max-w-md animate-fade-in">
                <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back</h1>
                <p className="text-[var(--muted-foreground)] text-center mb-6">Log in to continue earning</p>

                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-4 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary mt-4 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log In'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-[var(--secondary)] text-[var(--muted-foreground)]">Or continue with</span></div>
                </div>

                <button type="button" className="w-full btn btn-outline flex items-center justify-center gap-2 mb-6" onClick={() => alert('Google Login is simulated for this demo.')}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                </button>

                <p className="text-center mt-6 text-sm text-[var(--muted-foreground)]">
                    Don't have an account? <Link href="/signup" className="text-[var(--primary)] hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
