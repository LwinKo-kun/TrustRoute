import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCart, clearCart } from '../utils/cartStorage';

export default function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const items = getCart(user);
        setCartItems(items);
        
        api.get('/wallet').then(res => {
            const balance = res.data?.data?.balance || res.data?.balance || 0;
            setWalletBalance(Number(balance));
        }).catch(err => console.error("Failed to fetch wallet", err));
    }, [user]);

    const orderTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasEnoughBalance = walletBalance >= orderTotal;

    const uniqueShops = new Set(cartItems.map(item => item.shop_id));
    const hasMixedShops = uniqueShops.size > 1;

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0 || hasMixedShops) return;

        const shopId = cartItems[0].shop_id; 
        const items = cartItems.map(item => ({
            listing_id: item.id,
            quantity: item.quantity
        }));

        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/orders', { shop_id: shopId, items });
            
            clearCart(user);
            
            const shopkeeperId = response.data?.data?.shop?.shopkeeper_id || response.data?.shop?.shopkeeper_id;
            
            if (shopkeeperId) {
                navigate(`/chat/${shopkeeperId}`);
            } else {
                navigate('/dashboard'); 
            }
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order.');
            setLoading(false);
        } 
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4 flex flex-col gap-6 w-full">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Checkout</h1>
            
            {hasMixedShops && (
                <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-semibold border border-amber-500/20">
                    Your cart contains items from multiple shops. TrustRoute requires checking out from one shop at a time. Please clear or adjust your cart.
                </div>
            )}

            {error && <p className="p-4 bg-red-500/10 text-red-500 rounded-xl text-sm font-semibold">{error}</p>}
            
            {cartItems.length > 0 ? (
                <>
                    <div className="bg-white dark:bg-[#0d1326] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
                        <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Order Summary</p>
                        <ul className="text-sm space-y-3 mb-6">
                            {cartItems.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                                    <span>{item.quantity}x {item.title || 'Product'}</span>
                                    <span className="font-semibold">MMK {(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                            <span className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400">MMK {orderTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${hasEnoughBalance ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/20'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm">Wallet Balance</span>
                            <span className="font-extrabold text-lg">MMK {walletBalance.toFixed(2)}</span>
                        </div>
                        
                        {!hasEnoughBalance ? (
                            <div className="mt-4 text-rose-600 dark:text-rose-400 text-sm font-medium">
                                <p>Insufficient funds. You need MMK {(orderTotal - walletBalance).toFixed(2)} more.</p>
                                <Link to="/wallet" className="mt-3 block w-full text-center py-2.5 bg-rose-600 text-white rounded-xl font-bold shadow-md hover:bg-rose-700 transition">
                                    Top Up Wallet Now
                                </Link>
                            </div>
                        ) : (
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1">
                                Funds available. They will be locked securely in Escrow upon ordering.
                            </p>
                        )}
                    </div>
                    
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={loading || !hasEnoughBalance || hasMixedShops}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Processing Escrow Lock...' : 'Confirm & Place Order'}
                    </button>
                </>
            ) : (
                <p className="text-sm opacity-70">There are no items in your cart to checkout.</p>
            )}
        </div>
    );
}