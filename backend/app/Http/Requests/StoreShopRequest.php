<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only authenticated users with role 'shopkeeper' can create a shop
        $user = $this->user();
        return $user && $user->role === 'shopkeeper';
    }

    public function rules(): array
    {
        return [
            'shop_name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:shops,slug'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', 'in:active,suspended,pending'],
        ];
    }
}