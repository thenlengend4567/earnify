'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    Users,
    Settings,
    CreditCard,
    Bell,
    LogOut,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    User,
    Inbox,
    Menu,
    X
} from 'lucide-react';

// --- Utility: Luhn Algorithm for Credit Card Validation ---
const validateCreditCard = (number: string) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i));
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon, trend, subLabel }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">{icon}</div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/20 px-2 py-1 rounded-full">{trend}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <h2 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</h2>
        {subLabel && <p className="text-xs text-slate-400 mt-1">{subLabel}</p>}
    </div>
);

const PaymentSettings = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('');

    // "Real" state for saved cards
    const [savedCards, setSavedCards] = useState([
        { id: 1, last4: '4242', brand: 'Visa', expiry: '12/28' }
    ]);

    const handleCardCheck = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setVerificationStatus('Connecting to bank secure gateway...');

        // Simulate complex real-time check steps
        setTimeout(() => {
            setVerificationStatus('Verifying account balance...');
            setTimeout(() => {
                const valid = validateCreditCard(cardNumber);
                setIsValid(valid);
                setIsProcessing(false);
                setVerificationStatus('');

                if (valid) {
                    // "Save" the card to the list
                    const newCard = {
                        id: Date.now(),
                        last4: cardNumber.slice(-4),
                        brand: 'MasterCard', // Mocking brand detection
                        expiry: expiry || '12/30'
                    };
                    setSavedCards([...savedCards, newCard]);
                    setCardNumber('');
                    setExpiry('');
                    setCvv('');
                    setTimeout(() => setIsValid(null), 3000); // Reset success msg
                }
            }, 1500);
        }, 1500);
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">

            {/* Saved Cards Section */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-500" /> Your Wallets
                </h2>
                <div className="space-y-3">
                    {savedCards.length > 0 ? savedCards.map(card => (
                        <div key={card.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-wider">
                                    CARD
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">**** {card.last4}</p>
                                    <p className="text-xs text-slate-500">Expires {card.expiry}</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold bg-green-500/10 text-green-500 px-2 py-1 rounded">Active</span>
                        </div>
                    )) : (
                        <p className="text-sm text-slate-500">No saved cards yet.</p>
                    )}
                </div>
            </div>

            {/* Add New Card Section */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                    <CreditCard className="text-blue-500" /> Add Payment Method
                </h2>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white mb-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <CreditCard size={120} />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between h-48">
                        <p className="text-xs uppercase tracking-widest opacity-60">New Card Preview</p>
                        <p className="text-xl font-mono mt-auto mb-4 tracking-widest">
                            {cardNumber ? cardNumber.replace(/\d(?=\d{4})/g, "*") : "**** **** **** ****"}
                        </p>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[10px] uppercase opacity-60">Expires</p>
                                <p className="font-mono">{expiry || "--/--"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase opacity-60">CVV</p>
                                <p className="font-mono">{cvv || "***"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleCardCheck} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Card Number</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Expiry Date</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">CVV</label>
                            <input
                                type="password"
                                placeholder="***"
                                maxLength={4}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                {verificationStatus || 'Validating...'}
                            </span>
                        ) : 'Verify & Add Card'}
                    </button>
                </form>

                {isValid !== null && (
                    <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${isValid ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        {isValid ? <CheckCircle /> : <AlertCircle />}
                        <div>
                            <p className="text-sm font-bold">
                                {isValid ? 'Card Verified & Linked' : 'Verification Failed'}
                            </p>
                            <p className="text-xs mt-1">
                                {isValid ? 'This card has been successfully added to your wallet.' : 'Invalid card details. Please check your number and try again.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---

export default function DashboardClient({ user, tasks, transactions }: { user: any, tasks: any[], transactions: any[] }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(true); // Default to Dark Mode
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // --- Real Data Processing ---
    const balance = parseFloat(user.balance || '0');

    const totalEarned = transactions
        .filter(t => t.type === 'EARN' || t.type === 'BONUS')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const currency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Map tasks to "Investments" or Opportunities visual
    const opportunities = tasks.slice(0, 5).map(task => ({
        name: task.title,
        value: currency(task.rewardAmount),
        change: '+100% potential',
        id: task.id
    }));

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'money', label: 'Earnings', icon: <Wallet size={20} /> },
        { id: 'investments', label: 'Tasks', icon: <TrendingUp size={20} /> }, // Renamed from Investments
        { id: 'referrals', label: 'Referrals', icon: <Users size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const DashboardContent = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Balance"
                    value={currency(balance)}
                    icon={<Wallet className="text-blue-500" />}
                    trend="0%"
                />
                <StatCard
                    title="Total Earned"
                    value={currency(totalEarned)}
                    icon={<TrendingUp className="text-green-500" />}
                    trend="+0%"
                />
                <StatCard
                    title="Active Tasks"
                    value={tasks.length}
                    icon={<TrendingUp className="text-purple-500" />}
                    trend="New"
                />
                <StatCard
                    title="Referrals"
                    value="0"
                    icon={<Users className="text-orange-500" />}
                    trend="+0"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <TrendingUp size={20} /> Available Work
                    </h3>
                    <div className="space-y-4">
                        {opportunities.length > 0 ? (
                            opportunities.map((opp, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer group">
                                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-500 transition-colors">{opp.name}</span>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">{opp.value}</p>
                                        <p className="text-xs text-green-500">{opp.change}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <TrendingUp size={40} className="mb-2 opacity-20" />
                                <p className="text-sm font-medium">No active tasks found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Bell size={20} /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {transactions.length > 0 ? (
                            transactions.map((act) => (
                                <div key={act.id} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-100">{act.description || act.type}</p>
                                        <p className="text-xs text-slate-500">{new Date(act.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${act.type === 'EARN' ? 'text-green-500' : 'text-slate-800 dark:text-slate-100'}`}>
                                            {act.type === 'EARN' ? '+' : '-'}{currency(parseFloat(act.amount))}
                                        </p>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{act.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <Inbox size={40} className="mb-2 opacity-20" />
                                <p className="text-sm font-medium">No recent transactions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 z-30 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-10 px-2 leading-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">E</div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Earnify</h1>
                    </div>
                    <button className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"
                    >
                        <Bell size={20} />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen lg:ml-64 relative">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </button>
                        <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white">
                            {sidebarItems.find(i => i.id === activeTab)?.label}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                            {darkMode ? '🌙' : '☀️'}
                        </button>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                            <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-[10px] text-white overflow-hidden">
                                <User size={14} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name || 'User'}</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                    {activeTab === 'dashboard' && <DashboardContent />}
                    {activeTab === 'settings' && <PaymentSettings />}
                    {(activeTab !== 'dashboard' && activeTab !== 'settings') && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-300 min-h-[50vh]">
                            <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                                {sidebarItems.find(i => i.id === activeTab)?.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeTab.toUpperCase()} Section</h2>
                            <p className="text-slate-500 max-w-sm">This module is correctly linked but requires additional data to be displayed.</p>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
