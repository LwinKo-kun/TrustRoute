<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();

        // Ensure user is logged in and owns a shop
        if (!$user || !$user->shop) {
            return false;
        }

        // Allow listing creation for both 'active' and 'pending' shops (unless explicitly suspended)
        return $user->shop->status !== 'suspended';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|gt:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }

    /**
     * Custom error messages for friendly feedback.
     */
    public function messages(): array
    {
        return [
            'price.gt'    => 'The product price must be greater than $0.00.',
            'stock.min'   => 'Stock quantity cannot be negative.',
            'image.image' => 'The uploaded file must be a valid image.',
            'image.max'   => 'Image size must not exceed 5MB.',
        ];
    }
}