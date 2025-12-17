
'use client';

import { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, Plus, Send, MoreVertical, Wallet } from 'lucide-react';

export default function DashboardClient({ user, tasks, transactions }: { user: any, tasks: any[], transactions: any[] }) {
    const [balance, setBalance] = useState(parseFloat(user.balance));

    // Calculate stats from transactions
    const totalIncome = transactions
        .filter(t => t.type === 'EARN' || t.type === 'BONUS')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const totalWithdrawn = transactions
        .filter(t => t.type === 'WITHDRAW')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    // Mock chart data based on active balance to look dynamic (since we don't have historical snapshots yet)
    // In a real app, this would come from a tailored API
    const chartData = [10, 25, 40, 30, 55, 45, 70, 60, 85, 90, 75, 100].map(v => v * (balance > 0 ? 1 : 0.1));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[var(--foreground)]">

            {/* LEFT COLUMN (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">

                {/* MONEY INSIGHT SECTION */}
                <div className="card p-8 bg-[var(--secondary)]/10 backdrop-blur-md border border-[var(--border)] rounded-3xl relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h3 className="text-[var(--muted-foreground)] text-sm font-medium mb-1 uppercase tracking-wider">Available Balance</h3>
                            <div className="text-5xl md:text-6xl font-extrabold tracking-tight flex items-baseline gap-2">
                                ${balance.toFixed(2)}
                                <span className="text-sm font-normal text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+0.0% this week</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-ghost text-xs">Weekly</button>
                            <button className="btn btn-sm btn-outline text-xs bg-[var(--background)]">Monthly</button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Total Earned</span>
                            </div>
                            <div className="text-xl font-bold">${totalIncome.toFixed(2)}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Total Withdrawn</span>
                            </div>
                            <div className="text-xl font-bold">${totalWithdrawn.toFixed(2)}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] backdrop-blur-sm hidden md:block">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">Active Tasks</span>
                            </div>
                            <div className="text-xl font-bold">{tasks.length}</div>
                        </div>
                    </div>

                    {/* Dynamic Chart Visual */}
                    <div className="h-40 flex items-end justify-between gap-2 px-2 pb-2">
                        {chartData.map((height, i) => (
                            <div key={i} className="w-full bg-gradient-to-t from-[var(--primary)]/20 to-[var(--primary)]/50 rounded-t-lg hover:from-[var(--primary)]/40 hover:to-[var(--primary)]/70 transition-all duration-300 relative group" style={{ height: `${height}%` }}>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RECENT TRANSACTIONS TABLE */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                            Recent Activity
                        </h3>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--secondary)]/5 rounded-2xl border border-[var(--border)] border-dashed">
                            <TrendingDown className="w-8 h-8 mx-auto text-[var(--muted-foreground)] mb-3 opacity-50" />
                            <p className="text-[var(--muted-foreground)]">No transactions yet. Start earning to see data here!</p>
                        </div>
                    ) : (
                        <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead className="bg-[var(--secondary)]/30 text-xs uppercase text-[var(--muted-foreground)]">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Type</th>
                                        <th className="px-6 py-4 text-left font-semibold">Description</th>
                                        <th className="px-6 py-4 text-left font-semibold hidden sm:table-cell">Date</th>
                                        <th className="px-6 py-4 text-right font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-[var(--secondary)]/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === 'EARN' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        tx.type === 'WITHDRAW' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {tx.description || 'System Transaction'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--muted-foreground)] hidden sm:table-cell">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${tx.type === 'WITHDRAW' ? 'text-red-500' : 'text-green-500'
                                                }`}>
                                                {tx.type === 'WITHDRAW' ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT COLUMN (1/3 width) - MY CARD */}
            <div className="space-y-8">
                {/* Mock Card Visual */}
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[#1c1c1e] text-white rounded-2xl p-6 shadow-2xl overflow-hidden h-56 flex flex-col justify-between transform transition-transform group-hover:scale-[1.01] duration-300">

                        {/* Mesh gradient background for card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                        <div className="flex justify-between items-start z-10">
                            <div className="w-12 h-8 bg-white/20 backdrop-blur-md rounded-md border border-white/10"></div>
                            <span className="text-xs font-mono opacity-80 uppercase tracking-widest">Premium</span>
                        </div>

                        <div className="z-10">
                            <p className="font-mono text-xl tracking-[0.15em] mb-1 shadow-black drop-shadow-md">•••• •••• •••• {user.id ? user.id.slice(0, 4) : '0000'}</p>
                            <p className="text-[10px] opacity-60 font-mono">VIRTUAL CARD</p>
                        </div>

                        <div className="flex justify-between text-xs items-end z-10">
                            <div>
                                <span className="block opacity-60 text-[10px] uppercase mb-0.5">Card Holder</span>
                                <span className="font-bold tracking-wide text-sm">{user.name || 'Earnify User'}</span>
                            </div>
                            <div className="text-right">
                                <CreditCard className="w-8 h-8 opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="btn h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/10 hover:bg-[var(--secondary)]/30 transition-all hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-1">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Deposit</span>
                    </button>
                    <button className="btn h-auto py-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/10 hover:bg-[var(--secondary)]/30 transition-all hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-1">
                            <Send className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">Withdraw</span>
                    </button>
                </div>

                {/* Available Tasks Mini-List */}
                <div className="card p-6 border border-[var(--border)] rounded-3xl bg-[var(--background)]">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[var(--primary)]" />
                        Quick Earn
                    </h4>
                    <div className="space-y-3">
                        {tasks.slice(0, 3).map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--secondary)]/20 transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]">
                                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-xs">
                                    ${task.rewardAmount}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{task.title}</p>
                                    <p className="text-xs text-[var(--muted-foreground)] truncate">{task.type}</p>
                                </div>
                                <button className="btn btn-sm btn-ghost p-1 rounded-full"><ArrowRight className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 btn btn-outline btn-sm rounded-xl">View All Tasks</button>
                </div>
            </div>

        </div>
    );
}

// Helper icon
function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
