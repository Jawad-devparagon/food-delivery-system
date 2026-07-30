<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10, 100);
        $deliveryFee = 4.99;

        return [
            'user_id' => User::factory(),
            'driver_id' => null,
            'status' => OrderStatus::Pending,
            'payment_status' => PaymentStatus::Pending,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => $subtotal + $deliveryFee,
            'delivery_address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'notes' => null,
            'stripe_payment_intent_id' => null,
            'paid_at' => null,
            'delivered_at' => null,
        ];
    }

    /**
     * Indicate that the order has a Stripe payment intent attached.
     */
    public function withStripePaymentIntent(string $id = 'pi_test_123'): static
    {
        return $this->state(fn (array $attributes) => [
            'stripe_payment_intent_id' => $id,
        ]);
    }
}
