import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
    const { receiverId } = useParams();
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Auto Scroll to Bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/messages/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data.messages || []);
            setReceiver(res.data.receiver || null);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        // 3 စက္ကန့်တိုင်း မက်ဆေ့ခ်ျ သစ်များ အလိုအလျောက် စစ်ဆေးမည် (Auto Polling)
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageText = newMessage;
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/messages', {
                receiver_id: receiverId,
                message: messageText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages((prev) => [...prev, res.data]);
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message.');
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto p-12 text-center opacity-60">Loading chat...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 flex flex-col h-[80vh]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card-bg,transparent)]">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="text-xs font-semibold text-[var(--accent)] hover:underline">
                        ← Back
                    </Link>
                    <h2 className="text-base font-bold">
                        Chatting with: <span className="text-[var(--accent)]">{receiver?.name || 'Seller'}</span>
                    </h2>
                </div>
            </div>

            {/* Messages Box */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 my-2 border border-[var(--border)] rounded-2xl bg-[var(--border)]/5">
                {messages.length === 0 ? (
                    <div className="text-center opacity-50 my-auto text-sm">
                        No previous messages. Say Hi to start chatting! 👋
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                            >
                                <div
                                    className={`p-3 rounded-2xl text-sm ${isMe
                                            ? 'bg-[var(--accent)] text-white rounded-br-none'
                                            : 'bg-[var(--border)]/30 text-current rounded-bl-none'
                                        }`}
                                >
                                    {msg.message}
                                </div>
                                <span className="text-[10px] opacity-40 mt-1 px-1">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-[var(--accent)] text-white font-semibold text-sm rounded-xl hover:opacity-90 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
}