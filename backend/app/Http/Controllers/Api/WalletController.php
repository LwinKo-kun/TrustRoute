<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function getBalance(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet;

        $incomingEscrow = 0;
        if ($user->role === 'shopkeeper') {
            $shopIds = \App\Models\Shop::where('shopkeeper_id', $user->id)->pluck('id');
            
            $incomingEscrow = \App\Models\Order::whereIn('shop_id', $shopIds)
                ->whereIn('status', ['pending', 'processing', 'dispatched'])
                ->sum('total_amount');
        }

        return response()->json([
            'data' => [
                'balance' => $wallet->balance,
                'locked_balance' => $wallet->locked_balance, 
                'incoming_escrow' => (float) $incomingEscrow, 
            ]
        ]);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1'
        ]);

        try {
            $this->walletService->deposit($request->user(), $request->amount, 'Wallet Top Up');
            return response()->json([
                'message' => 'Successfully deposited funds into your wallet.',
                'data' => $request->user()->wallet->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function transactions(Request $request)
    {
        $transactions = $request->user()->wallet->transactions()->latest()->limit(50)->get();
        return response()->json([
            'data' => $transactions
        ]);
    }
}