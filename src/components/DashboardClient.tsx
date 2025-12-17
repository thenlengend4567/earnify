'use client';

import { useState } from 'react';
import { Wallet, Settings, MoreVertical, LayoutDashboard, ArrowUpRight, TrendingUp, AlertCircle, Plus, Send } from 'lucide-react';

export default function DashboardClient({ user, tasks, transactions }: { user: any, tasks: any[], transactions: any[] }) {
    const balance = parseFloat(user.balance || '0');

    // Calculate real stats
    const totalIncome = transactions
        .filter(t => t.type === 'EARN' || t.type === 'BONUS')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const totalWithdrawn = transactions
        .filter(t => t.type === 'WITHDRAW')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    // Helper for currency formatting
    const currency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-zinc-100 font-sans">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-zinc-400 text-sm">Welcome back, {user.name || 'Earner'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Funds
                    </button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Total Balance</p>
                            <h2 className="text-3xl font-bold mt-2 text-white">{currency(balance)}</h2>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="text-emerald-400 flex items-center gap-1 font-medium bg-emerald-400/10 px-2 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3" /> 0%
                        </span>
                        <span>vs last month</span>
                    </div>
                </div>

                {/* Income Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-blue-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Total Earned</p>
                            <h2 className="text-3xl font-bold mt-2 text-white">{currency(totalIncome)}</h2>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalIncome > 0 ? '100%' : '0%'}` }}></div>
                    </div>
                </div>

                {/* Pending Tasks Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-purple-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Available Tasks</p>
                            <h2 className="text-3xl font-bold mt-2 text-white">{tasks.length}</h2>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs text-zinc-400">Complete tasks to earn more.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Chart / Activity Area (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Overview Chart Placeholder */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-zinc-200">Financial Overview</h3>
                            <select className="bg-black border border-zinc-700 text-zinc-400 text-xs rounded-lg px-2 py-1 outline-none focus:border-emerald-500">
                                <option>This Month</option>
                            </select>
                        </div>

                        {/* Empty State Chart Visual */}
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl bg-black/20">
                            <div className="p-4 bg-zinc-800/50 rounded-full mb-3">
                                <AlertCircle className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 font-medium">No financial data yet</p>
                            <p className="text-zinc-600 text-xs mt-1">Start earning to see your trends here.</p>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-zinc-200">Recent Transactions</h3>
                        {transactions.length === 0 ? (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 flex flex-col items-center justify-center min-h-[200px]">
                                <TrendingUp className="w-10 h-10 mb-4 opacity-20" />
                                <p>No transactions found.</p>
                                <p className="text-xs opacity-60 mt-1">Your recent earnings will appear here.</p>
                            </div>
                        ) : (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-zinc-950/50 text-zinc-400 uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-4">Type</th>
                                                <th className="px-6 py-4">Description</th>
                                                <th className="px-6 py-4 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {transactions.map((t) => (
                                                <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${t.type === 'EARN' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            {t.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-zinc-300">{t.description || 'Transaction'}</td>
                                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'EARN' ? 'text-emerald-400' : 'text-red-400'
                                                        }`}>
                                                        {t.type === 'EARN' ? '+' : '-'}{currency(parseFloat(t.amount))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Extra Widgets (Right 1 col) */}
                <div className="space-y-6">
                    {/* Spending Donut Placeholder */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="font-semibold text-zinc-200 mb-6">Spending Breakdown</h3>
                        {/* Empty Donut Visual */}
                        <div className="relative w-48 h-48 mx-auto mb-6">
                            <div className="w-full h-full rounded-full border-8 border-zinc-800 opacity-50 border-t-zinc-700 animate-spin-slow" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-zinc-500">$0.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-xs text-zinc-500 px-4">
                            Your spending habits will be visualized here once you start using your funds.
                        </div>
                    </div>

                    {/* Quick Task List */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-zinc-200">Recommended Tasks</h3>
                            <button className="text-xs text-emerald-500 hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {tasks.slice(0, 3).map(task => (
                                <div key={task.id} className="p-3 bg-black/20 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer border border-zinc-800 hover:border-emerald-500/50 group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-emerald-400 transition-colors">{task.title}</span>
                                        <span className="text-emerald-500 font-bold text-xs">{currency(task.rewardAmount)}</span>
                                    </div>
                                    <div className="text-xs text-zinc-500 truncate">{task.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
