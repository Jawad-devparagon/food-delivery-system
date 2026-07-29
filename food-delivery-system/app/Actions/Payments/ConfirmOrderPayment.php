<?php

namespace App\Actions\Payments;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ConfirmOrderPayment
{
    public function handle(Order $order, User $user): Order
    {
        if ($order->payment_status === PaymentStatus::Paid) {
            return $order;
        }

        abort_unless($order->stripe_payment_intent_id !== null, 422);

        $stripeIntent = $user->stripe()->paymentIntents->retrieve($order->stripe_payment_intent_id);

        if ($stripeIntent->status !== 'succeeded' || (int) $stripeIntent->amount !== $order->totalInCents()) {
            throw ValidationException::withMessages([
                'payment' => 'Payment could not be confirmed. Please try again.',
            ]);
        }

        $order->update([
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Confirmed,
            'paid_at' => now(),
        ]);

        return $order;
    }
}
