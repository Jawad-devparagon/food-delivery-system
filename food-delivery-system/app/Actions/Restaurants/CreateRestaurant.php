<?php

namespace App\Actions\Restaurants;

use App\Data\RestaurantData;
use App\Models\Restaurant;
use App\Support\Slug;
use App\Support\UploadedImage;

class CreateRestaurant
{
    public function handle(RestaurantData $data): Restaurant
    {
        return Restaurant::create([
            'name' => $data->name,
            'slug' => Slug::unique($data->name, Restaurant::class),
            'description' => $data->description,
            'address' => $data->address,
            'phone' => $data->phone,
            'email' => $data->email,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
            'image_path' => $data->image ? UploadedImage::store($data->image, 'restaurants') : null,
        ]);
    }
}
