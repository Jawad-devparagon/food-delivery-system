<?php

namespace App\Actions\MenuItems;

use App\Models\MenuItem;
use Illuminate\Support\Facades\Storage;

class DeleteMenuItem
{
    public function handle(MenuItem $menuItem): void
    {
        if ($menuItem->image_path) {
            Storage::disk('public')->delete($menuItem->image_path);
        }

        $menuItem->delete();
    }
}
