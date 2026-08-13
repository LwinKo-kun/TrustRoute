<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\ListingComment;
use Illuminate\Http\Request;

class ListingCommentController extends Controller
{
    /**
     * Get all comments/reviews for a specific listing.
     */
    public function index(Listing $listing)
    {
        $comments = $listing->comments()
            ->with('user')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a new comment/review for a listing.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'comment'    => 'required|string|max:1000',
            'rating'     => 'nullable|integer|min:1|max:5',
        ]);

        $comment = ListingComment::create([
            'listing_id' => $validated['listing_id'],
            'user_id'    => auth()->id(),
            'comment'    => $validated['comment'],
            'rating'     => $validated['rating'] ?? 5,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => $comment->load('user'),
        ], 201);
    }
}