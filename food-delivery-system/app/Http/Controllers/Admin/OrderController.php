<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Orders\AssignDriverToOrder;
use App\Actions\Orders\UpdateOrderStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignDriverRequest;
use App\Http\Requests\Admin\OrderStatusUpdateRequest;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/orders/index', [
            'orders' => Order::with(['user:id,name', 'driver:id,name'])
                ->when($request->string('status')->isNotEmpty(), fn ($query) => $query->where('status', $request->string('status')))
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'filters' => $request->only('status'),
        ]);
    }

    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => $order->load(['user:id,name,email', 'driver:id,name', 'items.menuItem:id,name']),
            'drivers' => User::where('role', UserRole::Driver)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function updateStatus(OrderStatusUpdateRequest $request, Order $order, UpdateOrderStatus $action): RedirectResponse
    {
        $action->handle($order, $request->toData()->status, $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order status updated.']);

        return back();
    }

    public function assignDriver(AssignDriverRequest $request, Order $order, AssignDriverToOrder $action): RedirectResponse
    {
        $action->handle($order, User::findOrFail((int) $request->validated('driver_id')));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Driver assigned.']);

        return back();
    }
}
