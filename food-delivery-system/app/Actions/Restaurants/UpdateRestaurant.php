<?php

namespace App\Actions\Restaurants;

use App\Data\RestaurantData;
use App\Models\Restaurant;
use App\Support\Slug;
use App\Support\UploadedImage;
use Illuminate\Support\Facades\Storage;

class UpdateRestaurant
{
    public function handle(Restaurant $restaurant, RestaurantData $data): Restaurant
    {
        $restaurant->fill([
            'name' => $data->name,
            'slug' => $data->name === $restaurant->name
                ? $restaurant->slug
                : Slug::unique($data->name, Restaurant::class, $restaurant->id),
            'description' => $data->description,
            'address' => $data->address,
            'phone' => $data->phone,
            'email' => $data->email,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
        ]);

        if ($data->image) {
            if ($restaurant->image_path) {
                Storage::disk('public')->delete($restaurant->image_path);
            }

            $restaurant->image_path = UploadedImage::store($data->image, 'restaurants');
        }

        $restaurant->save();

        return $restaurant;
    }
}
