<?php

namespace App\Actions\Payments;

use App\Models\Order;
use App\Models\User;
use Laravel\Cashier\Payment;

class CreatePaymentIntentForOrder
{
    /**
     * @var list<string>
     */
    private const REUSABLE_STATUSES = ['requires_payment_method', 'requires_confirmation', 'requires_action'];

    public function handle(Order $order, User $user): Payment
    {
        $user->createOrGetStripeCustomer();

        if ($order->stripe_payment_intent_id) {
            $stripeIntent = $user->stripe()->paymentIntents->retrieve($order->stripe_payment_intent_id);

            if (in_array($stripeIntent->status, self::REUSABLE_STATUSES, true)) {
                return new Payment($stripeIntent);
            }
        }

        $payment = $user->pay($order->totalInCents(), [
            'metadata' => ['order_id' => (string) $order->id],
        ]);

        $order->update(['stripe_payment_intent_id' => $payment->asStripePaymentIntent()->id]);

        return $payment;
    }
}
