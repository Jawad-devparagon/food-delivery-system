<?php

namespace App\Actions\Cart;

use App\Data\CartItemData;
use App\Support\Cart;

class UpdateCartItem
{
    public function __construct(private readonly Cart $cart) {}

    public function handle(CartItemData $data): void
    {
        $this->cart->update($data->menu_item_id, $data->quantity);
    }
}
