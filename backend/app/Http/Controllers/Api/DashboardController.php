<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'active_nodes' => 12,
            'network_health' => '99.98%',
            'pending_transactions' => 4,
        ];

        $payload = [
            'status' => 'success',
            'message' => 'Welcome to the TrustRoute secure node coordinator dashboard.',
            'user' => $user,
            'role' => $user->role,
            'stats' => $stats,
        ];

        if ($user->role === 'admin') {
            $stats['system_alerts'] = 0;
        } elseif ($user->role === 'shopkeeper') {
            $stats['active_listings'] = 0;
            $stats['pending_orders'] = 0;
        } elseif ($user->role === 'delivery') {
            $stats['assigned_deliveries'] = 0;
            $stats['completed_deliveries'] = 0;
        } else {
            $stats['active_orders'] = 0;
            $stats['completed_orders'] = 0;
            
            // Include all marketplace listings for customers to browse across all shops
            $payload['listings'] = Listing::with('shop')->latest()->get();
        }

        $payload['stats'] = $stats;

        return response()->json($payload);
    }
}