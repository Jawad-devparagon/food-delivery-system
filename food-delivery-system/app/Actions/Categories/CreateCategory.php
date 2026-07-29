<?php

namespace App\Actions\Categories;

use App\Data\CategoryData;
use App\Models\Category;
use App\Support\Slug;
use App\Support\UploadedImage;

class CreateCategory
{
    public function handle(CategoryData $data): Category
    {
        return Category::create([
            'name' => $data->name,
            'slug' => Slug::unique($data->name, Category::class),
            'description' => $data->description,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
            'image_path' => $data->image ? UploadedImage::store($data->image, 'categories') : null,
        ]);
    }
}
