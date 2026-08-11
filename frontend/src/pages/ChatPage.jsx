import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ChatPage() {
    const { userId } = useParams(); // URL မှ /chat/:userId
    const [conversations, setConversations] = useState([]);
    const [activeUserId, setActiveUserId] = useState(userId || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // 1. URL မှ userId ပြောင်းသွားပါက activeUserId ကို Update လုပ်မည်
    useEffect(() => {
        if (userId && userId !== 'undefined') {
            setActiveUserId(userId);
        }
    }, [userId]);

    // 2. Conversations စာရင်း ဆွဲထုတ်မည်
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/conversations');
                const data = res.data.data || res.data;
                setConversations(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load conversations', err);
            }
        };
        fetchConversations();
    }, []);

    // 3. activeUserId ရှိပါက မက်ဆေ့ချ်များ ယူမည်
    useEffect(() => {
        if (!activeUserId || activeUserId === 'undefined') return;

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/${activeUserId}`);
                const data = res.data.data || res.data;
                setMessages(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load messages', err);
            }
        };

        fetchMessages();
    }, [activeUserId]);

    // 4. မက်ဆေ့ချ် ပို့မည်
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUserId) return;

        try {
            const res = await api.post('/messages', {
                receiver_id: activeUserId,
                message: newMessage,
            });

            const sentMsg = res.data.message || res.data;
            setMessages((prev) => [...prev, sentMsg]);
            setNewMessage('');

            // စာပို့ပြီးပါက Conversations စာရင်းကို ပြန် Update လုပ်မည်
            const resConv = await api.get('/conversations');
            const convData = resConv.data.data || resConv.data;
            setConversations(Array.isArray(convData) ? convData : []);
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    // Active User ကို ရှာယူခြင်း
    const activeUser = conversations.find((c) => Number(c.id) === Number(activeUserId));

    return (
        <div className="flex border border-[var(--border)] rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 h-[650px] max-w-6xl mx-auto my-6 shadow-sm">

            {/* 🟢 ဘယ်ဘက် - Messages Inbox Sidebar */}
            <div className="w-1/3 border-r border-[var(--border)] p-4 flex flex-col gap-3">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span>💬</span> Messages Inbox
                </h3>

                <div className="flex flex-col gap-2 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="text-xs opacity-60 p-2">No active chats yet.</p>
                    ) : (
                        conversations.map((user) => {
                            const isActive = Number(activeUserId) === Number(user.id);
                            return (
                                <button
                                    key={user.id}
                                    onClick={() => setActiveUserId(user.id)}
                                    className={`p-3 rounded-xl transition flex items-center gap-3 text-left ${isActive
                                            ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800'
                                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>

                                    <div className="overflow-hidden">
                                        <h4 className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                                            {user.name || `User #${user.id}`}
                                        </h4>
                                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                            Click to view chat
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 🟢 ညာဘက် - Chat Room Main Area */}
            <div className="w-2/3 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                {activeUserId && activeUserId !== 'undefined' ? (
                    <>
                        {/* Header တန်း */}
                        <div className="p-4 border-b border-[var(--border)] bg-white dark:bg-zinc-900 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                                {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <h2 className="font-bold text-base text-zinc-800 dark:text-zinc-100">
                                Chatting with {activeUser ? activeUser.name : `Seller (#${activeUserId})`}
                            </h2>
                        </div>

                        {/* စာတိုများ ပြသသည့်နေရာ */}
                        <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-3">
                            {messages.length === 0 ? (
                                <div className="m-auto text-center opacity-60 text-xs">
                                    👋 Start the conversation by sending a message!
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = Number(msg.sender_id) !== Number(activeUserId);
                                    return (
                                        <div
                                            key={msg.id || index}
                                            className={`max-w-[70%] p-3.5 rounded-2xl text-sm ${isMe
                                                    ? 'bg-purple-600 text-white self-end ml-auto rounded-br-xs'
                                                    : 'bg-white dark:bg-zinc-800 border border-[var(--border)] text-zinc-800 dark:text-zinc-200 self-start rounded-bl-xs shadow-xs'
                                                }`}
                                        >
                                            <p className="leading-relaxed">{msg.message}</p>
                                            <span
                                                className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-right text-purple-100' : 'text-left text-zinc-400'
                                                    }`}
                                            >
                                                {msg.created_at
                                                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ''}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* စာရိုက်ရန် Input Box */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)] bg-white dark:bg-zinc-900 flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow p-3 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-purple-500 bg-zinc-50 dark:bg-zinc-800"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl text-sm hover:bg-purple-700 transition shadow-xs"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-sm opacity-60 gap-2">
                        <span>💬</span>
                        <p>Select a conversation from the left sidebar or click "Chat with Seller" from a product.</p>
                    </div>
                )}
            </div>

        </div>
    );
}