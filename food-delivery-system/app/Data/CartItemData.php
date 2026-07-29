<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CartItemData extends Data
{
    public function __construct(
        public readonly int $menu_item_id,
        public readonly int $quantity,
    ) {}
}
