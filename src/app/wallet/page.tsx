
'use client';

import { useEffect, useState } from 'react';
import { Loader2, DollarSign, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Transaction {
    id: string;
    amount: string;
    type: string;
    status: string;
    description: string;
    createdAt: string;
}

export default function WalletPage() {
    const [balance, setBalance] = useState<string>('0');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [meRes, txRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/transactions')
            ]);
            const me = await meRes.json();
            const tx = await txRes.json();
            if (me.user) setBalance(me.user.balance);
            if (tx.transactions) setTransactions(tx.transactions);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleWithdraw(e: React.FormEvent) {
        e.preventDefault();
        setWithdrawing(true);
        setMessage(null);

        try {
            const res = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, method })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setMessage({ type: 'success', text: 'Withdrawal requested successfully!' });
            setAmount('');
            setMethod('');
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setWithdrawing(false);
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Balance Card & Withdraw Form */}
                <div className="space-y-6">
                    <div className="card bg-gradient-to-br from-[var(--secondary)] to-[var(--background)] border-[var(--primary)]/20">
                        <h2 className="text-[var(--muted-foreground)] text-sm font-medium uppercase tracking-wider">Available Balance</h2>
                        <div className="text-5xl font-bold mt-2 flex items-center gap-2">
                            <DollarSign className="w-10 h-10 text-[var(--primary)]" />
                            {parseFloat(balance).toFixed(2)}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-bold mb-4">Request Withdrawal</h3>
                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {message.text}
                            </div>
                        )}
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full p-2 rounded bg-[var(--background)] border border-[var(--border)] focus:ring-[var(--ring)] focus:outline-none focus:ring-1"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Method</label>
                                <select
                                    value={method}
                                    onChange={e => setMethod(e.target.value)}
                                    className="w-full p-2 rounded bg-[var(--background)] border border-[var(--border)] focus:ring-[var(--ring)] focus:outline-none focus:ring-1"
                                    required
                                >
                                    <option value="">Select Method</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Crypto (BTC)">Crypto (BTC)</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={withdrawing}
                                className="w-full btn btn-primary disabled:opacity-50"
                            >
                                {withdrawing ? <Loader2 className="animate-spin w-5 h-5" /> : 'Request Payout'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-6">
                        <History className="text-[var(--primary)]" />
                        <h3 className="text-xl font-bold">Transaction History</h3>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {transactions.length === 0 ? (
                            <p className="text-[var(--muted-foreground)] text-center py-8">No transactions yet.</p>
                        ) : (
                            transactions.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${tx.type === 'EARN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {tx.type === 'EARN' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{tx.description || tx.type}</p>
                                            <p className="text-xs text-[var(--muted-foreground)]">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.type === 'EARN' ? 'text-green-500' : ''}`}>
                                        {tx.type === 'EARN' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
