<?php

namespace App\Actions\Restaurants;

use App\Models\Restaurant;
use Illuminate\Support\Facades\Storage;

class DeleteRestaurant
{
    public function handle(Restaurant $restaurant): void
    {
        if ($restaurant->image_path) {
            Storage::disk('public')->delete($restaurant->image_path);
        }

        $restaurant->delete();
    }
}
