<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class UpdateOrderStatus
{
    /**
     * The status transitions a driver is allowed to perform, keyed by the order's current status.
     *
     * @var array<string, list<string>>
     */
    private const DRIVER_TRANSITIONS = [
        'preparing' => ['out_for_delivery'],
        'out_for_delivery' => ['delivered'],
    ];

    public function handle(Order $order, OrderStatus $status, User $actor): Order
    {
        if ($actor->role === UserRole::Driver) {
            abort_unless($order->driver_id === $actor->id, 403);

            $allowed = self::DRIVER_TRANSITIONS[$order->status->value] ?? [];

            if (! in_array($status->value, $allowed, true)) {
                throw ValidationException::withMessages([
                    'status' => 'That status change is not allowed.',
                ]);
            }
        }

        $order->status = $status;

        if ($status === OrderStatus::Delivered) {
            $order->delivered_at = Carbon::now();
        }

        $order->save();

        return $order;
    }
}
