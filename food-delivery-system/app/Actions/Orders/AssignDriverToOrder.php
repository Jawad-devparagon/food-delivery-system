<?php

namespace App\Actions\Orders;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AssignDriverToOrder
{
    public function handle(Order $order, User $driver): Order
    {
        if ($driver->role !== UserRole::Driver) {
            throw ValidationException::withMessages([
                'driver_id' => 'Selected user is not a driver.',
            ]);
        }

        $order->driver_id = $driver->id;
        $order->save();

        return $order;
    }
}
