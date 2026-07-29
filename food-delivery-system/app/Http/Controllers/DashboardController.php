<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if ($user->role === UserRole::Admin) {
            return to_route('admin.dashboard');
        }

        if ($user->role === UserRole::Driver) {
            return to_route('driver.dashboard');
        }

        $recentOrders = $user->orders()
            ->latest()
            ->limit(5)
            ->get(['id', 'status', 'payment_status', 'total', 'created_at']);

        return Inertia::render('dashboard', [
            'recentOrders' => $recentOrders,
        ]);
    }
}
