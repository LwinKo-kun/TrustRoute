import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ListingDetailView() {
    const params = useParams();
    const id = params.id || params.listingId || params.listing;

    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Reviews state
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    // 💬 Inline Chat Modal States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);

    useEffect(() => {
        if (!id) {
            setError('Product ID not found.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch Product Detail
                const productRes = await api.get(`/listings/${id}`);
                const productData = productRes.data?.data || productRes.data?.listing || productRes.data;
                setListing(productData);

                // 2. Fetch Reviews
                try {
                    const reviewsRes = await api.get(`/listings/${id}/reviews`);
                    setReviews(reviewsRes.data || []);
                } catch (revErr) {
                    console.warn('Could not fetch reviews separately:', revErr);
                    setReviews(productData?.reviews || []);
                }

            } catch (err) {
                console.error('Failed to fetch listing details:', err);
                setError('Product details could not be loaded.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 💡 Seller User ID ကို ဆွဲထုတ်ခြင်း
    const sellerUserId =
        listing?.shop?.user?.id ||
        listing?.shop?.user_id ||
        listing?.shop?.shopkeeper_id ||
        listing?.user_id;

    // 💬 Chat Box ပွင့်လာသည့်အခါ မက်ဆေ့ချ်များ ခေါ်ယူရန်
    const handleOpenChat = async () => {
        if (!sellerUserId) {
            alert('Seller User ID မတွေ့ရှိပါ။ Console ကို စစ်ဆေးပါ။');
            console.log('Listing Data:', listing);
            return;
        }

        setIsChatOpen(true);
        setLoadingChat(true);

        try {
            const res = await api.get(`/messages/${sellerUserId}`);
            const data = res.data?.data || res.data;
            setChatMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch chat history:', err);
        } finally {
            setLoadingChat(false);
        }
    };

    // 💬 စာပို့သည့် Handler
    const handleSendChatMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !sellerUserId) return;

        const messageToSend = chatInput;
        setChatInput('');

        try {
            const res = await api.post('/messages', {
                receiver_id: sellerUserId,
                message: messageToSend,
            });

            const newMsg = res.data?.message || res.data || {
                id: Date.now(),
                sender_id: user?.id,
                receiver_id: sellerUserId,
                message: messageToSend,
                created_at: new Date().toISOString()
            };

            setChatMessages((prev) => [...prev, newMsg]);
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Message မရောက်ပါ၊ ပြန်လည် ကြိုးစားပါ။');
        }
    };

    const addToCart = () => {
        if (!listing) return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex((item) => item.id === listing.id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                ...listing,
                price: Number(listing.price) || 0,
                quantity: quantity,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${quantity} "${listing.title}" to cart!`);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setSubmittingReview(true);
            const res = await api.post('/reviews', {
                listing_id: id,
                rating: Number(rating),
                comment: commentText,
            });

            const newReview = res.data?.review || {
                id: Date.now(),
                user: { name: user?.name || 'You' },
                rating: Number(rating),
                comment: commentText,
                created_at: new Date().toISOString(),
            };

            setReviews((prev) => [newReview, ...prev]);
            setCommentText('');
            setRating(5);
            alert('Review submitted successfully!');
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <div className="max-w-7xl mx-auto p-12 text-center opacity-60">Loading product details...</div>;
    }

    if (error || !listing) {
        return (
            <div className="max-w-7xl mx-auto p-12 text-center flex flex-col items-center gap-4">
                <p className="text-lg opacity-70">{error || 'Listing not found.'}</p>
                <Link to="/dashboard" className="px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-xl">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 flex flex-col gap-10 relative">
            <Link to="/dashboard" className="text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-1">
                ← Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="w-full h-96 bg-[var(--border)]/10 rounded-2xl overflow-hidden border border-[var(--border)] flex items-center justify-center relative">
                    <img
                        src={`http://127.0.0.1:8000/api/listings/${listing.id}/image`}
                        alt={listing.title || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                            {listing.shop?.shop_name || listing.shop?.name || 'Store'}
                        </span>
                        <h1 className="text-3xl font-extrabold mt-1">{listing.title || 'Untitled Product'}</h1>
                        <p className="text-2xl font-bold text-[var(--accent)] mt-3">
                            ${listing.price !== undefined ? listing.price : '0.00'}
                        </p>
                    </div>

                    <p className="text-sm opacity-80 leading-relaxed">
                        {listing.description || 'No detailed product description available.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs opacity-70">
                        <span>In Stock: <strong>{listing.stock ?? 0}</strong></span>
                        <span>•</span>
                        <span>Category: <strong>{listing.category || 'General'}</strong></span>
                    </div>

                    <hr className="border-[var(--border)]" />

                    {/* SOLD BY Box & Chat with Seller Button */}
                    <div className="p-4 border border-[var(--border)] rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                                    {(listing.shop?.shop_name || listing.shop?.name || 'S').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">SOLD BY</span>
                                    <h4 className="font-bold text-sm">{listing.shop?.shop_name || listing.shop?.name || 'Seller'}</h4>
                                </div>
                            </div>
                            {listing.shop?.user?.name && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                                    Seller: {listing.shop.user.name}
                                </span>
                            )}
                        </div>

                        {/* 💬 Chat with Seller Popup ကို ဖွင့်ပေးမည့် ခလုတ် */}
                        <button
                            type="button"
                            onClick={handleOpenChat}
                            className="w-full py-2.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-center text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>💬</span> Chat with Seller
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 bg-[var(--border)]/20 text-sm font-bold hover:bg-[var(--border)]/40 transition"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => Math.min(listing.stock || 99, q + 1))}
                                className="px-3 py-2 bg-[var(--border)]/20 text-sm font-bold hover:bg-[var(--border)]/40 transition"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            className="flex-1 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="flex flex-col gap-6 pt-8 border-t border-[var(--border)]">
                <h2 className="text-2xl font-bold">Customer Reviews & Comments</h2>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg,transparent)]">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-70">Leave a Review</h3>

                    <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold opacity-80">Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="p-2 border border-[var(--border)] rounded-lg text-sm bg-transparent"
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value="4">⭐⭐⭐⭐ (4/5)</option>
                            <option value="3">⭐⭐⭐ (3/5)</option>
                            <option value="2">⭐⭐ (2/5)</option>
                            <option value="1">⭐ (1/5)</option>
                        </select>
                    </div>

                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment or review here..."
                        rows="3"
                        required
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:border-[var(--accent)]"
                    />

                    <button
                        type="submit"
                        disabled={submittingReview}
                        className="self-start px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                    >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>

                <div className="flex flex-col gap-4 mt-2">
                    {reviews.length === 0 ? (
                        <p className="text-sm opacity-60 italic">No reviews yet. Be the first to leave a comment!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="p-5 border border-[var(--border)] rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">{rev.user?.name || rev.user_name || 'Customer'}</span>
                                    <span className="text-xs opacity-50">{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}</span>
                                </div>
                                <div className="text-yellow-500 text-xs">
                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                </div>
                                <p className="text-xs opacity-80 mt-1">{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 💬 FLOATING CHAT BOX POPUP (ညာဘက်အောက်ခြေတွင် ပေါ်လာမည်) */}
            {isChatOpen && (
                <div className="fixed bottom-5 right-5 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden h-[450px]">
                    {/* Header */}
                    <div className="p-3 bg-purple-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-base">💬</span>
                            <span className="font-bold text-sm truncate">
                                {listing.shop?.user?.name || listing.shop?.shop_name || 'Seller'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="text-white opacity-80 hover:opacity-100 font-bold px-2 py-0.5 text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages List */}
                    <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-2 bg-zinc-50 dark:bg-zinc-950 text-xs">
                        {loadingChat ? (
                            <p className="m-auto opacity-50">Loading chat...</p>
                        ) : chatMessages.length === 0 ? (
                            <div className="m-auto text-center opacity-60">
                                👋 Start a conversation with this seller!
                            </div>
                        ) : (
                            chatMessages.map((msg, idx) => {
                                const isMe = Number(msg.sender_id) === Number(user?.id);
                                return (
                                    <div
                                        key={msg.id || idx}
                                        className={`p-2.5 rounded-xl max-w-[80%] ${isMe
                                                ? 'bg-purple-600 text-white ml-auto rounded-br-none'
                                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 mr-auto rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Chat Input Form */}
                    <form onSubmit={handleSendChatMessage} className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-purple-600 dark:bg-zinc-800"
                        />
                        <button
                            type="submit"
                            className="px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}