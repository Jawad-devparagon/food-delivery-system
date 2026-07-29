<?php

namespace App\Http\Controllers\Driver;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $driver = $request->user();

        return Inertia::render('driver/dashboard', [
            'stats' => [
                'activeDeliveries' => $driver->deliveries()
                    ->whereIn('status', [OrderStatus::Preparing, OrderStatus::OutForDelivery])
                    ->count(),
                'deliveredToday' => $driver->deliveries()
                    ->where('status', OrderStatus::Delivered)
                    ->whereDate('delivered_at', today())
                    ->count(),
            ],
            'activeOrders' => $driver->deliveries()
                ->with('user:id,name')
                ->whereIn('status', [OrderStatus::Preparing, OrderStatus::OutForDelivery])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
