<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $shop = auth()->user()->shop;
        return $shop && $shop->status === 'active';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|gt:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ];
    }
}