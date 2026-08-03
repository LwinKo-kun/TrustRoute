<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Welcome to the TrustRoute secure node coordinator dashboard.',
            'user' => $request->user(),
            'stats' => [
                'active_nodes' => 12,
                'network_health' => '99.98%',
                'pending_transactions' => 4,
            ]
        ]);
    }
}