<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function getConversations()
    {
        // (Keep your existing code for this method)
        $authId = auth()->id();
        $senderIds = Message::where('receiver_id', $authId)->pluck('sender_id');
        $receiverIds = Message::where('sender_id', $authId)->pluck('receiver_id');
        $partnerIds = $senderIds->merge($receiverIds)->unique()->reject(fn($id) => $id == $authId);
        $users = User::whereIn('id', $partnerIds)->get(['id', 'name', 'email']);
        return response()->json($users);
    }

    public function getMessages($receiverId)
    {
        $authId = auth()->id();

        // Added with('order', 'listing') to eager load the metadata for the chat cards
            $messages = Message::with(['order.items.listing', 'listing'])            ->where(function ($query) use ($authId, $receiverId) {
                $query->where('sender_id', $authId)->where('receiver_id', $receiverId);
            })->orWhere(function ($query) use ($authId, $receiverId) {
                $query->where('sender_id', $receiverId)->where('receiver_id', $authId);
            })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'nullable|string',
            'type' => 'nullable|string|in:text,order_request,payment_proof,system_alert',
            'order_id' => 'nullable|exists:orders,id',
            'listing_id' => 'nullable|exists:listings,id',
            'attachment' => 'nullable|image|max:5120', // Max 5MB screenshot
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('chat_attachments', 'public');
        }

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message ?? '',
            'type' => $request->type ?? 'text',
            'order_id' => $request->order_id,
            'listing_id' => $request->listing_id,
            'attachment_path' => $attachmentPath,
        ]);

        return response()->json($message->load(['order', 'listing']), 201);
    }
}