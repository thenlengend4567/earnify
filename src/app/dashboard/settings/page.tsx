
'use client';

import { useState } from 'react';
import { Loader2, Save, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    }

    return (
        <div className="container py-8 animate-fade-in max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Profile Section */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                        <User className="text-[var(--primary)]" />
                        <h2 className="text-xl font-semibold">Profile Information</h2>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Display Name</label>
                            <input type="text" defaultValue="John Doe" className="w-full p-2 rounded bg-[var(--background)] border border-[var(--border)] focus:ring-[var(--ring)] focus:outline-none focus:ring-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <input type="email" defaultValue="user@example.com" disabled className="w-full p-2 rounded bg-[var(--background)] border border-[var(--border)] opacity-50 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                        <Bell className="text-[var(--accent)]" />
                        <h2 className="text-xl font-semibold">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]" />
                            <span>Email me about new tasks</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]" />
                            <span>Email me when payment is sent</span>
                        </label>
                    </div>
                </div>

                {/* Security */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                        <Shield className="text-red-500" />
                        <h2 className="text-xl font-semibold">Security</h2>
                    </div>
                    <button type="button" className="btn btn-outline w-full justify-between">
                        <span>Change Password</span>
                        <span className="text-xs text-[var(--muted-foreground)]">Last changed 3 months ago</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={loading} className="btn btn-primary px-8">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </button>
                    {success && <span className="text-green-500 text-sm font-medium animate-fade-in">Settings saved successfully!</span>}
                </div>
            </form>
        </div>
    );
}
