<?php

namespace App\Http\Controllers;

use App\Enums\MenuItemStatus;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('menu/index', [
            'categories' => Category::where('is_active', true)
                ->with(['menuItems' => fn ($query) => $query->where('status', MenuItemStatus::Available)->orderBy('name')])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->filter(fn (Category $category) => $category->menuItems->isNotEmpty())
                ->values(),
        ]);
    }
}
