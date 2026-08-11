<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // <--- ဒီစာကြောင်း မပါလို့ Error တက်နေခြင်းဖြစ်သည်
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // စာတိုများ ယူထုတ်ခြင်း
    public function getMessages($receiverId)
    {
        $authId = auth()->id();

        $messages = Message::where(function ($query) use ($authId, $receiverId) {
            $query->where('sender_id', $authId)
                  ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($authId, $receiverId) {
            $query->where('sender_id', $receiverId)
                  ->where('receiver_id', $authId);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    // စာတို အသစ်ပို့ခြင်း
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json($message, 201);
    }
}