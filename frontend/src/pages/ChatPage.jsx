// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    
    const [conversations, setConversations] = useState([]);
    const [activeUserId, setActiveUserId] = useState(userId || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = (behavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    };

    // Sync URL param
    useEffect(() => {
        if (userId && userId !== 'undefined') {
            setActiveUserId(userId);
        }
    }, [userId]);

    // 1. Fetch Conversations
    const fetchConversations = useCallback(async () => {
        try {
            const res = await api.get('/conversations');
            const data = res.data.data || res.data;
            setConversations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load conversations', err);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
        const convInterval = setInterval(fetchConversations, 4000); 
        return () => clearInterval(convInterval);
    }, [fetchConversations]);

    // 2. Fetch Messages and force auto-refresh state updates for statuses
    const fetchMessages = useCallback(async (isInitial = false) => {
        if (!activeUserId || activeUserId === 'undefined') return;
        try {
            const res = await api.get(`/messages/${activeUserId}`);
            const data = res.data.data || res.data;
            const fetched = Array.isArray(data) ? data : [];
            
            setMessages((prev) => {
                // Always sync to capture real-time order status changes inside chat bubbles
                if (isInitial || prev.length !== fetched.length || JSON.stringify(prev) !== JSON.stringify(fetched)) {
                    if (isInitial || prev.length < fetched.length) {
                        setTimeout(() => scrollToBottom(isInitial ? 'auto' : 'smooth'), 50);
                    }
                    return fetched;
                }
                return prev; 
            });
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    }, [activeUserId]);

    useEffect(() => {
        fetchMessages(true);
        const msgInterval = setInterval(() => fetchMessages(false), 2000);
        return () => clearInterval(msgInterval);
    }, [fetchMessages]);

    // 3. Send Text Message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUserId || isSending) return;

        const textToSend = newMessage.trim();
        setNewMessage(''); 
        setIsSending(true);

        try {
            const res = await api.post('/messages', {
                receiver_id: activeUserId,
                message: textToSend,
                type: 'text'
            });
            const sentMsg = res.data.message || res.data;
            setMessages((prev) => [...prev, sentMsg]);
            scrollToBottom('smooth');
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message', err);
            setNewMessage(textToSend); 
        } finally {
            setIsSending(false);
        }
    };

    // 4. Handle 2PC Escrow/Order Status Transitions with Immediate Refresh
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        let confirmationMessage = "Are you sure you want to update this order?";
        
        if (newStatus === 'cancelled') {
            confirmationMessage = "WARNING: This will mark the order as FAILED. The locked Escrow funds will be immediately refunded to the buyer's wallet. Proceed?";
        } else if (newStatus === 'completed') {
            confirmationMessage = "SUCCESS: Have you received the items in good condition? Confirming will permanently release the Escrow funds to the shopkeeper. Proceed?";
        } else if (newStatus === 'processing') {
            confirmationMessage = "Accept this order and prepare it for dispatch?";
        }

        if (!window.confirm(confirmationMessage)) return;

        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            await fetchMessages(true); // Force immediate refresh
            await fetchConversations();
        } catch (err) {
            console.error(`Failed to update order status to ${newStatus}`, err);
            alert("Failed to update status. Please try again.");
        }
    };

    const activeUser = conversations.find((c) => Number(c.id) === Number(activeUserId));
    const filteredConversations = conversations.filter(c => 
        (c.name || `User #${c.id}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusConfig = (status) => {
        switch(status) {
            case 'pending': return { label: 'Awaiting Seller', color: 'bg-amber-500/20 text-amber-500' };
            case 'processing': return { label: 'Preparing Dispatch', color: 'bg-blue-500/20 text-blue-400' };
            case 'dispatched': return { label: 'In Transit', color: 'bg-purple-500/20 text-purple-400' };
            case 'completed': return { label: 'Delivered (Funds Released)', color: 'bg-emerald-500/20 text-emerald-400' };
            case 'cancelled': return { label: 'Failed (Refunded)', color: 'bg-rose-500/20 text-rose-400' };
            default: return { label: status, color: 'bg-slate-500/20 text-slate-400' };
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col transition-colors duration-300">
            <div className="flex flex-1 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] shadow-sm min-h-0 transition-colors duration-300">

                {/* Sidebar: Conversation List */}
                <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-50/50 dark:bg-[#0a0f1d]/50">
                    <div className="p-4 border-b border-slate-200 dark:border-white/10 shrink-0 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">Messages</h3>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-cyan-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200/50 dark:border-cyan-500/20">
                                {conversations.length} Active
                            </span>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search chats..."
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#070b1c] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition shadow-inner"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 custom-scrollbar">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs gap-2 p-4 text-center">
                                <span className="text-3xl">📭</span>
                                <p className="font-medium">No conversations found.</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const isActive = Number(activeUserId) === Number(conv.id);
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveUserId(conv.id)}
                                        className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-left ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'hover:bg-slate-200/60 dark:hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        <div className={`w-11 h-11 rounded-full font-bold flex items-center justify-center shrink-0 text-sm shadow-sm ${
                                            isActive 
                                                ? 'bg-white text-blue-600' 
                                                : 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                                        }`}>
                                            {conv.name ? conv.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                    {conv.name || `User #${conv.id}`}
                                                </h4>
                                            </div>
                                            <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                                {conv.last_message || 'Tap to open chat'}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right: Message Stream */}
                <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-[#070b1c]/30 min-h-0">
                    {activeUserId && activeUserId !== 'undefined' ? (
                        <>
                            {/* Chat Topbar */}
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0d1326]/80 backdrop-blur-md flex items-center justify-between shrink-0 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                        {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {activeUser ? activeUser.name : `User #${activeUserId}`}
                                        </h2>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Active Secure Chat</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-3 min-h-0 custom-scrollbar">
                                {messages.length === 0 ? (
                                    <div className="m-auto text-center text-slate-400 dark:text-slate-500 text-sm flex flex-col items-center gap-2">
                                        <span className="text-4xl">💬</span>
                                        <p className="font-medium">No messages in this chat yet.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = Number(msg.sender_id) !== Number(activeUserId);
                                        const isOrderRequest = msg.type === 'order_request';

                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                                                    isMe ? 'self-end items-end ml-auto' : 'self-start items-start'
                                                }`}
                                            >
                                                <div
                                                    className={`p-4 rounded-2xl text-sm shadow-sm ${
                                                        isMe
                                                            ? 'bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white rounded-br-none'
                                                            : 'bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-bl-none'
                                                    }`}
                                                >
                                                    {/* Plain Text or System Alerts */}
                                                    {(msg.type === 'text' || msg.type === 'system_alert') && (
                                                        <p className="leading-relaxed whitespace-pre-wrap select-text">{msg.message}</p>
                                                    )}

                                                    {/* Escrow/Order Status Card */}
                                                    {isOrderRequest && msg.order && (
                                                        <div className="flex flex-col gap-2.5 min-w-[280px]">
                                                            <div className="bg-black/10 dark:bg-black/40 p-4 rounded-xl border border-white/20 dark:border-white/10 shadow-inner">
                                                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/15">
                                                                    
                                                                    {/* CLICKABLE ORDER LINK */}
                                                                    <Link 
                                                                        to={`/orders/${msg.order.id}`} 
                                                                        className="font-extrabold text-sm tracking-wide hover:text-blue-300 dark:hover:text-cyan-300 transition underline decoration-dashed underline-offset-4 cursor-pointer"
                                                                        title="View Full Order Details"
                                                                    >
                                                                        🛒 Order #{msg.order.id} ↗
                                                                    </Link>

                                                                    <span className={`px-2.5 py-1 text-[10px] rounded flex items-center gap-1 uppercase font-extrabold tracking-wider ${getStatusConfig(msg.order.status).color}`}>
                                                                        {getStatusConfig(msg.order.status).label}
                                                                    </span>
                                                                </div>

                                                                <div className="mb-3 space-y-2 max-h-32 overflow-y-auto pr-1">
                                                                    {msg.order.items && msg.order.items.length > 0 ? (
                                                                        msg.order.items.map((item, i) => (
                                                                            <div key={i} className="flex justify-between text-xs opacity-95">
                                                                                <span className="truncate pr-3 font-medium">
                                                                                    <span className="opacity-70 mr-1">{item.quantity}x</span> {item.listing?.title || 'Product'}
                                                                                </span>
                                                                                <span className="font-semibold">${Number(item.quantity * item.price_at_purchase).toFixed(2)}</span>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-xs opacity-90 truncate">{msg.listing?.title || 'Product'}</p>
                                                                    )}
                                                                </div>

                                                                <div className="flex justify-between items-end border-t border-white/15 pt-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-bold uppercase opacity-70 tracking-widest">Escrow Locked</span>
                                                                    </div>
                                                                    <p className="text-lg font-black text-white">${msg.order.total_amount}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <p className="text-xs opacity-90 italic px-1 mt-1">{msg.message}</p>
                                                            
                                                            {/* --- ACTIONS FOR SHOPKEEPER --- */}
                                                            {!isMe && currentUser?.role === 'shopkeeper' && (
                                                                <div className="flex flex-col gap-2 mt-2">
                                                                    {msg.order.status === 'pending' && (
                                                                        <div className="flex gap-2">
                                                                            <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'processing')} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-bold transition shadow-sm">Accept Order</button>
                                                                            <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'cancelled')} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg font-bold transition shadow-sm">Decline & Refund</button>
                                                                        </div>
                                                                    )}
                                                                    {msg.order.status === 'processing' && (
                                                                        <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'dispatched')} className="w-full py-2 bg-blue-600 hover:bg-blue-700 border border-blue-400 text-white text-xs rounded-lg font-bold transition shadow-sm">Mark as Dispatched (Shipped)</button>
                                                                    )}
                                                                    {msg.order.status === 'dispatched' && (
                                                                        <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'cancelled')} className="w-full py-2 bg-rose-800 hover:bg-rose-900 border border-rose-400 text-white text-xs rounded-lg font-bold transition shadow-sm">Report Failed Delivery (Refund Buyer)</button>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* --- ACTIONS FOR CUSTOMER --- */}
                                                            {isMe && currentUser?.role === 'customer' && (
                                                                <div className="flex flex-col gap-2 mt-2">
                                                                    {msg.order.status === 'pending' && (
                                                                        <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'cancelled')} className="w-full py-2 bg-rose-600 hover:bg-rose-700 border border-rose-400 text-white text-xs rounded-lg font-bold transition shadow-sm">Cancel Order (Refund Escrow)</button>
                                                                    )}
                                                                    {msg.order.status === 'dispatched' && (
                                                                        <div className="flex gap-2">
                                                                            <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'completed')} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 border border-emerald-400 text-white text-xs rounded-lg font-bold transition shadow-sm">Confirm Delivery</button>
                                                                            <button onClick={() => handleUpdateOrderStatus(msg.order.id, 'cancelled')} className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 border border-rose-500 text-white text-xs rounded-lg font-bold transition shadow-sm">Report Failure</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <span className={`text-[10px] mt-1 px-1 opacity-60 ${isMe ? 'text-right text-slate-500 dark:text-slate-400' : 'text-left text-slate-400 dark:text-slate-500'}`}>
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Composer */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] flex items-center gap-3 shrink-0">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-white transition shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-1.5"
                                >
                                    <span>Send</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-3 p-6">
                            <span className="text-5xl">💬</span>
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">No Conversation Selected</h3>
                            <p className="text-sm text-center max-w-sm">
                                Pick a recipient from your inbox on the left or browse products to chat with sellers directly.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}