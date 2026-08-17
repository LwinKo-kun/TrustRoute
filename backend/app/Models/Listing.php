<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'title',
        'description',
        'price',
        'stock',
        'image_data',
        'image_mime_type',
    ];

    // Hide raw binary from all JSON API responses
    protected $hidden = [
        'image_data',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function comments()
    {
        return $this->hasMany(ListingComment::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}