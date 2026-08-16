<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Listing;
use App\Models\Shop;
use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
    public function createOrder(int $customerId, array $data): Order
    {
        return DB::transaction(function () use ($customerId, $data) {
            $shopId = $data['shop_id'];
            $shop = Shop::findOrFail($shopId); // Get shop to find the shopkeeper_id
            $totalAmount = 0;
            $validatedItems = [];

            foreach ($data['items'] as $item) {
                $listing = Listing::lockForUpdate()->findOrFail($item['listing_id']);

                if ($listing->shop_id != $shopId) {
                    throw new Exception("All items in an order must belong to the same shop.");
                }
                if ($listing->stock < $item['quantity']) {
                    throw new Exception("Insufficient stock for item: {$listing->title}");
                }

                $listing->decrement('stock', $item['quantity']);
                $subtotal = $listing->price * $item['quantity'];
                $totalAmount += $subtotal;

                $validatedItems[] = [
                    'listing_id' => $listing->id,
                    'quantity' => $item['quantity'],
                    'price_at_purchase' => $listing->price,
                ];
            }

            $order = Order::create([
                'customer_id' => $customerId,
                'shop_id' => $shopId,
                'delivery_id' => null,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'escrow_tx_hash' => null,
            ]);

            foreach ($validatedItems as $item) {
                $order->items()->create($item);
            }

            // AUTO-INJECT CHAT MESSAGE
            Message::create([
                'sender_id' => $customerId,
                'receiver_id' => $shop->shopkeeper_id,
                'message' => 'I would like to place an order.',
                'type' => 'order_request',
                'order_id' => $order->id,
                'listing_id' => $validatedItems[0]['listing_id'] // Attach the primary product
            ]);

            // NOTE: Here you will later dispatch your Queue Job for the timeout
            // CheckPendingOrderTimeout::dispatch($order->id)->delay(now()->addHours(2));

            return $order->load('items.listing', 'shop', 'customer');
        });
    }
}