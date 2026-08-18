<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
    /**
     * Top up the user's wallet (Simulated exchange of real money to in-app money)
     */
    public function deposit(User $user, float $amount, $description = 'Top Up')
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $wallet = $user->wallet()->lockForUpdate()->first();

            $wallet->balance += $amount;
            $wallet->save();

            return $wallet->transactions()->create([
                'type' => 'deposit',
                'amount' => $amount,
                'status' => 'completed',
                'description' => $description,
            ]);
        });
    }

    /**
     * 2PC PHASE 1: Lock Funds in Escrow
     * Deducts from available balance and moves to locked balance.
     */
    public function lockForOrder(User $customer, float $amount, $order)
    {
        return DB::transaction(function () use ($customer, $amount, $order) {
            $wallet = $customer->wallet()->lockForUpdate()->first();

            if ($wallet->balance < $amount) {
                throw new Exception('Insufficient wallet balance to complete this order. Please top up your account.');
            }

            // Move funds to escrow
            $wallet->balance -= $amount;
            $wallet->locked_balance += $amount;
            $wallet->save();

            // Record the lock
            return $wallet->transactions()->create([
                'type' => 'lock',
                'amount' => $amount,
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed',
                'description' => 'Funds locked in escrow for Order #' . $order->id,
            ]);
        });
    }

    /**
     * 2PC PHASE 2 (SUCCESS): Commit Escrow to Shopkeeper
     * Deducts from customer's locked balance, adds to shopkeeper's available balance.
     */
    public function commitOrderFunds(User $customer, User $shopkeeper, float $amount, $order)
    {
        return DB::transaction(function () use ($customer, $shopkeeper, $amount, $order) {
            $customerWallet = $customer->wallet()->lockForUpdate()->first();
            $shopkeeperWallet = $shopkeeper->wallet()->lockForUpdate()->first();

            if ($customerWallet->locked_balance < $amount) {
                throw new Exception('CRITICAL ERROR: Escrow mismatch. Insufficient locked funds.');
            }

            // 1. Remove from Customer Escrow
            $customerWallet->locked_balance -= $amount;
            $customerWallet->save();

            $customerWallet->transactions()->create([
                'type' => 'commit',
                'amount' => -$amount, // Negative indicates money leaving the ecosystem completely from their POV
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed',
                'description' => 'Escrow released for completed Order #' . $order->id,
            ]);

            // 2. Add to Shopkeeper Balance
            $shopkeeperWallet->balance += $amount;
            $shopkeeperWallet->save();

            $shopkeeperWallet->transactions()->create([
                'type' => 'deposit', // It's an incoming deposit for the shopkeeper
                'amount' => $amount,
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed',
                'description' => 'Payment received for Order #' . $order->id,
            ]);
            
            return true;
        });
    }

    /**
     * 2PC PHASE 2 (ROLLBACK): Refund Escrow to Customer
     * Moves funds from locked_balance back to available balance.
     */
    public function rollbackOrderFunds(User $customer, float $amount, $order)
    {
        return DB::transaction(function () use ($customer, $amount, $order) {
            $wallet = $customer->wallet()->lockForUpdate()->first();

            if ($wallet->locked_balance < $amount) {
                throw new Exception('CRITICAL ERROR: Cannot refund. Insufficient locked funds.');
            }

            // Restore available balance
            $wallet->locked_balance -= $amount;
            $wallet->balance += $amount;
            $wallet->save();

            return $wallet->transactions()->create([
                'type' => 'refund',
                'amount' => $amount,
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed',
                'description' => 'Escrow refunded for cancelled/declined Order #' . $order->id,
            ]);
        });
    }
}