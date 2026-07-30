<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Stripe\StripeClient;

uses(RefreshDatabase::class);

function fakeStripeClient(object $paymentIntent): object
{
    $paymentIntents = new class($paymentIntent)
    {
        public function __construct(private readonly object $paymentIntent) {}

        public function retrieve(string $id): object
        {
            return $this->paymentIntent;
        }
    };

    return new class($paymentIntents)
    {
        public function __construct(public object $paymentIntents) {}
    };
}

test('confirming a payment marks the order as paid when stripe reports success', function () {
    $user = User::factory()->create(['role' => UserRole::Customer]);
    $order = Order::factory()->for($user)->withStripePaymentIntent('pi_test_123')->create();

    app()->bind(StripeClient::class, fn () => fakeStripeClient((object) [
        'status' => 'succeeded',
        'amount' => $order->totalInCents(),
    ]));

    $response = $this
        ->actingAs($user)
        ->postJson(route('checkout.confirm', $order));

    $response->assertOk()->assertJson([
        'status' => OrderStatus::Confirmed->value,
        'paymentStatus' => PaymentStatus::Paid->value,
    ]);

    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Paid);
    expect($order->fresh()->paid_at)->not->toBeNull();
});

test('confirming a payment fails validation when stripe has not confirmed success', function () {
    $user = User::factory()->create(['role' => UserRole::Customer]);
    $order = Order::factory()->for($user)->withStripePaymentIntent('pi_test_123')->create();

    app()->bind(StripeClient::class, fn () => fakeStripeClient((object) [
        'status' => 'requires_payment_method',
        'amount' => $order->totalInCents(),
    ]));

    $response = $this
        ->actingAs($user)
        ->postJson(route('checkout.confirm', $order));

    $response->assertUnprocessable()->assertJsonValidationErrors('payment');

    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Pending);
});

test('failing a payment marks the order payment status as failed', function () {
    $user = User::factory()->create(['role' => UserRole::Customer]);
    $order = Order::factory()->for($user)->withStripePaymentIntent('pi_test_123')->create();

    app()->bind(StripeClient::class, fn () => fakeStripeClient((object) [
        'status' => 'requires_payment_method',
        'amount' => $order->totalInCents(),
    ]));

    $response = $this
        ->actingAs($user)
        ->postJson(route('checkout.fail', $order));

    $response->assertOk()->assertJson([
        'paymentStatus' => PaymentStatus::Failed->value,
    ]);

    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Failed);
});

test('a customer cannot confirm or fail payment for another customers order', function () {
    $owner = User::factory()->create(['role' => UserRole::Customer]);
    $intruder = User::factory()->create(['role' => UserRole::Customer]);
    $order = Order::factory()->for($owner)->withStripePaymentIntent('pi_test_123')->create();

    $this->actingAs($intruder)->postJson(route('checkout.confirm', $order))->assertForbidden();
    $this->actingAs($intruder)->postJson(route('checkout.fail', $order))->assertForbidden();
});
