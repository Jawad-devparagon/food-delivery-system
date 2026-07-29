<?php

namespace App\Data;

use App\Enums\MenuItemStatus;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

class MenuItemData extends Data
{
    public function __construct(
        public readonly int $category_id,
        public readonly string $name,
        public readonly ?string $description,
        public readonly float $price,
        public readonly MenuItemStatus $status,
        public readonly ?UploadedFile $image,
    ) {}
}
