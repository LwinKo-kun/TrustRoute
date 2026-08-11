import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ChatPage() {
    const { sellerId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. စာလာပို့ထားသော လူစာရင်း (Conversations List) ဆွဲယူမည်
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/conversations');
                setConversations(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Failed to fetch conversations:", err);
            }
        };

        fetchConversations();
    }, []);

    // 2. ရွေးချယ်ထားသော လူနှင့် မက်ဆေ့ချ်များ ဆွဲယူမည်
    useEffect(() => {
        if (!sellerId || sellerId === 'undefined') return;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/messages/${sellerId}`);
                setMessages(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [sellerId]);

    // 3. စာပြန်ရန် / စာပို့ရန်
    const handleSendMessage = async (e) => {
        e.preventDefault();

        const targetId = Number(sellerId);
        if (!targetId || isNaN(targetId)) {
            alert("စကားပြောရန် User/Seller ID မှန်ကန်မှုမရှိပါ။");
            return;
        }

        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/messages', {
                receiver_id: targetId,
                message: newMessage,
            });

            const sentMsg = res.data?.message || res.data;
            setMessages((prev) => [...prev, sentMsg]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message:", err);
            alert("စာပို့ရာတွင် အမှားအယွင်းရှိနေပါသည်။");
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-6 border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--card-bg,white)] flex h-[600px]">
            {/* LEFT SIDEBAR: စာလာပို့ထားသော လူများစာရင်း */}
            <div className="w-1/3 border-r border-[var(--border)] bg-gray-50 dark:bg-gray-900/50 flex flex-col">
                <div className="p-4 border-b border-[var(--border)] font-bold text-lg">
                    💬 Messages Inbox
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-xs opacity-60 text-center">No active chats yet.</p>
                    ) : (
                        conversations.map((chatUser) => (
                            <div
                                key={chatUser.id}
                                onClick={() => navigate(`/chat/${chatUser.id}`)}
                                className={`p-4 border-b border-[var(--border)] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-3 ${String(sellerId) === String(chatUser.id) ? 'bg-purple-50 dark:bg-purple-900/20 font-bold' : ''
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                    {chatUser.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm truncate">{chatUser.name || `User #${chatUser.id}`}</p>
                                    <p className="text-xs opacity-60 truncate">{chatUser.last_message || 'Click to view chat'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col justify-between bg-white dark:bg-gray-950">
                {!sellerId || sellerId === 'undefined' ? (
                    <div className="flex-1 flex items-center justify-center text-sm opacity-60">
                        Select a conversation from the left sidebar or click "Chat with Seller" from a product.
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[var(--border)] font-bold text-sm flex items-center justify-between">
                            <span>Chatting with User #{sellerId}</span>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {loading ? (
                                <p className="text-center text-xs opacity-60">Loading chat history...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-center text-xs opacity-60">No messages yet. Say hi!</p>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = String(msg.sender_id) === String(user?.id);
                                    return (
                                        <div
                                            key={msg.id || idx}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe
                                                        ? 'bg-purple-600 text-white rounded-br-none'
                                                        : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
                                                    }`}
                                            >
                                                <p>{msg.message}</p>
                                                <span className="text-[10px] opacity-60 block text-right mt-1">
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Send Box */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)] flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-3 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:border-purple-600"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
                            >
                                Send
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}