import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

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

                if (!productData || !productData.id) {
                    throw new Error('Invalid listing payload');
                }

                setListing(productData);

                // 2. Fetch Reviews
                try {
                    const reviewsRes = await api.get(`/listings/${id}/reviews`);
                    setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : reviewsRes.data?.data || []);
                } catch (revErr) {
                    console.warn('Could not fetch reviews endpoint, using pre-loaded reviews:', revErr);
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

    const addToCart = () => {
        if (!listing) return;
        const cartKey = `cart_user_${user?.id || 'guest'}`;
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
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

        localStorage.setItem(cartKey, JSON.stringify({ timestamp: Date.now(), items: cart }));
        window.dispatchEvent(new Event('cartUpdated'));
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
        return <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 dark:text-slate-400">Loading product details...</div>;
    }

    if (error || !listing) {
        return (
            <div className="max-w-7xl mx-auto p-12 text-center flex flex-col items-center gap-4 text-slate-900 dark:text-white">
                <p className="text-lg text-slate-500 dark:text-slate-400">{error || 'Listing not found.'}</p>
                <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const sellerUserId = listing.user_id || listing.shop?.user_id || listing.shop?.user?.id || listing.shop?.shopkeeper_id;
    const apiBaseUrl = api.defaults.baseURL || '/api';

    return (
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10 text-slate-900 dark:text-white transition-colors duration-300">
            <Link to="/dashboard" className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                ← Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Image */}
                <div className="w-full h-96 bg-slate-100 dark:bg-[#0d1326] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center relative shadow-sm">
                    <img
                        src={`${apiBaseUrl}/listings/${listing.id}/image`}
                        alt={listing.title || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                            {listing.shop?.shop_name || listing.shop?.name || 'Store'}
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{listing.title || 'Untitled Product'}</h1>
                        <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-3">
                            ${listing.price !== undefined ? listing.price : '0.00'}
                        </p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {listing.description || 'No detailed product description available.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>In Stock: <strong className="text-slate-900 dark:text-white">{listing.stock ?? 0}</strong></span>
                        <span>•</span>
                        <span>Category: <strong className="text-slate-900 dark:text-white">{listing.category || 'General'}</strong></span>
                    </div>

                    <hr className="border-slate-200 dark:border-white/10" />

                    {/* Shop & Chat Section */}
                    <div className="p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-[#0d1326] flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                    {(listing.shop?.shop_name || listing.shop?.name || 'S').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">SOLD BY</span>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{listing.shop?.shop_name || listing.shop?.name || 'Seller'}</h4>
                                </div>
                            </div>
                            {listing.shop?.user?.name && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                                    Seller: {listing.shop.user.name}
                                </span>
                            )}
                        </div>

                        <Link
                            to={sellerUserId ? `/chat/${sellerUserId}` : '#'}
                            onClick={(e) => {
                                if (!sellerUserId) {
                                    e.preventDefault();
                                    alert('Seller ID could not be identified from this listing.');
                                    console.log('Listing Object:', listing);
                                }
                            }}
                            className="w-full py-2.5 bg-purple-100/80 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 text-center text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                        >
                            <span>💬</span> Chat with Seller
                        </Link>
                    </div>

                    {/* Quantity & Cart Action */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#0d1326]">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => Math.min(listing.stock || 99, q + 1))}
                                className="px-3 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-md transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="flex flex-col gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Reviews & Comments</h2>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Leave a Review</h3>

                    <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#070b1c] text-slate-900 dark:text-white focus:outline-none"
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
                        className="w-full p-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                    />

                    <button
                        type="submit"
                        disabled={submittingReview}
                        className="self-start px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
                    >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>

                <div className="flex flex-col gap-4 mt-2">
                    {reviews.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">No reviews yet. Be the first to leave a comment!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="p-5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] flex flex-col gap-2 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.user?.name || rev.user_name || 'Customer'}</span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}</span>
                                </div>
                                <div className="text-yellow-500 text-xs">
                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}