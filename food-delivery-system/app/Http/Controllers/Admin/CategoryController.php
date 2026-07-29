<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Categories\CreateCategory;
use App\Actions\Categories\DeleteCategory;
use App\Actions\Categories\UpdateCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryStoreRequest;
use App\Http\Requests\Admin\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::withCount('menuItems')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(CategoryStoreRequest $request, CreateCategory $action): RedirectResponse
    {
        $action->handle($request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category created.']);

        return to_route('admin.categories.index');
    }

    public function update(CategoryUpdateRequest $request, Category $category, UpdateCategory $action): RedirectResponse
    {
        $action->handle($category, $request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category updated.']);

        return to_route('admin.categories.index');
    }

    public function destroy(Category $category, DeleteCategory $action): RedirectResponse
    {
        try {
            $action->handle($category);
        } catch (QueryException) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cannot delete a category that has menu items with existing orders.']);

            return to_route('admin.categories.index');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category deleted.']);

        return to_route('admin.categories.index');
    }
}
