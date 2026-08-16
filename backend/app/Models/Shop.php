<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopkeeper_id',
        'shop_name',
        'slug',
        'status',
        'description',
        'kpay_number',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shopkeeper_id');
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }
}