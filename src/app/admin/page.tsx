
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users, DollarSign, ListChecks, XCircle, CheckCircle } from 'lucide-react';

export default function AdminPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch('/api/admin/stats');
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleWithdrawal(id: string, status: string) {
        setProcessing(id);
        try {
            await fetch('/api/admin/withdrawals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            await fetchData();
        } catch (e) {
            alert('Action failed');
        } finally {
            setProcessing(null);
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-8">Access Denied</div>;

    return (
        <div className="container py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Users" value={data.stats.users} icon={<Users className="text-blue-500" />} />
                <StatsCard title="Active Tasks" value={data.stats.tasks} icon={<ListChecks className="text-purple-500" />} />
                <StatsCard title="Total Payouts" value={`$${data.stats.payouts}`} icon={<DollarSign className="text-green-500" />} />
                <StatsCard title="Pending Payouts" value={data.stats.pendingCount} icon={<Loader2 className="text-orange-500" />} />
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-6">Pending Withdrawal Requests</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="p-4">User</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.withdrawals.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-[var(--muted-foreground)]">No pending requests</td></tr>
                            ) : (
                                data.withdrawals.map((w: any) => (
                                    <tr key={w.id} className="border-b border-[var(--border)] hover:bg-[var(--secondary)]/50">
                                        <td className="p-4">
                                            <div className="font-medium">{w.user.name}</div>
                                            <div className="text-xs text-[var(--muted-foreground)]">{w.user.email}</div>
                                        </td>
                                        <td className="p-4 font-bold text-green-500">${parseFloat(w.amount).toFixed(2)}</td>
                                        <td className="p-4">{w.method}</td>
                                        <td className="p-4 text-sm text-[var(--muted-foreground)]">{new Date(w.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleWithdrawal(w.id, 'APPROVED')}
                                                disabled={!!processing}
                                                className="btn bg-green-500/10 text-green-500 hover:bg-green-500/20 px-3 py-1 text-sm h-8"
                                                title="Approve"
                                            >
                                                {processing === w.id ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleWithdrawal(w.id, 'REJECTED')}
                                                disabled={!!processing}
                                                className="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1 text-sm h-8"
                                                title="Reject"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="card flex items-center gap-4">
            <div className="p-3 bg-[var(--background)] rounded-full border border-[var(--border)]">
                {icon}
            </div>
            <div>
                <p className="text-sm text-[var(--muted-foreground)] uppercase font-medium">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}
