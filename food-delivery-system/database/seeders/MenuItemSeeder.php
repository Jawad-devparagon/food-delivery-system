<?php

namespace Database\Seeders;

use App\Enums\MenuItemStatus;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $menu = [
            'Appetizers' => [
                ['name' => 'Garlic Bread', 'price' => 5.99, 'description' => 'Toasted baguette with garlic butter and herbs.'],
                ['name' => 'Mozzarella Sticks', 'price' => 7.49, 'description' => 'Breaded mozzarella, fried golden, served with marinara.'],
                ['name' => 'Spring Rolls', 'price' => 6.99, 'description' => 'Crispy vegetable spring rolls with sweet chili sauce.'],
                ['name' => 'Loaded Nachos', 'price' => 8.99, 'description' => 'Tortilla chips with cheese, jalapenos, salsa, and sour cream.'],
            ],
            'Main Course' => [
                ['name' => 'Margherita Pizza', 'price' => 12.99, 'description' => 'Classic pizza with tomato, mozzarella, and basil.'],
                ['name' => 'Cheeseburger Deluxe', 'price' => 10.99, 'description' => 'Beef patty, cheddar, lettuce, tomato, and special sauce.'],
                ['name' => 'Grilled Chicken Alfredo', 'price' => 13.49, 'description' => 'Fettuccine in creamy alfredo sauce with grilled chicken.'],
                ['name' => 'Beef Tacos (3pc)', 'price' => 9.99, 'description' => 'Soft tacos with seasoned beef, onion, and cilantro.'],
                ['name' => 'Veggie Stir Fry', 'price' => 11.49, 'description' => 'Seasonal vegetables wok-tossed in a savory sauce over rice.'],
            ],
            'Desserts' => [
                ['name' => 'Chocolate Lava Cake', 'price' => 6.49, 'description' => 'Warm chocolate cake with a molten center.'],
                ['name' => 'New York Cheesecake', 'price' => 5.99, 'description' => 'Rich and creamy classic cheesecake.'],
                ['name' => 'Tiramisu', 'price' => 6.99, 'description' => 'Espresso-soaked layers with mascarpone cream.'],
            ],
            'Beverages' => [
                ['name' => 'Fresh Lemonade', 'price' => 3.49, 'description' => 'Freshly squeezed and lightly sweetened.'],
                ['name' => 'Iced Tea', 'price' => 2.99, 'description' => 'Brewed black tea served over ice.'],
                ['name' => 'Cola', 'price' => 2.49, 'description' => 'Classic soft drink, ice cold.'],
                ['name' => 'Sparkling Water', 'price' => 2.99, 'description' => 'Chilled sparkling water.'],
            ],
        ];

        foreach ($menu as $categoryName => $items) {
            $category = Category::where('name', $categoryName)->first();

            if (! $category) {
                continue;
            }

            foreach ($items as $item) {
                $category->menuItems()->updateOrCreate(
                    ['slug' => Str::slug($item['name'])],
                    [
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'status' => MenuItemStatus::Available,
                    ],
                );
            }
        }
    }
}
