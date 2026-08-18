<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'online_status',
        'acc_status',
        'public_keys',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The "booted" method of the model.
     * Automatically creates a wallet when a new user registers.
     */
    protected static function booted()
    {
        static::created(function ($user) {
            $user->wallet()->create([
                'balance' => 0.00,
                'locked_balance' => 0.00,
            ]);
        });
    }

    /**
     * A user (shopkeeper) has one shop.
     */
    public function shop()
    {
        return $this->hasOne(Shop::class, 'shopkeeper_id');
    }

    /**
     * A user has one wallet for in-app financial transactions.
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }
}