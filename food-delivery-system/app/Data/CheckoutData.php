<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CheckoutData extends Data
{
    public function __construct(
        public readonly string $delivery_address,
        public readonly string $phone,
        public readonly ?string $notes,
    ) {}
}
