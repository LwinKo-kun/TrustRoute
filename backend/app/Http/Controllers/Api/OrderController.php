<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Shop;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(auth()->id(), $request->validated());
            return response()->json([
                'message' => 'Order created successfully.',
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
                // Admins see everything
                break;
                
            case 'shopkeeper':
                // Shopkeepers only see orders placed at their specific shops
                $shopIds = Shop::where('shopkeeper_id', $user->id)->pluck('id');
                $query->whereIn('shop_id', $shopIds);
                break;

            case 'delivery':
                // Delivery agents see orders assigned to them, OR orders waiting for a driver
                $query->where(function ($q) use ($user) {
                    $q->where('delivery_id', $user->id)
                      ->orWhere('status', 'pending'); // Packages ready to be picked up
                });
                break;

            case 'customer':
            default:
                // Customers only see their own purchases
                $query->where('customer_id', $user->id);
                break;
        }

        return response()->json($query->paginate(15));
    }

    public function show(Order $order)
    {
        $user = auth()->user();
        $isAuthorized = false;

        // Check if the user has permission to view this specific order
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

        // 1. Update the order status
        $order->update([
            'status' => $request->status
        ]);

        // 2. Auto-send KPay instructions if order is accepted (processing)
        if ($request->status === 'processing') {
            $shop = Shop::find($order->shop_id);
            $kpayNumber = $shop->kpay_number ?? 'Not provided. Please ask the seller for their KPay number.';

            \App\Models\Message::create([
                'sender_id' => $user->id, 
                'receiver_id' => $order->customer_id, 
                'message' => "Order accepted! Please transfer the total amount to my KPay number: {$kpayNumber}. After transferring, please upload a screenshot of the transaction here.",
                'type' => 'system_alert', 
                'order_id' => $order->id,
            ]);
        }

        // 3. Auto-send Verification confirmation (paid)
        if ($request->status === 'paid') {
            \App\Models\Message::create([
                'sender_id' => $user->id, 
                'receiver_id' => $order->customer_id, 
                'message' => 'Payment verified successfully! We are now preparing your order for dispatch.',
                'type' => 'system_alert', 
                'order_id' => $order->id,
            ]);
        }

        // 4. Handle Cancellation / Declining (restore stock)
        if ($request->status === 'cancelled') {
            $order->load('items.listing');
            foreach ($order->items as $item) {
                if ($item->listing) {
                    $item->listing->increment('stock', $item->quantity);
                }
            }

            \App\Models\Message::create([
                'sender_id' => $user->id, 
                'receiver_id' => $order->customer_id, 
                'message' => 'This order has been declined and cancelled by the shopkeeper.',
                'type' => 'system_alert', 
                'order_id' => $order->id,
            ]);
        }

        return response()->json([
            'message' => 'Order status updated successfully.',
            'data' => $order
        ]);
    }
}