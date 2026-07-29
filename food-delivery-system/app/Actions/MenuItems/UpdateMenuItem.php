<?php

namespace App\Actions\MenuItems;

use App\Data\MenuItemData;
use App\Models\MenuItem;
use App\Support\Slug;
use App\Support\UploadedImage;
use Illuminate\Support\Facades\Storage;

class UpdateMenuItem
{
    public function handle(MenuItem $menuItem, MenuItemData $data): MenuItem
    {
        $menuItem->fill([
            'category_id' => $data->category_id,
            'name' => $data->name,
            'slug' => $data->name === $menuItem->name
                ? $menuItem->slug
                : Slug::unique($data->name, MenuItem::class, $menuItem->id),
            'description' => $data->description,
            'price' => $data->price,
            'status' => $data->status,
        ]);

        if ($data->image) {
            if ($menuItem->image_path) {
                Storage::disk('public')->delete($menuItem->image_path);
            }

            $menuItem->image_path = UploadedImage::store($data->image, 'menu-items');
        }

        $menuItem->save();

        return $menuItem;
    }
}
