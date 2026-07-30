<?php

namespace App\Http\Controllers;

use App\Actions\Payments\ConfirmOrderPayment;
use App\Actions\Payments\CreatePaymentIntentForOrder;
use App\Actions\Payments\FailOrderPayment;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function show(Request $request, Order $order, CreatePaymentIntentForOrder $action): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_if($order->payment_status === PaymentStatus::Paid, 404);

        $payment = $action->handle($order, $request->user());

        return Inertia::render('checkout/pay', [
            'order' => $order->only(['id', 'total']),
            'clientSecret' => $payment->clientSecret(),
            'stripeKey' => config('cashier.key'),
        ]);
    }

    public function confirm(Request $request, Order $order, ConfirmOrderPayment $action): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order = $action->handle($order, $request->user());

        return response()->json([
            'status' => $order->status,
            'paymentStatus' => $order->payment_status,
            'redirect' => route('orders.show', $order),
        ]);
    }

    public function fail(Request $request, Order $order, FailOrderPayment $action): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order = $action->handle($order, $request->user());

        return response()->json([
            'status' => $order->status,
            'paymentStatus' => $order->payment_status,
        ]);
    }
}
