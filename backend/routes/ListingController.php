<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    /**
     * Display a listing of all marketplace products.
     */
    public function index(Request $request)
    {
        $query = Listing::with('shop');

        // Optional search query
        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Optional category filter
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        $listings = $query->latest()->get();

        return response()->json($listings);
    }

    /**
     * Display listings belonging to the authenticated shopkeeper.
     */
    public function shopListings(Request $request)
    {
        $shop = $request->user()->shop;

        if (!$shop) {
            return response()->json(['message' => 'Shop not found for this user'], 404);
        }

        $listings = Listing::where('shop_id', $shop->id)->latest()->get();

        return response()->json($listings);
    }

    /**
     * Display the specified listing detail with shop and reviews.
     */
    public function show(Listing $listing)
    {
        return response()->json($listing->load(['shop', 'reviews.user']));
    }

    /**
     * Store a newly created listing in storage.
     */
    public function store(StoreListingRequest $request)
    {
        $shop = $request->user()->shop;

        if (!$shop) {
            return response()->json(['message' => 'You must create a shop first'], 400);
        }

        $data = $request->validated();
        $data['shop_id'] = $shop->id;

        // Handle file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('listings', 'public');
            $data['image_path'] = $path;
        }

        $listing = Listing::create($data);

        return response()->json([
            'message' => 'Listing created successfully',
            'listing' => $listing->load('shop')
        ], 201);
    }

    /**
     * Update the specified listing in storage.
     */
    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($listing->image_path && Storage::disk('public')->exists($listing->image_path)) {
                Storage::disk('public')->delete($listing->image_path);
            }

            $path = $request->file('image')->store('listings', 'public');
            $data['image_path'] = $path;
        }

        $listing->update($data);

        return response()->json([
            'message' => 'Listing updated successfully',
            'listing' => $listing->load('shop')
        ]);
    }

    /**
     * Remove the specified listing from storage.
     */
    public function destroy(Listing $listing)
    {
        if ($listing->image_path && Storage::disk('public')->exists($listing->image_path)) {
            Storage::disk('public')->delete($listing->image_path);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }

    /**
     * Serve the listing image directly (Supports both File Storage and DB BLOB/Base64).
     */
    public function image(Listing $listing)
    {
        // 1. Storage disk ထဲတွင် image_path အနေဖြင့် ရှိမရှိ စစ်ဆေးခြင်း
        if ($listing->image_path && Storage::disk('public')->exists($listing->image_path)) {
            return Storage::disk('public')->response($listing->image_path);
        }

        // 2. Database ထဲတွင် image_data (BLOB / Base64) အနေဖြင့် ရှိမရှိ စစ်ဆေးခြင်း
        if (!empty($listing->image_data)) {
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $listing->image_data));
            return response($imageData)
                ->header('Content-Type', $listing->image_mime_type ?? 'image/jpeg');
        }

        return response()->json(['message' => 'Image not found'], 404);
    }
}