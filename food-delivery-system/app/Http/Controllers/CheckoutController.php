<?php

namespace App\Http\Controllers;

use App\Actions\Orders\PlaceOrder;
use App\Http\Requests\Customer\CheckoutStoreRequest;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(Cart $cart): RedirectResponse|Response
    {
        if ($cart->isEmpty()) {
            return to_route('menu.index');
        }

        return Inertia::render('checkout/index', [
            'items' => $cart->items(),
            'subtotal' => $cart->subtotal(),
            'deliveryFee' => PlaceOrder::DELIVERY_FEE,
        ]);
    }

    public function store(CheckoutStoreRequest $request, PlaceOrder $action): RedirectResponse
    {
        $order = $action->handle($request->user(), $request->toData());

        return to_route('checkout.pay', $order);
    }
}
