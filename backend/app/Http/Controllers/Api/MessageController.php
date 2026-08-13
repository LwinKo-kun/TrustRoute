<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // မိမိနှင့် စကားပြောဖူးသူများ စာရင်းယူခြင်း (အသစ်ဖြည့်ထားသည်)
    public function getConversations()
    {
        $authId = auth()->id();

        // မိမိထံ စာပို့ထားသူ သို့မဟုတ် မိမိက စာပို့ထားသူများ၏ ID များကို ရှာမည်
        $senderIds = Message::where('receiver_id', $authId)->pluck('sender_id');
        $receiverIds = Message::where('sender_id', $authId)->pluck('receiver_id');

        $partnerIds = $senderIds->merge($receiverIds)
                                ->unique()
                                ->reject(fn($id) => $id == $authId);

        $users = User::whereIn('id', $partnerIds)->get(['id', 'name', 'email']);

        return response()->json($users);
    }

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