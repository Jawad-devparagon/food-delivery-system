<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class DriverData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $password,
    ) {}
}
