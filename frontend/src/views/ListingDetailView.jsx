import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ListingDetailView() {
    const { id } = useParams();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // Reviews and comments state
    const [reviews, setReviews] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        // Fetch product listing details
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/listings/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setListing(data);
                }
            } catch (err) {
                console.error('Failed to load listing details', err);
            } finally {
                setLoading(false);
            }
        };

        // Fetch listing comments/reviews
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/listings/${id}/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (err) {
                console.error('Failed to load reviews', err);
            }
        };

        fetchListing();
        fetchReviews();
    }, [id]);

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

        const newReviewObj = {
            id: Date.now(),
            user_name: user?.name || 'Anonymous',
            rating: Number(rating),
            comment: commentText,
            created_at: new Date().toLocaleDateString(),
        };

        try {
            // POST review to API
            await fetch(`http://127.0.0.1:8000/api/listings/${id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReviewObj),
            });
        } catch (err) {
            console.warn('API submission error, updating UI locally.', err);
        }

        setReviews([newReviewObj, ...reviews]);
        setCommentText('');
        setRating(5);
    };

    if (loading) {
        return <div className="max-w-7xl mx-auto p-12 text-center opacity-60">Loading product details...</div>;
    }

    if (!listing) {
        return (
            <div className="max-w-7xl mx-auto p-12 text-center flex flex-col items-center gap-4">
                <p className="text-lg opacity-70">Listing not found.</p>
                <Link to="/dashboard" className="px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-xl">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 flex flex-col gap-10">
            <Link to="/dashboard" className="text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-1">
                ← Back to Marketplace
            </Link>

            {/* Main Listing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Image */}
                <div className="w-full h-96 bg-[var(--border)]/10 rounded-2xl overflow-hidden border border-[var(--border)] flex items-center justify-center">
                    <img
                        src={`http://127.0.0.1:8000/api/listings/${listing.id}/image`}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>

                {/* Product Info & Actions */}
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                            {listing.shop?.shop_name || 'Store'}
                        </span>
                        <h1 className="text-3xl font-extrabold mt-1">{listing.title}</h1>
                        <p className="text-2xl font-bold text-[var(--accent)] mt-3">${listing.price}</p>
                    </div>

                    <p className="text-sm opacity-80 leading-relaxed">
                        {listing.description || 'No detailed product description available.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs opacity-70">
                        <span>In Stock: <strong>{listing.stock}</strong></span>
                        <span>•</span>
                        <span>Category: <strong>{listing.category || 'General'}</strong></span>
                    </div>

                    <hr className="border-[var(--border)]" />

                    {/* Add to Cart Controls */}
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

            {/* Reviews & Comments Section */}
            <div className="flex flex-col gap-6 pt-8 border-t border-[var(--border)]">
                <h2 className="text-2xl font-bold">Customer Reviews & Comments</h2>

                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)]">
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
                        className="self-start px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition"
                    >
                        Submit Review
                    </button>
                </form>

                {/* Existing Comments List */}
                <div className="flex flex-col gap-4 mt-2">
                    {reviews.length === 0 ? (
                        <p className="text-sm opacity-60 italic">No reviews yet. Be the first to leave a comment!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="p-5 border border-[var(--border)] rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">{rev.user_name}</span>
                                    <span className="text-xs opacity-50">{rev.created_at}</span>
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
        </div>
    );
}