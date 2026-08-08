<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display all reviews.
     */
    public function index()
    {
        return response()->json(Review::with(['user', 'listing'])->latest()->get());
    }

    /**
     * Display reviews for a specific listing.
     */
    public function listingReviews(Listing $listing)
    {
        $reviews = $listing->reviews()->with('user')->latest()->get();
        return response()->json($reviews);
    }

    /**
     * Store a new review.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'required|string',
        ]);

        $review = Review::create([
            'user_id'    => $request->user()->id,
            'listing_id' => $validated['listing_id'],
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review'  => $review->load('user'),
        ], 201);
    }
}