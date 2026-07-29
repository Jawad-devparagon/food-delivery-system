<?php

namespace App\Http\Controllers\Driver;

use App\Actions\Orders\UpdateOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\OrderStatusUpdateRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('driver/orders/index', [
            'orders' => Order::with('user:id,name')
                ->where('driver_id', $request->user()->id)
                ->whereNot('status', 'delivered')
                ->latest()
                ->get(),
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->driver_id === $request->user()->id, 403);

        return Inertia::render('driver/orders/show', [
            'order' => $order->load(['user:id,name,email', 'items.menuItem:id,name']),
        ]);
    }

    public function updateStatus(OrderStatusUpdateRequest $request, Order $order, UpdateOrderStatus $action): JsonResponse
    {
        $order = $action->handle($order, $request->toData()->status, $request->user());

        return response()->json(['status' => $order->status]);
    }
}
