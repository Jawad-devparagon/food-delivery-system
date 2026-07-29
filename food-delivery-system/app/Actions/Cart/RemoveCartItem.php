<?php

namespace App\Actions\Cart;

use App\Support\Cart;

class RemoveCartItem
{
    public function __construct(private readonly Cart $cart) {}

    public function handle(int $menuItemId): void
    {
        $this->cart->remove($menuItemId);
    }
}
