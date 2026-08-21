<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
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

    public function lockForOrder(User $customer, float $amount, $order)
    {
        return DB::transaction(function () use ($customer, $amount, $order) {
            $wallet = $customer->wallet()->lockForUpdate()->first();

            if ($wallet->balance < $amount) {
                throw new Exception('Insufficient wallet balance to complete this order. Please top up your account.');
            }

            $wallet->balance -= $amount;
            $wallet->locked_balance += $amount;
            $wallet->save();

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

    public function commitOrderFunds(User $customer, User $shopkeeper, float $amount, $order)
    {
        return DB::transaction(function () use ($customer, $shopkeeper, $amount, $order) {
            $customerWallet = $customer->wallet()->lockForUpdate()->first();
            $shopkeeperWallet = $shopkeeper->wallet()->lockForUpdate()->first();

            if ($customerWallet->locked_balance < $amount) {
                throw new Exception('CRITICAL ERROR: Escrow mismatch. Insufficient locked funds.');
            }

            $customerWallet->locked_balance -= $amount;
            $customerWallet->save();

            $customerWallet->transactions()->create([
                'type' => 'commit',
                'amount' => $amount, 
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed',
                'description' => 'Escrow released for completed Order #' . $order->id,
            ]);

            $shopkeeperWallet->balance += $amount;
            $shopkeeperWallet->save();

            $shopkeeperWallet->transactions()->create([
                'type' => 'deposit', 
                'amount' => $amount,
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed',
                'description' => 'Payment received for Order #' . $order->id,
            ]);
            
            return true;
        });
    }

    public function rollbackOrderFunds(User $customer, float $amount, $order)
    {
        return DB::transaction(function () use ($customer, $amount, $order) {
            $wallet = $customer->wallet()->lockForUpdate()->first();

            if ($wallet->locked_balance < $amount) {
                throw new Exception('CRITICAL ERROR: Cannot refund. Insufficient locked funds.');
            }

            // Move funds from locked escrow BACK to available balance
            $wallet->locked_balance -= $amount;
            $wallet->balance += $amount;
            $wallet->save();

            return $wallet->transactions()->create([
                'type' => 'refund',
                'amount' => $amount,
                'reference_type' => get_class($order),
                'reference_id' => $order->id,
                'status' => 'completed', // Marked as completed instantly since Admin has already approved it
                'description' => 'Escrow refunded for cancelled Order #' . $order->id,
            ]);
        });
    }
}