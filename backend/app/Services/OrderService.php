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

            ]);

            foreach ($validatedItems as $item) {
                $order->items()->create($item);
            }

main
            return $order->load('items.listing', 'shop', 'customer');
        });
    }
}