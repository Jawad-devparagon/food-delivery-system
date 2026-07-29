<?php

namespace App\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

class RestaurantData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
        public readonly string $address,
        public readonly string $phone,
        public readonly ?string $email,
        public readonly bool $is_active,
        public readonly int $sort_order,
        public readonly ?UploadedFile $image,
    ) {}
}
