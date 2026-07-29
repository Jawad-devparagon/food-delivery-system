<?php

namespace App\Data;

use App\Enums\OrderStatus;
use Spatie\LaravelData\Data;

class OrderStatusData extends Data
{
    public function __construct(
        public readonly OrderStatus $status,
    ) {}
}
