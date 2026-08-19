<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Shop;
use App\Models\User;
use App\Services\OrderService;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderController extends Controller
{
    protected $orderService;
    protected $walletService;

    public function __construct(OrderService $orderService, WalletService $walletService)
    {
        $this->orderService = $orderService;
        $this->walletService = $walletService;
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(auth()->id(), $request->validated());
            return response()->json([
                'message' => 'Order created successfully. Funds locked in Escrow.',
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Order::with('shop', 'customer', 'items.listing')->latest();

        switch ($user->role) {
            case 'admin':
                break;
                
            case 'shopkeeper':
                $shopIds = Shop::where('shopkeeper_id', $user->id)->pluck('id');
                $query->whereIn('shop_id', $shopIds);
                break;

            case 'delivery':
                $query->where(function ($q) use ($user) {
                    $q->where('delivery_id', $user->id)
                      ->orWhere('status', 'pending');
                });
                break;

            case 'customer':
            default:
                $query->where('customer_id', $user->id);
                break;
        }

        return response()->json($query->paginate(15));
    }

    public function show(Order $order)
    {
        $user = auth()->user();
        $isAuthorized = false;

        if ($user->role === 'admin') {
            $isAuthorized = true;
        } elseif ($user->role === 'customer' && $order->customer_id === $user->id) {
            $isAuthorized = true;
        } elseif ($user->role === 'delivery' && ($order->delivery_id === $user->id || $order->status === 'pending')) {
            $isAuthorized = true;
        } elseif ($user->role === 'shopkeeper') {
            $shopIds = Shop::where('shopkeeper_id', $user->id)->pluck('id')->toArray();
            if (in_array($order->shop_id, $shopIds)) {
                $isAuthorized = true;
            }
        }

        if (!$isAuthorized) {
            return response()->json(['message' => 'Unauthorized to view this order.'], 403);
        }

        return response()->json(['data' => $order->load('shop', 'items.listing', 'customer')]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:processing,paid,dispatched,completed,cancelled'
        ]);

        $user = auth()->user();
        $isCustomer = $order->customer_id === $user->id;
        $isShopkeeper = $order->shop->shopkeeper_id === $user->id;

        // SECURITY 1: Verify the user is authorized to update this specific order
        if (!$isCustomer && !$isShopkeeper && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized to update this order.'], 403);
        }

        // SECURITY 2: Prevent state-machine manipulation (cannot modify finalized orders)
        if (in_array($order->status, ['completed', 'cancelled'])) {
            return response()->json(['message' => 'Order is already finalized and cannot be modified.'], 422);
        }

        try {
            return DB::transaction(function () use ($request, $order, $user, $isCustomer) {
                $originalStatus = $order->status;
                
                // 2PC PHASE 2: ROLLBACK (Order Cancelled/Declined)
                if ($request->status === 'cancelled' && $originalStatus !== 'cancelled') {
                    // Restore Stock
                    $order->load('items.listing');
                    foreach ($order->items as $item) {
                        if ($item->listing) {
                            $item->listing->increment('stock', $item->quantity);
                        }
                    }

                    // Refund the customer's wallet
                    $customer = User::findOrFail($order->customer_id);
                    $this->walletService->rollbackOrderFunds($customer, $order->total_amount, $order);

                    \App\Models\Message::create([
                        'sender_id' => $user->id, 
                        'receiver_id' => $order->customer_id, 
                        'message' => 'This order has been declined/cancelled. Your Escrow funds have been successfully refunded to your wallet.',
                        'type' => 'system_alert', 
                        'order_id' => $order->id,
                    ]);
                }

                // 2PC PHASE 2: COMMIT (Order Completed)
                if ($request->status === 'completed' && $originalStatus !== 'completed') {
                    // SECURITY 3: Only the buyer (or admin) can confirm delivery to release funds
                    if (!$isCustomer && $user->role !== 'admin') {
                        throw new Exception("Only the buyer can confirm delivery to release funds.");
                    }

                    $customer = User::findOrFail($order->customer_id);
                    $shopkeeper = User::findOrFail($order->shop->shopkeeper_id);

                    // Transfer locked funds from Customer to Shopkeeper
                    $this->walletService->commitOrderFunds($customer, $shopkeeper, $order->total_amount, $order);

                    \App\Models\Message::create([
                        'sender_id' => $user->id, 
                        'receiver_id' => $order->customer_id, 
                        'message' => 'Order completed! The Escrow funds have been officially released to the shopkeeper.',
                        'type' => 'system_alert', 
                        'order_id' => $order->id,
                    ]);
                }

                // Status: Processing (Accepted)
                if ($request->status === 'processing' && $originalStatus !== 'processing') {
                    \App\Models\Message::create([
                        'sender_id' => $user->id, 
                        'receiver_id' => $order->customer_id, 
                        'message' => "Order accepted! Your payment is securely held in our in-app Escrow. We are preparing your items for dispatch.",
                        'type' => 'system_alert', 
                        'order_id' => $order->id,
                    ]);
                }

                // Status: Dispatched
                if ($request->status === 'dispatched' && $originalStatus !== 'dispatched') {
                    \App\Models\Message::create([
                        'sender_id' => $user->id, 
                        'receiver_id' => $order->customer_id, 
                        'message' => 'Your order has been dispatched and is on its way to you!',
                        'type' => 'system_alert', 
                        'order_id' => $order->id,
                    ]);
                }

                // Finally, update the order status
                $order->update([
                    'status' => $request->status
                ]);

                return response()->json([
                    'message' => 'Order status updated successfully.',
                    'data' => $order->fresh()
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}