<?php

namespace App\Actions\Orders;

use App\Data\CheckoutData;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use App\Support\Cart;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PlaceOrder
{
    public const DELIVERY_FEE = 2.99;

    public function __construct(private readonly Cart $cart) {}

    public function handle(User $user, CheckoutData $data): Order
    {
        $items = $this->cart->items();

        if ($items === []) {
            throw ValidationException::withMessages([
                'cart' => 'Your cart is empty.',
            ]);
        }

        $subtotal = round(array_sum(array_column($items, 'total')), 2);
        $total = round($subtotal + self::DELIVERY_FEE, 2);

        $order = DB::transaction(function () use ($user, $data, $items, $subtotal, $total) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => OrderStatus::Pending,
                'payment_status' => PaymentStatus::Pending,
                'subtotal' => $subtotal,
                'delivery_fee' => self::DELIVERY_FEE,
                'total' => $total,
                'delivery_address' => $data->delivery_address,
                'phone' => $data->phone,
                'notes' => $data->notes,
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'menu_item_id' => $item['menu_item_id'],
                    'name' => $item['name'],
                    'unit_price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'total' => $item['total'],
                ]);
            }

            return $order;
        });

        $this->cart->clear();

        return $order;
    }
}
