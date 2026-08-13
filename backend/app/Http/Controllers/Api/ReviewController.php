<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\ListingComment;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display listing reviews/comments.
     */
    public function index(Request $request, $listing = null)
    {
        if ($listing) {
            $comments = ListingComment::where('listing_id', $listing)
                ->with('user')
                ->latest()
                ->get();
            return response()->json($comments);
        }

        return response()->json(ListingComment::with(['user', 'listing'])->latest()->get());
    }

    /**
     * Display comments for a specific listing.
     */
    public function listingReviews($listingId)
    {
        $comments = ListingComment::where('listing_id', $listingId)
            ->with('user')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a new listing comment/review.
     */
    public function store(StoreReviewRequest $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated. Please login to leave a review.'
            ], 401);
        }

        $validated = $request->validated();

        $comment = ListingComment::create([
            'user_id'    => $user->id,
            'listing_id' => $validated['listing_id'],
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review'  => $comment->load('user'),
        ], 201);
    }
}