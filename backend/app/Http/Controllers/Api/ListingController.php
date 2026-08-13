<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Models\Listing;
use Illuminate\Http\Request;

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

        // Store image as PostgreSQL Bytea Hex Stream
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $data['image_data'] = '\\x' . bin2hex(file_get_contents($file->getRealPath()));
            $data['image_mime_type'] = $file->getMimeType();
            unset($data['image']);
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
        if (!empty($listing->image_data)) {
            $imageData = $listing->image_data;

            if (is_resource($imageData)) {
                $imageData = stream_get_contents($imageData);
            }

            if (is_string($imageData) && str_starts_with($imageData, '\\x')) {
                $imageData = hex2bin(substr($imageData, 2));
            } elseif (is_string($imageData) && str_starts_with($imageData, 'data:image')) {
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

        // Update image bytea and mime type
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $data['image_data'] = '\\x' . bin2hex(file_get_contents($file->getRealPath()));
            $data['image_mime_type'] = $file->getMimeType();
            unset($data['image']);
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

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }
}