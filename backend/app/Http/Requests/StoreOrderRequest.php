<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shop_id' => 'required|exists:shops,id',
            'items' => 'required|array|min:1',
            'items.*.listing_id' => 'required|exists:listings,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }
}