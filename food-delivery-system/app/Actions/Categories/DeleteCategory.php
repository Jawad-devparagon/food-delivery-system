<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class DeleteCategory
{
    public function handle(Category $category): void
    {
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path);
        }

        $category->delete();
    }
}
