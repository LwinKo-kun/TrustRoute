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
    public function index(Request $request)
    {
        $query = Listing::with(['shop.user']);

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->latest()->paginate(12));
    }

    public function shopListings(Request $request)
    {
        $shop = $request->user()->shop;
        if (!$shop) {
            return response()->json(['message' => 'Shop not found.'], 404);
        }

        return response()->json($shop->listings()->latest()->paginate(12));
    }

    public function store(StoreListingRequest $request)
    {
        $shop = $request->user()->shop;
        if (!$shop) {
            return response()->json(['message' => 'You must create a shop first.'], 400);
        }

        $data = $request->validated();
        $data['shop_id'] = $shop->id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('listings', 'public');
            $data['image_path'] = $path;
        }

        $listing = Listing::create($data);

        return response()->json([
            'message' => 'Listing created successfully',
            'data' => $listing->load('shop.user')
        ], 201);
    }

        public function show(Listing $listing)
    {
        return response()->json([
            'data' => $listing->load(['shop.user', 'comments.user'])
        ]);
    }

    public function image(Listing $listing)
    {
        // 1. Check local/public storage disk
        if (isset($listing->image_path) && Storage::disk('public')->exists($listing->image_path)) {
            return Storage::disk('public')->response($listing->image_path);
        }

        // 2. Fallback to database binary stream / hex bytea
        if (!empty($listing->image_data)) {
            $imageData = $listing->image_data;

            if (is_resource($imageData)) {
                $imageData = stream_get_contents($imageData);
            }

            if (str_starts_with($imageData, '\\x')) {
                $imageData = hex2bin(substr($imageData, 2));
            } elseif (str_starts_with($imageData, 'data:image')) {
                $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));
            }

            return response($imageData, 200)
                ->header('Content-Type', $listing->image_mime_type ?? 'image/jpeg')
                ->header('Cache-Control', 'public, max-age=86400');
        }

        return response()->json(['message' => 'Image not found'], 404);
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if (isset($listing->image_path) && Storage::disk('public')->exists($listing->image_path)) {
                Storage::disk('public')->delete($listing->image_path);
            }

            $path = $request->file('image')->store('listings', 'public');
            $data['image_path'] = $path;
        }

        $listing->update($data);

        return response()->json([
            'message' => 'Listing updated successfully',
            'data' => $listing->load('shop.user')
        ]);
    }

    public function destroy(Listing $listing)
    {
        if (auth()->id() !== $listing->shop->user_id && auth()->id() !== $listing->shop->shopkeeper_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (isset($listing->image_path) && Storage::disk('public')->exists($listing->image_path)) {
            Storage::disk('public')->delete($listing->image_path);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }
}