<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Update Profile Information & Password
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => 'nullable|min:6',
        ]);

        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'Current password is incorrect.'], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }

    // Get User Addresses
    public function getAddresses(Request $request)
    {
        $addresses = $request->user()->addresses()->latest()->get();
        return response()->json(['status' => 'success', 'data' => $addresses]);
    }

    // Store New Address
    public function storeAddress(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'street_address' => 'required|string',
            'city' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:50',
            'is_default' => 'boolean',
        ]);

        if (!empty($validated['is_default']) && $validated['is_default']) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Address added successfully.',
            'data' => $address,
        ], 201);
    }

    // Delete Address
    public function destroyAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Address deleted successfully.',
        ]);
    }
}