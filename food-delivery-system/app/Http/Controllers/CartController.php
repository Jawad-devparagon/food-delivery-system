<?php

namespace App\Http\Controllers;

use App\Actions\Cart\AddCartItem;
use App\Actions\Cart\ClearCart;
use App\Actions\Cart\RemoveCartItem;
use App\Actions\Cart\UpdateCartItem;
use App\Data\CartItemData;
use App\Http\Requests\Customer\CartStoreRequest;
use App\Http\Requests\Customer\CartUpdateRequest;
use App\Models\MenuItem;
use App\Support\Cart;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function show(Cart $cart): JsonResponse
    {
        return $this->respond($cart);
    }

    public function store(CartStoreRequest $request, AddCartItem $action, Cart $cart): JsonResponse
    {
        $action->handle($request->toData());

        return $this->respond($cart);
    }

    public function update(CartUpdateRequest $request, MenuItem $menuItem, UpdateCartItem $action, Cart $cart): JsonResponse
    {
        $action->handle(new CartItemData($menuItem->id, (int) $request->validated('quantity')));

        return $this->respond($cart);
    }

    public function destroy(MenuItem $menuItem, RemoveCartItem $action, Cart $cart): JsonResponse
    {
        $action->handle($menuItem->id);

        return $this->respond($cart);
    }

    public function clear(ClearCart $action, Cart $cart): JsonResponse
    {
        $action->handle();

        return $this->respond($cart);
    }

    private function respond(Cart $cart): JsonResponse
    {
        return response()->json([
            'items' => $cart->items(),
            'count' => $cart->count(),
            'subtotal' => $cart->subtotal(),
        ]);
    }
}
