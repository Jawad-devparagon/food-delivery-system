<?php

namespace App\Actions\MenuItems;

use App\Data\MenuItemData;
use App\Models\MenuItem;
use App\Support\Slug;
use App\Support\UploadedImage;

class CreateMenuItem
{
    public function handle(MenuItemData $data): MenuItem
    {
        return MenuItem::create([
            'category_id' => $data->category_id,
            'name' => $data->name,
            'slug' => Slug::unique($data->name, MenuItem::class),
            'description' => $data->description,
            'price' => $data->price,
            'status' => $data->status,
            'image_path' => $data->image ? UploadedImage::store($data->image, 'menu-items') : null,
        ]);
    }
}
