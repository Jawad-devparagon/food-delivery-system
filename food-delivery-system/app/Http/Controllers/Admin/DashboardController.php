<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'pendingOrders' => Order::where('status', OrderStatus::Pending)->count(),
                'activeOrders' => Order::whereIn('status', [
                    OrderStatus::Confirmed, OrderStatus::Preparing, OrderStatus::OutForDelivery,
                ])->count(),
                'deliveredToday' => Order::where('status', OrderStatus::Delivered)
                    ->whereDate('delivered_at', today())
                    ->count(),
                'revenueToday' => (float) Order::where('payment_status', PaymentStatus::Paid)
                    ->whereDate('paid_at', today())
                    ->sum('total'),
                'driverCount' => User::where('role', UserRole::Driver)->count(),
            ],
            'recentOrders' => Order::with('user:id,name')
                ->latest()
                ->limit(8)
                ->get(['id', 'user_id', 'status', 'payment_status', 'total', 'created_at']),
        ]);
    }
}
