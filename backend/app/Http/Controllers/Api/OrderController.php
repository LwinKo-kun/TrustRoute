<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
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
                'message' => 'Order created successfully. Pending consensus verification.',
                'data' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        if ($user->role === 'admin') {
            $orders = Order::with('shop', 'customer', 'items.listing')->paginate(15);
        } else {
            $orders = Order::where('customer_id', $user->id)->with('shop', 'items.listing')->paginate(15);
        }
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        $user = auth()->user();
        if ($user->id !== $order->customer_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['data' => $order->load('shop', 'items.listing', 'customer')]);
    }
}