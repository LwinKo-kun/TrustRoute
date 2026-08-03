<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Example conditional data based on roles
        $stats = [
            'active_nodes' => 12,
            'network_health' => '99.98%',
            'pending_transactions' => 4,
        ];

        if ($user->role === 'admin') {
             $stats['system_alerts'] = 0; 
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Welcome to the TrustRoute secure node coordinator dashboard.',
            'user' => $user->load('roles'),
            'stats' => $stats
        ]);
    }
}