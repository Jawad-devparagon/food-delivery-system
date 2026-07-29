<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Appetizers', 'description' => 'Start your meal right.'],
            ['name' => 'Main Course', 'description' => 'Hearty, made-to-order dishes.'],
            ['name' => 'Desserts', 'description' => 'Sweet finishes.'],
            ['name' => 'Beverages', 'description' => 'Drinks to go with your meal.'],
        ];

        foreach ($categories as $index => $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                [
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
