<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\Order;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $disputes = Dispute::with(['order.shop', 'initiator', 'accused'])->latest()->get();
        } else {
            $disputes = Dispute::with(['order.shop', 'initiator', 'accused'])
                ->where('raised_by', $user->id)
                ->orWhere('accused_user_id', $user->id)
                ->latest()->get();
        }

        return response()->json(['data' => $disputes]);
    }

    public function store(Request $request, Order $order)
    {
        $request->validate([
            'reason' => 'required|string|min:10', // DB uses a single 'reason' text field
        ]);

        $isCustomer = $order->customer_id === $request->user()->id;
        $isShopkeeper = $order->shop->shopkeeper_id === $request->user()->id;

        if (!$isCustomer && !$isShopkeeper) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $dispute = Dispute::create([
            'order_id' => $order->id,
            'raised_by' => $request->user()->id,
            'accused_user_id' => $isCustomer ? $order->shop->shopkeeper_id : $order->customer_id,
            'reason' => $request->reason,
            'status' => 'open'
        ]);

        $order->update(['status' => 'disputed']);

        return response()->json(['message' => 'Dispute opened successfully.', 'data' => $dispute]);
    }

    public function resolve(Request $request, Dispute $dispute)
    {
        // Allowed statuses from your DB constraint: resolved_refund, resolved_penalize
        $request->validate([
            'resolution' => 'required|in:resolved_refund,resolved_penalize',
            'admin_notes' => 'required|string'
        ]);

        $dispute->update([
            'status' => $request->resolution,
            'admin_notes' => $request->admin_notes
        ]);

        // If refunded, cancel the order to trigger escrow return. If penalized (seller wins), complete the order to release funds.
        $newOrderStatus = $request->resolution === 'resolved_refund' ? 'cancelled' : 'completed';
        $dispute->order->update(['status' => $newOrderStatus]);

        return response()->json(['message' => 'Dispute resolved successfully.']);
    }
}