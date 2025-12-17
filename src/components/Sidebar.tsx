
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, User, LogOut, Settings, CreditCard, BarChart3, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Wallet, label: 'Wallet', href: '/wallet' },
        { icon: BarChart3, label: 'Activity', href: '/dashboard/activity' }, // Placeholder
        { icon: CreditCard, label: 'My Cards', href: '/dashboard/cards' },   // Placeholder
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push({ icon: User, label: 'Admin Panel', href: '/admin' });
    }

    return (
        <>
            {/* Mobile Trigger */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--secondary)] rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[var(--background)] border-r border-[var(--border)]
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col
      `}>
                {/* Logo */}
                <div className="p-6 border-b border-[var(--border)]">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                        Earnify.
                    </h1>
                </div>

                {/* User Profile Mini */}
                <div className="p-4 mx-4 mt-6 mb-4 bg-[var(--secondary)]/50 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium">{user?.name || 'User'}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">Free Plan</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                        : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-[var(--border)]">
                    <Link href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
