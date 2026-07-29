<?php

namespace App\Actions\Cart;

use App\Data\CartItemData;
use App\Support\Cart;

class AddCartItem
{
    public function __construct(private readonly Cart $cart) {}

    public function handle(CartItemData $data): void
    {
        $this->cart->add($data->menu_item_id, $data->quantity);
    }
}
