
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        if (data.password !== data.confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.name
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Signup failed');
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center p-4 py-12">
            <div className="card w-full max-w-md animate-fade-in">
                <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
                <p className="text-[var(--muted-foreground)] text-center mb-6">Start earning money today</p>

                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-4 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder="John Doe"
                        />
                    </div>
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
                            minLength={6}
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary mt-4 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-[var(--muted-foreground)]">
                    Already have an account? <Link href="/login" className="text-[var(--primary)] hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
