
'use client';

import { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, Plus, Send, MoreVertical, Wallet } from 'lucide-react';

export default function DashboardClient({ user, tasks }: { user: any, tasks: any[] }) {
    const [balance, setBalance] = useState(parseFloat(user.balance));

    // Placeholder data for chart bars (random heights)
    const chartData = [40, 60, 45, 80, 55, 70, 40, 50, 65, 85, 90, 60];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">

                {/* MONEY INSIGHT SECTION */}
                <div className="card p-8 bg-[var(--secondary)]/20 border border-[var(--border)] rounded-3xl relative overflow-hidden">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Total Earning</h3>
                            <div className="text-5xl font-bold tracking-tight">${balance.toFixed(2)}</div>
                            <p className="text-sm text-[var(--muted-foreground)] mt-4 max-w-md">
                                Your finances are stable and well-managed. Your income covers regular expenses and savings.
                            </p>
                        </div>
                        <select className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-1 text-sm outline-none">
                            <option>Last 30 Days</option>
                            <option>This Week</option>
                        </select>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-[var(--muted-foreground)]">Total Income</span>
                                <span className="text-xs text-green-500 ml-auto">+23%</span>
                            </div>
                            <div className="text-xl font-bold">$16,080.00</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-[var(--muted-foreground)]">Total Expenses</span>
                                <span className="text-xs text-green-500 ml-auto">+17%</span>
                            </div>
                            <div className="text-xl font-bold">$8,040.00</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs text-[var(--muted-foreground)]">Total Save</span>
                                <span className="text-xs text-green-500 ml-auto">+14%</span>
                            </div>
                            <div className="text-xl font-bold">$2,680.00</div>
                        </div>
                    </div>

                    {/* Chart Visual (CSS Bars) */}
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {chartData.map((height, i) => (
                            <div key={i} className="w-full bg-[var(--primary)]/20 rounded-t-lg hover:bg-[var(--primary)]/40 transition-colors relative group" style={{ height: `${height}%` }}>
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${height * 10}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-[var(--muted-foreground)]">
                        <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                    </div>
                </div>

                {/* RECENT TRANSACTIONS TABLE */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Transaction</h3>
                        <button className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]">View All</button>
                    </div>
                    <div className="bg-[var(--secondary)]/10 rounded-2xl border border-[var(--border)] overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[var(--secondary)]/30 text-xs uppercase text-[var(--muted-foreground)]">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium">Description</th>
                                    <th className="px-6 py-4 text-left font-medium">Category</th>
                                    <th className="px-6 py-4 text-left font-medium">Date</th>
                                    <th className="px-6 py-4 text-right font-medium">Amount</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {[1, 2, 3].map((item) => (
                                    <tr key={item} className="hover:bg-[var(--secondary)]/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--border)]">
                                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Completed Task #{item}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">Ad Revenue</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">Income</td>
                                        <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">Nov {14 - item}, 2023</td>
                                        <td className="px-6 py-4 text-right font-medium text-green-500">+$10.00</td>
                                        <td className="px-6 py-4 text-right">
                                            <MoreVertical className="w-4 h-4 text-[var(--muted-foreground)] cursor-pointer" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN (1/3 width) - MY CARD */}
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl">My Card</h3>
                    <button className="btn btn-outline text-xs h-8 px-3">+ Add Card</button>
                </div>

                {/* Summary Widget */}
                <div className="space-y-6">
                    <div className="card p-6 border border-[var(--border)] rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-medium flex items-center gap-2"><Wallet className="w-4 h-4" /> Top Summary</h4>
                            <span className="text-xs text-[var(--muted-foreground)] border border-[var(--border)] px-2 py-1 rounded">Dec</span>
                        </div>

                        {/* Donut Chart Simulation */}
                        <div className="flex items-center justify-center py-4 relative">
                            <div className="w-32 h-32 rounded-full border-[12px] border-[var(--secondary)] border-t-[var(--primary)] border-r-[var(--accent)] relative flex items-center justify-center transform rotate-45">
                                <div className="transform -rotate-45 text-center">
                                    <span className="text-xl font-bold block">+33%</span>
                                    <span className="text-[10px] text-[var(--muted-foreground)]">Best of Dec</span>
                                </div>
                            </div>
                            {/* Legend sidebar */}
                            <div className="absolute right-0 top-0 text-xs space-y-3">
                                <div>
                                    <p className="text-[var(--muted-foreground)]">Digital Asset</p>
                                    <p className="font-bold">$16,080.00</p>
                                </div>
                                <div>
                                    <p className="text-[var(--muted-foreground)]">Utilities</p>
                                    <p className="font-bold">$8,040.00</p>
                                </div>
                                <div>
                                    <p className="text-[var(--muted-foreground)]">Other</p>
                                    <p className="font-bold">$2,680.00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Balance / Actions */}
                    <div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-2"><Wallet className="w-4 h-4" /> Balance</p>
                        <h2 className="text-3xl font-bold mb-6">${balance.toFixed(2)}</h2>

                        {/* Mock Card Visual */}
                        <div className="bg-gradient-to-br from-gray-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-6 mb-6 shadow-inner border border-[var(--border)] relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CreditCard className="w-32 h-32" />
                            </div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-10 h-6 bg-yellow-500/80 rounded"></div>
                                <span className="text-xs font-mono opacity-60">Debit</span>
                            </div>
                            <p className="font-mono text-lg tracking-widest mb-4">1109 8976 3521 9861</p>
                            <div className="flex justify-between text-xs opacity-70">
                                <span>Card Holder<br /><span className="font-bold text-sm tracking-normal">{user.name}</span></span>
                                <span className="text-right">Expires<br /><span className="font-bold text-sm tracking-normal">11/24</span></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="btn btn-outline flex items-center justify-center gap-2 rounded-xl py-3 border-[var(--border)] bg-[var(--background)]">
                                <Plus className="w-4 h-4" /> Withdraw
                            </button>
                            <button className="btn btn-outline flex items-center justify-center gap-2 rounded-xl py-3 border-[var(--border)] bg-[var(--background)]">
                                <Send className="w-4 h-4" /> Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
