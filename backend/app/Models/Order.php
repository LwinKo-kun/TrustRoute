<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\OrderApproval;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'shop_id',
        'delivery_id',
        'status',
        'escrow_tx_hash',
        'total_amount',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delivery_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Approvals relationship (shopkeeper & admin)
    public function approvals(): HasMany
    {
        return $this->hasMany(OrderApproval::class);
    }

}
