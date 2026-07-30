<?php

namespace App\Actions\Payments;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;

class FailOrderPayment
{
    public function handle(Order $order, User $user): Order
    {
        if ($order->payment_status === PaymentStatus::Paid) {
            return $order;
        }

        abort_unless($order->stripe_payment_intent_id !== null, 422);

        $stripeIntent = $user->stripe()->paymentIntents->retrieve($order->stripe_payment_intent_id);

        if ($stripeIntent->status === 'succeeded') {
            return $order;
        }

        $order->update(['payment_status' => PaymentStatus::Failed]);

        return $order;
    }
}
