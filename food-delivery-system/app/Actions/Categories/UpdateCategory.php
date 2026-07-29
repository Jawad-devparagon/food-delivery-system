<?php

namespace App\Actions\Categories;

use App\Data\CategoryData;
use App\Models\Category;
use App\Support\Slug;
use App\Support\UploadedImage;
use Illuminate\Support\Facades\Storage;

class UpdateCategory
{
    public function handle(Category $category, CategoryData $data): Category
    {
        $category->fill([
            'name' => $data->name,
            'slug' => $data->name === $category->name
                ? $category->slug
                : Slug::unique($data->name, Category::class, $category->id),
            'description' => $data->description,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
        ]);

        if ($data->image) {
            if ($category->image_path) {
                Storage::disk('public')->delete($category->image_path);
            }

            $category->image_path = UploadedImage::store($data->image, 'categories');
        }

        $category->save();

        return $category;
    }
}
