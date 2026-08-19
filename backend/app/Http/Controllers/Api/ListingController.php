<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::with('shop');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = '%' . trim($request->search) . '%';
            
            // Use ILIKE for case-insensitive search in PostgreSQL across title, description, and shop name
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'ILIKE', $searchTerm)
                  ->orWhere('description', 'ILIKE', $searchTerm)
                  ->orWhereHas('shop', function($shopQuery) use ($searchTerm) {
                      $shopQuery->where('shop_name', 'ILIKE', $searchTerm);
                  });
            });
        }

        $listings = $query->latest()->paginate(12);

        return response()->json([
            'status' => 'success',
            'data' => $listings,
        ]);
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
            $data['image_data'] = DB::raw("'" . '\x' . bin2hex($rawBinary) . "'");
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

        $pdo = DB::connection()->getPdo();
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
            $data['image_data'] = DB::raw("'" . '\x' . bin2hex($rawBinary) . "'");
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
        if (auth()->id() !== $listing->shop->shopkeeper_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }
}