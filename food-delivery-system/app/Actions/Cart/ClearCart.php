<?php

namespace App\Actions\Cart;

use App\Support\Cart;

class ClearCart
{
    public function __construct(private readonly Cart $cart) {}

    public function handle(): void
    {
        $this->cart->clear();
    }
}
