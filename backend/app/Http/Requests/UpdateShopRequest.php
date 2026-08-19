<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        $shop = $this->route('shop');
        $user = $this->user();

        if (!$user) {
            return false;
        }

        if ($user->role === 'admin') {
            return true;
        }

        return $shop && $shop->shopkeeper_id === $user->id;
    }

    public function rules(): array
    {
        $shop = $this->route('shop');

        return [
            'shop_name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('shops', 'slug')->ignore($shop->id),
            ],
            'status' => ['sometimes', 'string', 'in:active,suspended,pending'],
            'description' => ['nullable', 'string'], // <-- Added this rule
        ];
    }
}