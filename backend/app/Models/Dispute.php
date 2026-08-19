<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'raised_by', 'accused_user_id', 'reason', 'status', 'admin_notes'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }

    public function initiator() {
        return $this->belongsTo(User::class, 'raised_by');
    }

    public function accused() {
        return $this->belongsTo(User::class, 'accused_user_id');
    }
}