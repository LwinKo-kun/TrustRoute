<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopkeeper_id',
        'shop_name',
        'slug',
        'status',
    ];

    /**
     * A shop belongs to a user (shopkeeper).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'shopkeeper_id');
    }
}