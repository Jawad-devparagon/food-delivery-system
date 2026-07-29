<?php

namespace App\Http\Controllers\Admin;

use App\Actions\MenuItems\CreateMenuItem;
use App\Actions\MenuItems\DeleteMenuItem;
use App\Actions\MenuItems\UpdateMenuItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MenuItemStoreRequest;
use App\Http\Requests\Admin\MenuItemUpdateRequest;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/menu-items/index', [
            'menuItems' => MenuItem::with('category:id,name')
                ->orderBy('name')
                ->get(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(MenuItemStoreRequest $request, CreateMenuItem $action): RedirectResponse
    {
        $action->handle($request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Menu item created.']);

        return to_route('admin.menu-items.index');
    }

    public function update(MenuItemUpdateRequest $request, MenuItem $menuItem, UpdateMenuItem $action): RedirectResponse
    {
        $action->handle($menuItem, $request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Menu item updated.']);

        return to_route('admin.menu-items.index');
    }

    public function destroy(MenuItem $menuItem, DeleteMenuItem $action): RedirectResponse
    {
        try {
            $action->handle($menuItem);
        } catch (QueryException) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cannot delete a menu item that has existing orders.']);

            return to_route('admin.menu-items.index');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Menu item deleted.']);

        return to_route('admin.menu-items.index');
    }
}
