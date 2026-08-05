<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShopRequest;
use App\Http\Requests\UpdateShopRequest;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShopController extends Controller
{
    /**
     * Display a listing of shops.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Shop::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $shops = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $shops,
        ]);
    }

    /**
     * Store a newly created shop.
     */
    public function store(StoreShopRequest $request): JsonResponse
    {
        $user = $request->user();

        // Enforce rule: One shopkeeper may own only one shop using shopkeeper_id
        if (Shop::where('shopkeeper_id', $user->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Shopkeeper already owns a shop. Only one shop is allowed per user.',
            ], 422);
        }

        $validated = $request->validated();
        $validated['shopkeeper_id'] = $user->id;
        
        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $shop = Shop::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Shop created successfully',
            'data' => $shop->load('user'),
        ], 201);
    }

    /**
     * Display the specified shop.
     */
    public function show(Shop $shop): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $shop->load('user'),
        ]);
    }

    /**
     * Get the authenticated user's shop.
     */
    public function myShop(Request $request): JsonResponse
    {
        $shop = Shop::with('user')->where('shopkeeper_id', $request->user()->id)->first();

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'message' => 'No shop found for the authenticated user.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $shop,
        ]);
    }

    /**
     * Update the specified shop.
     */
    public function update(UpdateShopRequest $request, Shop $shop): JsonResponse
    {
        $user = $request->user();

        // Enforce rule: Suspended shops cannot be modified except by admins
        if ($shop->status === 'suspended' && $user->role !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Suspended shops cannot be modified.',
            ], 403);
        }

        $validated = $request->validated();
        if (isset($validated['status']) && $user->role !== 'admin') {
            unset($validated['status']);
        }

        $shop->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Shop updated successfully',
            'data' => $shop->fresh()->load('user'),
        ]);
    }

    /**
     * Remove the specified shop.
     */
    public function destroy(Request $request, Shop $shop): JsonResponse
    {
        $user = $request->user();

        // Only owner or admin can delete using shopkeeper_id
        if ($user->role !== 'admin' && $shop->shopkeeper_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized action.',
            ], 403);
        }

        if ($shop->status === 'suspended' && $user->role !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Suspended shops cannot be deleted.',
            ], 403);
        }

        $shop->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Shop deleted successfully',
        ]);
    }
}