// src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getListingImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${orderId}`);
                setOrder(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Order not found or unauthorized.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    // --- 1. ROLE-BASED LOGIC EVALUATION ---
    const isCustomer = user?.role === 'customer';
    const isShopkeeper = user?.role === 'shopkeeper';
    const isAdmin = user?.role === 'admin';

    // Determine who the user should chat with (Admins don't chat in this context)
    let chatTargetId = null;
    let chatLabel = "Secure Chat";
    if (isCustomer) {
        chatTargetId = order?.shop?.shopkeeper_id;
        chatLabel = "Chat with Seller";
    } else if (isShopkeeper) {
        chatTargetId = order?.customer_id;
        chatLabel = "Chat with Buyer";
    }

    // --- 2. 2PC ESCROW STATE TRANSITIONS ---
    const handleUpdateOrderStatus = async (newStatus) => {
        let confirmationMessage = "Are you sure you want to update this order?";
        
        if (newStatus === 'cancelled') {
            confirmationMessage = isAdmin 
                ? "ADMIN ACTION: Force cancel this order and refund escrow?" 
                : "WARNING: This marks the order as FAILED. Escrow funds will be refunded. Proceed?";
        } else if (newStatus === 'completed') {
            confirmationMessage = "SUCCESS: Confirm you received the items in good condition? Funds will be permanently released to the seller.";
        } else if (newStatus === 'processing') {
            confirmationMessage = "Accept this order and prepare it for dispatch?";
        } else if (newStatus === 'dispatched') {
            confirmationMessage = "Mark this order as dispatched (shipped)?";
        }

        if (!window.confirm(confirmationMessage)) return;

        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Refresh order data dynamically
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data.data);
        } catch (err) {
            console.error(`Failed to update order status to ${newStatus}`, err);
            alert(err.response?.data?.message || "Failed to update status. Please try again.");
        }
    };

    if (loading) return <div className="p-10 text-center font-medium text-slate-500">Loading order details...</div>;
    if (error) return <div className="p-10 text-center font-bold text-rose-500">{error}</div>;
    if (!order) return null;

    // Status UI Mapper
    const getStatusConfig = (status) => {
        switch(status) {
            case 'pending': return { label: 'Awaiting Seller', color: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' };
            case 'processing': return { label: 'Preparing Dispatch', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' };
            case 'dispatched': return { label: 'In Transit', color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' };
            case 'completed': return { label: 'Delivered (Funds Released)', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' };
            case 'cancelled': return { label: 'Failed (Refunded)', color: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' };
            default: return { label: status, color: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20' };
        }
    };
    const statusConfig = getStatusConfig(order.status);

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col gap-6 w-full transition-colors duration-300">
            
            {/* Header & Inter-User Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link to="/dashboard" className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order #{order.id}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                
                {/* Only render Chat if appropriate for the role */}
                {chatTargetId && (
                    <button 
                        onClick={() => navigate(`/chat/${chatTargetId}`)}
                        className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-700/50 font-bold rounded-xl shadow-sm hover:bg-blue-100 transition flex items-center gap-2"
                    >
                        <span>💬</span> {chatLabel}
                    </button>
                )}
            </div>

            {/* Status & Escrow Banner */}
            <div className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ${statusConfig.color}`}>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Current Status</p>
                    <h2 className="text-2xl font-black uppercase tracking-wide">{statusConfig.label}</h2>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Total Escrow Amount</p>
                    <h2 className="text-3xl font-black">${order.total_amount}</h2>
                </div>
            </div>

            {/* --- 3. DYNAMIC ROLE-AWARE ACTION PANEL --- */}
            {order.status !== 'completed' && order.status !== 'cancelled' && (
                <div className="bg-white dark:bg-[#0d1326] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col gap-3">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Order Management Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        
                        {/* SHOPKEEPER ACTIONS */}
                        {isShopkeeper && order.status === 'pending' && (
                            <>
                                <button onClick={() => handleUpdateOrderStatus('processing')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition">Accept Order</button>
                                <button onClick={() => handleUpdateOrderStatus('cancelled')} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition">Decline & Refund</button>
                            </>
                        )}
                        {isShopkeeper && order.status === 'processing' && (
                            <button onClick={() => handleUpdateOrderStatus('dispatched')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition">Mark as Dispatched (Shipped)</button>
                        )}
                        {isShopkeeper && order.status === 'dispatched' && (
                            <button onClick={() => handleUpdateOrderStatus('cancelled')} className="px-6 py-3 bg-rose-800 hover:bg-rose-900 border border-rose-500 text-white font-bold rounded-xl shadow-md transition">Report Failed Delivery (Refund Buyer)</button>
                        )}

                        {/* CUSTOMER ACTIONS */}
                        {isCustomer && order.status === 'pending' && (
                            <button onClick={() => handleUpdateOrderStatus('cancelled')} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition">Cancel Order (Refund Escrow)</button>
                        )}
                        {isCustomer && order.status === 'dispatched' && (
                            <>
                                <button onClick={() => handleUpdateOrderStatus('completed')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition">Confirm Delivery (Release Funds)</button>
                                <button onClick={() => handleUpdateOrderStatus('cancelled')} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition">Report Failure (Request Refund)</button>
                            </>
                        )}

                        {/* ADMIN ACTIONS */}
                        {isAdmin && (
                            <button onClick={() => handleUpdateOrderStatus('cancelled')} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition">
                                ⚖️ Force Refund (Arbitration)
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0d1326] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Customer Details</h3>
                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <p><span className="font-semibold text-slate-500 dark:text-slate-400 mr-2">Name:</span> {order.customer?.name || `User #${order.customer_id}`}</p>
                        <p><span className="font-semibold text-slate-500 dark:text-slate-400 mr-2">Email:</span> {order.customer?.email || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0d1326] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Shop Details</h3>
                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <p><span className="font-semibold text-slate-500 dark:text-slate-400 mr-2">Store:</span> {order.shop?.shop_name || 'N/A'}</p>
                        <p><span className="font-semibold text-slate-500 dark:text-slate-400 mr-2">Shop Status:</span> <span className="uppercase text-[10px] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded font-bold">{order.shop?.status}</span></p>
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="bg-white dark:bg-[#0d1326] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-10">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Order Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="p-3 rounded-tl-lg rounded-bl-lg">Product</th>
                                <th className="p-3 text-center">Unit Price</th>
                                <th className="p-3 text-center">Quantity</th>
                                <th className="p-3 text-right rounded-tr-lg rounded-br-lg">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {order.items?.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                        {item.listing_id ? (
                                            <img 
                                                src={getListingImageUrl(item.listing_id)} 
                                                alt="Product" 
                                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs border border-slate-200 dark:border-white/10">📦</div>
                                        )}
                                        <span>{item.listing?.title || 'Product Unavailable'}</span>
                                    </td>
                                    <td className="p-3 text-center">${item.price_at_purchase}</td>
                                    <td className="p-3 text-center font-bold bg-slate-50 dark:bg-white/5">{item.quantity}</td>
                                    <td className="p-3 text-right font-bold text-blue-600 dark:text-cyan-400">
                                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-200 dark:border-white/10">
                            <tr>
                                <td colSpan="3" className="p-4 text-right font-bold uppercase tracking-wider text-xs text-slate-500">Escrow Total</td>
                                <td className="p-4 text-right font-black text-xl text-slate-900 dark:text-white">${order.total_amount}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    );
}