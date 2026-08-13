import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
<<<<<<< HEAD
import RatingStars from '../../components/common/RatingStars';
=======
import { getCart, saveCart } from '../../utils/cartStorage';
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)

export default function ListingDetailView() {
    const params = useParams();
    const id = params.id || params.listingId || params.listing;

    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Review / Comment State
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
                setListing(productData);

<<<<<<< HEAD
                // 2. Fetch Reviews
                try {
                    const reviewsRes = await api.get(`/listings/${id}/reviews`);
                    const reviewData = Array.isArray(reviewsRes.data) ? reviewsRes.data : reviewsRes.data?.data || [];
                    setReviews(reviewData);
=======
                // 2. Fetch Reviews / Listing Comments
                try {
                    const reviewsRes = await api.get(`/listings/${id}/reviews`);
                    const reviewData = reviewsRes.data?.data || reviewsRes.data;
                    setReviews(Array.isArray(reviewData) ? reviewData : []);
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                } catch (revErr) {
                    console.warn('Could not fetch reviews separately, fallback to embedded comments:', revErr);
                    setReviews(productData?.comments || productData?.reviews || []);
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

    // 🛒 Add To Cart Handler (Updated to use User-Scoped Cart & 24h expiration helper)
    const addToCart = () => {
        if (!listing) return;
<<<<<<< HEAD
        const cartKey = `cart_user_${user?.id || 'guest'}`;
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        const existingIndex = cart.findIndex((item) => item.id === listing.id);
=======

        const currentCart = getCart(user);
        const existingIndex = currentCart.findIndex((item) => item.id === listing.id);
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)

        if (existingIndex > -1) {
            currentCart[existingIndex].quantity += quantity;
        } else {
            currentCart.push({
                ...listing,
                price: Number(listing.price) || 0,
                quantity: quantity,
            });
        }

<<<<<<< HEAD
        localStorage.setItem(cartKey, JSON.stringify({ timestamp: Date.now(), items: cart }));
        window.dispatchEvent(new Event('cartUpdated'));
=======
        saveCart(user, currentCart);
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
        alert(`Added ${quantity} "${listing.title}" to cart!`);
    };

    // Review Submission Handler
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        if (!user) {
            alert('Please sign in to submit a review.');
            return;
        }

        try {
            setSubmittingReview(true);
            const res = await api.post('/reviews', {
                listing_id: Number(id),
                rating: Number(rating),
                comment: commentText,
            });

            const newReview = res.data?.review || res.data?.data || {
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
            alert(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 dark:text-slate-400">Loading product details...</div>;
    }

    if (error || !listing) {
        return (
<<<<<<< HEAD
            <div className="max-w-7xl mx-auto p-12 text-center flex flex-col items-center gap-4 text-slate-900 dark:text-white">
                <p className="text-lg text-slate-500 dark:text-slate-400">{error || 'Listing not found.'}</p>
                <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md">
=======
            <div className="max-w-7xl mx-auto p-12 text-center flex flex-col items-center gap-4">
                <p className="text-lg opacity-70">{error || 'Listing not found.'}</p>
                <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const sellerUserId = listing.user_id || listing.shop?.user_id || listing.shop?.user?.id || listing.shop?.shopkeeper_id;
    const apiBaseUrl = api.defaults.baseURL || '/api';
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
        : 0;

    return (
<<<<<<< HEAD
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10 text-slate-900 dark:text-white transition-colors duration-300">
            <Link to="/dashboard" className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
=======
        <div className="max-w-7xl mx-auto pb-12 flex flex-col gap-10">
            <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                ← Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Image */}
<<<<<<< HEAD
                <div className="w-full h-96 bg-slate-100 dark:bg-[#0d1326] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center relative shadow-sm">
=======
                <div className="w-full h-96 bg-slate-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 flex items-center justify-center relative">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
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
<<<<<<< HEAD
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                            {listing.shop?.shop_name || listing.shop?.name || 'Store'}
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{listing.title || 'Untitled Product'}</h1>
                        
                        {/* Rating Display */}
                        <div className="mt-2">
                            <RatingStars rating={averageRating} count={reviews.length} size="md" />
                        </div>

                        <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-3">
=======
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            {listing.shop?.shop_name || listing.shop?.name || 'Store'}
                        </span>
                        <h1 className="text-3xl font-extrabold mt-1">{listing.title || 'Untitled Product'}</h1>
                        <p className="text-2xl font-bold text-blue-600 mt-3">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                            ${listing.price !== undefined ? listing.price : '0.00'}
                        </p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {listing.description || 'No detailed product description available.'}
                    </p>

<<<<<<< HEAD
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>In Stock: <strong className="text-slate-900 dark:text-white">{listing.stock ?? 0}</strong></span>
                        <span>•</span>
                        <span>Category: <strong className="text-slate-900 dark:text-white">{listing.category || 'General'}</strong></span>
                    </div>

                    <hr className="border-slate-200 dark:border-white/10" />

                    {/* Shop & Chat Section */}
                    <div className="p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-[#0d1326] flex flex-col gap-3">
=======
                    <div className="flex items-center gap-4 text-xs opacity-70">
                        <span>In Stock: <strong>{listing.stock ?? 0}</strong></span>
                    </div>

                    <hr className="border-slate-200 dark:border-zinc-700" />

                    {/* Chat with Seller */}
                    <div className="p-4 border border-slate-200 dark:border-zinc-700 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 flex flex-col gap-3">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
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
                        </div>

                        <Link
                            to={sellerUserId ? `/chat/${sellerUserId}` : '#'}
<<<<<<< HEAD
                            onClick={(e) => {
                                if (!sellerUserId) {
                                    e.preventDefault();
                                    alert('Seller ID could not be identified from this listing.');
                                }
                            }}
                            className="w-full py-2.5 bg-purple-100/80 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 text-center text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
=======
                            className="w-full py-2.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 text-center text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                        >
                            <span>💬</span> Chat with Seller
                        </Link>
                    </div>

                    {/* Quantity & Cart Action */}
                    <div className="flex items-center gap-4">
<<<<<<< HEAD
                        <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#0d1326]">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition"
=======
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 bg-slate-100 text-sm font-bold hover:bg-slate-200 transition"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                            >
                                -
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => Math.min(listing.stock || 99, q + 1))}
<<<<<<< HEAD
                                className="px-3 py-2 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition"
=======
                                className="px-3 py-2 bg-slate-100 text-sm font-bold hover:bg-slate-200 transition"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
<<<<<<< HEAD
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-md transition"
=======
                            className="flex-1 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {/* Customer Reviews */}
            <div className="flex flex-col gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Reviews & Comments</h2>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Leave a Review</h3>
=======
            {/* 🌟 REVIEW FEATURE SECTION */}
            <div className="flex flex-col gap-6 pt-8 border-t border-slate-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Customer Reviews & Ratings</h2>
                    <span className="text-sm text-slate-500 font-medium">
                        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </span>
                </div>

                {/* Submit Review Form */}
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-6 border border-slate-200 dark:border-zinc-700 rounded-2xl bg-slate-50/50 dark:bg-zinc-800/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Write a Review</h3>
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)

                    <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
<<<<<<< HEAD
                            className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#070b1c] text-slate-900 dark:text-white focus:outline-none"
=======
                            className="p-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-900"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
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
                        placeholder="Write your review or product feedback..."
                        rows="3"
                        required
<<<<<<< HEAD
                        className="w-full p-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400"
=======
                        className="w-full p-3 border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-blue-500"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                    />

                    <button
                        type="submit"
                        disabled={submittingReview}
<<<<<<< HEAD
                        className="self-start px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
=======
                        className="self-start px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                    >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>

                {/* Reviews List */}
                <div className="flex flex-col gap-4 mt-2">
                    {reviews.length === 0 ? (
<<<<<<< HEAD
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">No reviews yet. Be the first to leave a comment!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="p-5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] flex flex-col gap-2 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        {rev.user?.name || rev.reviewer?.name || rev.user_name || 'Customer'}
                                    </span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
=======
                        <p className="text-sm text-slate-400 italic">No reviews yet. Be the first to leave a review for this product!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="p-5 border border-slate-200 dark:border-zinc-700 rounded-2xl flex flex-col gap-2 bg-white dark:bg-zinc-900 shadow-xs">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                                            {(rev.user?.name || rev.user_name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-sm">{rev.user?.name || rev.user_name || 'Customer'}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <div className="text-amber-500 text-xs">
                                    {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                                </div>
<<<<<<< HEAD
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{rev.comment}</p>
=======
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                                    {rev.comment}
                                </p>
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}