<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public shop routes
Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);

// Public listing routes
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);
Route::get('/listings/{listing}/image', [ListingController::class, 'image']);

// Public review route
Route::get('/reviews', [ReviewController::class, 'index']);

// Authenticated routes via Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // Retrieve authenticated user
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user()
        ]);
    });

    // Shop Management Routes
    Route::get('/my-shop', [ShopController::class, 'myShop']);
    Route::post('/shops', [ShopController::class, 'store']);
    Route::put('/shops/{shop}', [ShopController::class, 'update']);
    Route::delete('/shops/{shop}', [ShopController::class, 'destroy']);

    // Listing Management Routes
    Route::get('/my-shop/listings', [ListingController::class, 'shopListings']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{listing}', [ListingController::class, 'update']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);

    // Order Management Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Review Management Routes (Authenticated)
    Route::post('/reviews', [ReviewController::class, 'store']);
});