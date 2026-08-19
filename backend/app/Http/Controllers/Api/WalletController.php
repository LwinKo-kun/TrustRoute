<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService = null)
    {
        $this->walletService = $walletService;
    }

    public function getBalance(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet;

        $lockedBalance = 0;
        $incomingEscrow = 0;

        // Calculate locked escrow for customers based on active orders
        if ($user->role === 'customer') {
            $lockedBalance = \App\Models\Order::where('customer_id', $user->id)
                ->whereIn('status', ['pending', 'processing', 'dispatched'])
                ->sum('total_amount');
        }

        // Calculate incoming escrow for shopkeepers based on active store orders
        if ($user->role === 'shopkeeper') {
            $shopIds = \App\Models\Shop::where('shopkeeper_id', $user->id)->pluck('id');
            
            $incomingEscrow = \App\Models\Order::whereIn('shop_id', $shopIds)
                ->whereIn('status', ['pending', 'processing', 'dispatched'])
                ->sum('total_amount');
        }

        return response()->json([
            'data' => [
                'balance' => (float) ($wallet->balance ?? 0),
                'locked_balance' => (float) $lockedBalance, 
                'incoming_escrow' => (float) $incomingEscrow, 
            ]
        ]);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'reference_note' => 'nullable|string|max:255',
            'screenshot' => 'nullable|image|max:5120', // Max 5MB image verification
        ]);

        $user = $request->user();
        $screenshotPath = null;

        if ($request->hasFile('screenshot')) {
            $screenshotPath = $request->file('screenshot')->store('wallet-screenshots', 'public');
        }
        
        // Create a pending transaction with screenshot path for admin verification
        $transaction = $user->wallet->transactions()->create([
            'amount' => $request->amount,
            'type' => 'deposit',
            'status' => 'pending',
            'description' => $request->reference_note ?: 'Deposit top-up via KPay/Bank',
            'screenshot_path' => $screenshotPath,
        ]);

        return response()->json([
            'message' => 'Deposit request and proof submitted successfully! Waiting for admin verification.',
            'data' => $transaction
        ], 201);
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'account_details' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if ($wallet->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient available balance.'], 422);
        }

        // Create pending withdrawal request
        $transaction = $wallet->transactions()->create([
            'amount' => $request->amount,
            'type' => 'withdrawal',
            'status' => 'pending',
            'description' => 'Payout to: ' . $request->account_details,
        ]);

        return response()->json([
            'message' => 'Withdrawal request submitted successfully! Waiting for admin approval.',
            'data' => $transaction
        ], 201);
    }

    public function pendingTransactions(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pending = \App\Models\WalletTransaction::with('wallet.user')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json(['data' => $pending]);
    }

    public function verifyTransaction(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:completed,rejected'
        ]);

        $tx = \App\Models\WalletTransaction::findOrFail($id);
        if ($tx->status !== 'pending') {
            return response()->json(['message' => 'Transaction is already processed.'], 422);
        }

        $tx->status = $request->status;
        $tx->save();

        $wallet = $tx->wallet;

        if ($request->status === 'completed') {
            if ($tx->type === 'deposit') {
                $wallet->balance += $tx->amount;
                $wallet->save();
            } elseif ($tx->type === 'withdrawal') {
                if ($wallet->balance < $tx->amount) {
                    return response()->json(['message' => 'User has insufficient balance to complete payout.'], 422);
                }
                $wallet->balance -= $tx->amount;
                $wallet->save();
            }
        }

        return response()->json(['message' => 'Transaction updated successfully.']);
    }

    public function transactions(Request $request)
    {
        $transactions = $request->user()->wallet->transactions()->latest()->limit(50)->get();
        return response()->json([
            'data' => $transactions
        ]);
    }
}