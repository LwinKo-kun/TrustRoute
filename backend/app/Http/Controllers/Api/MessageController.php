<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        $authId = $request->user()->id;
        
        $senderIds = Message::where('receiver_id', $authId)->pluck('sender_id');
        $receiverIds = Message::where('sender_id', $authId)->pluck('receiver_id');
        // Remove yourself from the partner list so you don't show up in your own sidebar
        $partnerIds = $senderIds->merge($receiverIds)->unique()->reject(fn($id) => $id == $authId);
        
        $users = User::whereIn('id', $partnerIds)->get(['id', 'name', 'email'])->map(function ($user) use ($authId) {
            $data = $user->toArray();
            
            // Calculate exactly how many unread messages THIS specific user sent you
            $data['unread_count'] = Message::where('sender_id', $user->id)
                                         ->where('receiver_id', $authId)
                                         ->where('is_read', false)
                                         ->count();

            $lastMessage = Message::where(function($q) use ($authId, $user) {
                $q->where('sender_id', $authId)->where('receiver_id', $user->id);
            })->orWhere(function($q) use ($authId, $user) {
                $q->where('sender_id', $user->id)->where('receiver_id', $authId);
            })->latest()->first();

            $data['last_message'] = $lastMessage ? $lastMessage->message : 'Tap to open chat';

            return $data;
        });

        // Sort so people with unread messages bubble to the top of your inbox
        $users = $users->sortByDesc('unread_count')->values();

        return response()->json($users);
    }

    public function unreadCount(Request $request)
    {
        $userId = $request->user()->id;

        // AUTO-HEAL SCRIPT: Instantly mark any bugged self-sent messages as read so they don't break the header counter.
        Message::where('receiver_id', $userId)
               ->where('sender_id', $userId)
               ->update(['is_read' => true]);

        // Only count unread messages from OTHER people
        $count = Message::where('receiver_id', $userId)
                        ->where('sender_id', '!=', $userId)
                        ->where('is_read', false)
                        ->count();

        return response()->json(['count' => $count]);
    }

    public function getMessages(Request $request, $receiverId)
    {
        $authId = $request->user()->id;

        // Force an immediate DB transaction to guarantee the "read" status is saved permanently
        DB::transaction(function () use ($authId, $receiverId) {
            Message::where('receiver_id', $authId)
                   ->where('sender_id', $receiverId)
                   ->where('is_read', false)
                   ->update(['is_read' => true]);
        });

        $messages = Message::with(['order.items.listing', 'listing'])
            ->where(function ($query) use ($authId, $receiverId) {
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
            'attachment' => 'nullable|image|max:5120', 
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('chat_attachments', 'public');
        }

        $message = Message::create([
            'sender_id' => $request->user()->id,
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