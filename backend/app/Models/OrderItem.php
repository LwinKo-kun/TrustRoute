<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'listing_id',
        'quantity',
        'price_at_purchase',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}