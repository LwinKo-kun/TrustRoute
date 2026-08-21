<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DisputeController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\WalletController;
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

// Public review routes
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/listings/{listing}/reviews', [ReviewController::class, 'index']);

// Authenticated routes via Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ]);
    });

    // --- WALLET ROUTES ---
    Route::get('/wallet', [WalletController::class, 'getBalance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']); // Added withdrawal request route
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);

    // --- ADMIN WALLET VERIFICATION ROUTES ---
    Route::get('/admin/wallet-pending', [WalletController::class, 'pendingTransactions']);
    Route::patch('/admin/wallet-transactions/{id}/verify', [WalletController::class, 'verifyTransaction']);

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
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders/{order}/approve-cancellation', [OrderController::class, 'approveCancellation']);

    // Review Management Routes
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Message Management Routes
    Route::get('/conversations', [MessageController::class, 'getConversations']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']); // MUST be above {receiverId}
    Route::get('/messages/{receiverId}', [MessageController::class, 'getMessages']);
    Route::post('/messages', [MessageController::class, 'sendMessage']);

    // Dispute Management Routes
    Route::get('/disputes', [DisputeController::class, 'index']);
    Route::post('/orders/{order}/disputes', [DisputeController::class, 'store']);
    Route::patch('/disputes/{dispute}/resolve', [DisputeController::class, 'resolve']);

    // Profile & Address Management Routes
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::get('/addresses', [ProfileController::class, 'getAddresses']);
    Route::post('/addresses', [ProfileController::class, 'storeAddress']);
    Route::delete('/addresses/{id}', [ProfileController::class, 'destroyAddress']);
});