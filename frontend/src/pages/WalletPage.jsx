// src/pages/WalletPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function WalletPage() {
    const { user } = useAuth();
    
    const [balance, setBalance] = useState(0);
    const [lockedBalance, setLockedBalance] = useState(0);
    const [incomingEscrow, setIncomingEscrow] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [topUpAmount, setTopUpAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);

    const fetchWalletData = async () => {
        try {
            const [balRes, transRes] = await Promise.all([
                api.get('/wallet'),
                api.get('/wallet/transactions')
            ]);
            setBalance(Number(balRes.data.data.balance));
            setLockedBalance(Number(balRes.data.data.locked_balance));
            setIncomingEscrow(Number(balRes.data.data.incoming_escrow || 0));
            setTransactions(transRes.data.data || []);
        } catch (err) {
            console.error("Failed to load wallet data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleTopUp = async (e) => {
        e.preventDefault();
        const amount = parseFloat(topUpAmount);
        if (!amount || amount <= 0) return;

        setIsDepositing(true);
        try {
            await api.post('/wallet/deposit', { amount });
            setTopUpAmount('');
            await fetchWalletData(); // Refresh UI
            alert('Top up successful!');
        } catch (err) {
            alert(err.response?.data?.message || 'Top up failed');
        } finally {
            setIsDepositing(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Secure Wallet...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col gap-8 transition-colors duration-300 w-full">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My TrustRoute Wallet</h1>

            {/* Balances Section - Dynamically sizes based on role */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'shopkeeper' ? 'lg:grid-cols-3' : ''} gap-6`}>
                
                {/* 1. Available Balance (Everyone) */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Available Balance</p>
                        <h2 className="text-5xl font-extrabold">${balance.toFixed(2)}</h2>
                    </div>
                    <p className="text-sm opacity-90 mt-6">Ready to spend or withdraw.</p>
                </div>

                {/* 2. Customer's Locked Escrow */}
                <div className="p-8 rounded-3xl bg-slate-800 dark:bg-[#0d1326] border border-slate-700 dark:border-white/10 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-60 mb-1 text-amber-400">My Locked Escrow</p>
                        <h2 className="text-4xl font-extrabold">${lockedBalance.toFixed(2)}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-6 leading-relaxed">
                        Your funds safely held for active orders. Will be refunded automatically via 2PC if an order fails.
                    </p>
                </div>

                {/* 3. Shopkeeper's Incoming Escrow */}
                {user?.role === 'shopkeeper' && (
                    <div className="p-8 rounded-3xl bg-emerald-900/40 dark:bg-emerald-950/20 border border-emerald-700/50 dark:border-emerald-500/20 text-white shadow-lg flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1 text-emerald-400">Incoming Escrow</p>
                            <h2 className="text-4xl font-extrabold text-emerald-400">${incomingEscrow.toFixed(2)}</h2>
                        </div>
                        <p className="text-xs text-emerald-200/70 mt-6 leading-relaxed">
                            Funds locked by buyers for your active orders. Will be released to your available balance upon delivery.
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Top Up Form */}
                <div className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Top Up Balance</h3>
                    <form onSubmit={handleTopUp} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Amount ($)</label>
                            <input 
                                type="number" 
                                min="1" 
                                step="0.01" 
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070b1c] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isDepositing}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition"
                        >
                            {isDepositing ? 'Processing...' : 'Deposit via KPay/Bank'}
                        </button>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Transaction Ledger</h3>
                    
                    {transactions.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No transactions found.</p>
                    ) : (
                        <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar space-y-3">
                            {transactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50 dark:bg-white/5 transition hover:bg-slate-100 dark:hover:bg-white/10">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                                            {tx.type} 
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ml-2 ${
                                                tx.status === 'completed' ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{tx.description || 'System transaction'}</p>
                                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{new Date(tx.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className={`text-lg font-extrabold ${['deposit', 'refund'].includes(tx.type) ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {['deposit', 'refund'].includes(tx.type) ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}