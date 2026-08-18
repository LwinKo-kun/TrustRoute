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
            $file = $request->file('image');
            $rawBinary = file_get_contents($file->getRealPath());
            $data['image_data'] = '\x' . bin2hex($rawBinary);
            $data['image_mime_type'] = $file->getMimeType();
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

    public function image($listing)
    {
        $listingId = $listing instanceof Listing ? $listing->id : (int) $listing;

        $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();
        $stmt = $pdo->prepare('SELECT image_data, image_mime_type FROM listings WHERE id = :id LIMIT 1');
        $stmt->bindValue(':id', $listingId, \PDO::PARAM_INT);
        $stmt->execute();

        $stmt->bindColumn('image_data', $imageData, \PDO::PARAM_LOB);
        $stmt->bindColumn('image_mime_type', $mimeType, \PDO::PARAM_STR);

        if (!$stmt->fetch(\PDO::FETCH_BOUND) || empty($imageData)) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        if (is_resource($imageData)) {
            $imageData = stream_get_contents($imageData);
        }

        if (is_string($imageData) && str_starts_with($imageData, '\\x')) {
            $imageData = hex2bin(substr($imageData, 2));
        }

        $mime = $mimeType ?: 'image/jpeg';

        if (ob_get_level()) {
            ob_end_clean();
        }

        return response($imageData, 200, [
            'Content-Type' => $mime,
            'Content-Length' => strlen($imageData),
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $rawBinary = file_get_contents($file->getRealPath());
            $data['image_data'] = '\x' . bin2hex($rawBinary);
            $data['image_mime_type'] = $file->getMimeType();
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