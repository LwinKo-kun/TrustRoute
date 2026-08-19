import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const [topUpReference, setTopUpReference] = useState('');
    const [topUpScreenshot, setTopUpScreenshot] = useState(null);
    const [isDepositing, setIsDepositing] = useState(false);

    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawAccount, setWithdrawAccount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const fetchWalletData = async () => {
        try {
            const [balRes, transRes] = await Promise.all([
                api.get('/wallet'),
                api.get('/wallet/transactions')
            ]);
            setBalance(Number(balRes.data?.data?.balance || 0));
            setLockedBalance(Number(balRes.data?.data?.locked_balance || 0));
            setIncomingEscrow(Number(balRes.data?.data?.incoming_escrow || 0));
            
            const txData = transRes.data?.data || transRes.data || [];
            setTransactions(txData);
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
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('reference_note', topUpReference || 'KPay / Bank Transfer');
            if (topUpScreenshot) {
                formData.append('screenshot', topUpScreenshot);
            }

            // Note: Ensure your axios api instance handles multipart/form-data headers automatically or via interceptor
            await api.post('/wallet/deposit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTopUpAmount('');
            setTopUpReference('');
            setTopUpScreenshot(null);
            await fetchWalletData(); 
            alert('Deposit request and payment proof submitted! Waiting for admin verification.');
        } catch (err) {
            alert(err.response?.data?.message || 'Top up request failed');
        } finally {
            setIsDepositing(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);
        if (!amount || amount <= 0) return;
        if (amount > balance) {
            alert('Withdrawal amount exceeds available balance.');
            return;
        }

        setIsWithdrawing(true);
        try {
            await api.post('/wallet/withdraw', { 
                amount, 
                account_details: withdrawAccount 
            });
            setWithdrawAmount('');
            setWithdrawAccount('');
            await fetchWalletData();
            alert('Withdrawal request submitted! Waiting for admin approval.');
        } catch (err) {
            alert(err.response?.data?.message || 'Withdrawal request failed');
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Secure Wallet...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col gap-8 transition-colors duration-300 w-full">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My TrustRoute Wallet</h1>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'shopkeeper' ? 'lg:grid-cols-3' : ''} gap-6`}>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Available Balance</p>
                        <h2 className="text-5xl font-extrabold">${balance.toFixed(2)}</h2>
                    </div>
                    <p className="text-sm opacity-90 mt-6">Ready to spend or withdraw.</p>
                </div>

                <div className="p-8 rounded-3xl bg-slate-800 dark:bg-[#0d1326] border border-slate-700 dark:border-white/10 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-60 mb-1 text-amber-400">My Locked Escrow</p>
                        <h2 className="text-4xl font-extrabold">${lockedBalance.toFixed(2)}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-6 leading-relaxed">
                        Funds safely held for active orders. Refunded automatically if an order fails.
                    </p>
                </div>

                {user?.role === 'shopkeeper' && (
                    <div className="p-8 rounded-3xl bg-emerald-900/40 dark:bg-emerald-950/20 border border-emerald-700/50 dark:border-emerald-500/20 text-white shadow-lg flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1 text-emerald-400">Incoming Escrow</p>
                            <h2 className="text-4xl font-extrabold text-emerald-400">${incomingEscrow.toFixed(2)}</h2>
                        </div>
                        <p className="text-xs text-emerald-200/70 mt-6 leading-relaxed">
                            Funds locked by buyers for your active orders. Released upon successful delivery.
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Request Deposit</h3>
                        <form onSubmit={handleTopUp} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amount ($)</label>
                                <input 
                                    type="number" min="1" step="0.01" value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070b1c] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Payment Reference / Transaction ID</label>
                                <input 
                                    type="text" value={topUpReference}
                                    onChange={(e) => setTopUpReference(e.target.value)}
                                    placeholder="e.g., KPay #982374 or Bank Ref"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070b1c] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Payment Proof Screenshot (SS)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setTopUpScreenshot(e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-cyan-950 dark:file:text-cyan-300"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={isDepositing} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition text-sm">
                                {isDepositing ? 'Submitting...' : 'Submit Deposit & SS for Verification'}
                            </button>
                        </form>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Request Withdrawal</h3>
                        <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amount ($)</label>
                                <input 
                                    type="number" min="1" max={balance} step="0.01" value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070b1c] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">KPay / Bank Account Details</label>
                                <input 
                                    type="text" value={withdrawAccount}
                                    onChange={(e) => setWithdrawAccount(e.target.value)}
                                    placeholder="Account Name & Number"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#070b1c] border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white text-sm"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={isWithdrawing} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition text-sm">
                                {isWithdrawing ? 'Submitting...' : 'Request Admin Payout'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Transaction & Request Ledger</h3>
                    {transactions.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No transactions found.</p>
                    ) : (
                        <div className="overflow-y-auto max-h-[550px] pr-2 custom-scrollbar space-y-3">
                            {transactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50 dark:bg-white/5 transition hover:bg-slate-100">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white capitalize flex items-center gap-2">
                                            {tx.type} 
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                                tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 
                                                tx.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 
                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500">{tx.description || tx.reference_note || 'Admin verification pending'}</p>
                                        
                                        {/* Display uploaded screenshot link if available */}
                                        {tx.screenshot_path && (
                                            <a 
                                                href={`/storage/${tx.screenshot_path}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 mt-1"
                                            >
                                                🖼️ View Payment Screenshot (SS)
                                            </a>
                                        )}

                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(tx.created_at).toLocaleString()}</p>
                                        
                                        {tx.status === 'pending' && (
                                            <Link to="/chat" className="inline-block mt-1 text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline">
                                                💬 Contact Admin regarding this request
                                            </Link>
                                        )}
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