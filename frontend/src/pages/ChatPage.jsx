import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeUserId, setActiveUserId] = useState(userId || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Sync URL param
    useEffect(() => {
        if (userId && userId !== 'undefined') {
            setActiveUserId(userId);
        }
    }, [userId]);

    // Load conversations
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

    // Load messages when active user changes
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

    // Send message
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
            // Refresh conversations list
            const resConv = await api.get('/conversations');
            const convData = resConv.data.data || resConv.data;
            setConversations(Array.isArray(convData) ? convData : []);
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const activeUser = conversations.find((c) => Number(c.id) === Number(activeUserId));

    return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    💬 <span>Messages</span>
                </h1>

                <div className="flex border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] shadow-sm h-[650px] transition-colors duration-300">

                    {/* Left Sidebar — Conversations */}
                    <div className="w-1/3 border-r border-slate-200 dark:border-white/10 flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-white/5">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Inbox</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs gap-2">
                                    <span className="text-2xl">📭</span>
                                    <p>No active chats yet.</p>
                                    <p className="text-center opacity-70">Go to a product and click "Chat with Seller".</p>
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const isActive = Number(activeUserId) === Number(conv.id);
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => setActiveUserId(conv.id)}
                                            className={`w-full p-3 rounded-xl transition flex items-center gap-3 text-left ${
                                                isActive
                                                    ? 'bg-blue-50 dark:bg-cyan-950/50 border border-blue-200 dark:border-cyan-500/30'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                                                {conv.name ? conv.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-blue-700 dark:text-cyan-300' : 'text-slate-900 dark:text-white'}`}>
                                                    {conv.name || `User #${conv.id}`}
                                                </h4>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Click to view chat</p>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right — Chat Area */}
                    <div className="w-2/3 flex flex-col bg-slate-50/50 dark:bg-[#070b1c]/50">
                        {activeUserId && activeUserId !== 'undefined' ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm">
                                        {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {activeUser ? activeUser.name : `Seller (#${activeUserId})`}
                                        </h2>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">Active conversation</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-3">
                                    {messages.length === 0 ? (
                                        <div className="m-auto text-center text-slate-400 dark:text-slate-500 text-sm flex flex-col items-center gap-2">
                                            <span className="text-3xl">👋</span>
                                            <p>Start the conversation by sending a message!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isMe = Number(msg.sender_id) !== Number(activeUserId);
                                            return (
                                                <div
                                                    key={msg.id || index}
                                                    className={`max-w-[70%] p-3.5 rounded-2xl text-sm ${
                                                        isMe
                                                            ? 'bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white self-end ml-auto rounded-br-none shadow-sm'
                                                            : 'bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white self-start rounded-bl-none shadow-sm'
                                                    }`}
                                                >
                                                    <p className="leading-relaxed">{msg.message}</p>
                                                    <span className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-right text-blue-100 dark:text-cyan-100' : 'text-left text-slate-400 dark:text-slate-500'}`}>
                                                        {msg.created_at
                                                            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                            : ''}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-grow p-3 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-white"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white font-semibold rounded-xl text-sm transition shadow-sm"
                                    >
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-3">
                                <span className="text-4xl">💬</span>
                                <p className="text-sm text-center max-w-xs">
                                    Select a conversation from the left, or click <strong className="text-slate-700 dark:text-slate-300">"Chat with Seller"</strong> from any product page.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
}