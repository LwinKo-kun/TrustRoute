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
        $query = Listing::with('shop');

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        return response()->json($query->paginate(12));
    }

    public function shopListings()
    {
        $shop = auth()->user()->shop;
        if (!$shop) {
            return response()->json(['message' => 'Shop not found.'], 404);
        }

        return response()->json($shop->listings()->paginate(12));
    }

    public function store(StoreListingRequest $request)
    {
        $shop = auth()->user()->shop;

        $data = $request->validated();
        $data['shop_id'] = $shop->id;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $data['image_data'] = '\\x' . bin2hex(file_get_contents($file->getRealPath()));
            $data['image_mime_type'] = $file->getMimeType();
            unset($data['image']);
        }

        $listing = Listing::create($data);

        return response()->json(['message' => 'Listing created successfully', 'data' => $listing], 201);
    }

    public function show(Listing $listing)
    {
        // reviews နှင့် review ရေးသားသူ user အချက်အလက်များကို ပါဝင်အောင် load လုပ်ထားသည်
        return response()->json(['data' => $listing->load(['shop', 'reviews.user'])]);
    }

    public function image(Listing $listing)
    {
        if (!$listing->image_data) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        $imageData = $listing->image_data;
        
        if (is_resource($imageData)) {
            $imageData = stream_get_contents($imageData);
        }

        if (str_starts_with($imageData, '\\x')) {
            $imageData = hex2bin(substr($imageData, 2));
        }

        return response($imageData, 200)
            ->header('Content-Type', $listing->image_mime_type ?? 'image/jpeg')
            ->header('Cache-Control', 'public, max-age=86400');
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $data['image_data'] = '\\x' . bin2hex(file_get_contents($file->getRealPath()));
            $data['image_mime_type'] = $file->getMimeType();
            unset($data['image']);
        }

        $listing->update($data);

        return response()->json(['message' => 'Listing updated successfully', 'data' => $listing]);
    }

    public function destroy(Listing $listing)
    {
        if (auth()->id() !== $listing->shop->shopkeeper_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }
}