<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Restaurants\CreateRestaurant;
use App\Actions\Restaurants\DeleteRestaurant;
use App\Actions\Restaurants\UpdateRestaurant;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RestaurantStoreRequest;
use App\Http\Requests\Admin\RestaurantUpdateRequest;
use App\Models\Restaurant;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/restaurants/index', [
            'restaurants' => Restaurant::orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(RestaurantStoreRequest $request, CreateRestaurant $action): RedirectResponse
    {
        $action->handle($request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Restaurant created.']);

        return to_route('admin.restaurants.index');
    }

    public function update(RestaurantUpdateRequest $request, Restaurant $restaurant, UpdateRestaurant $action): RedirectResponse
    {
        $action->handle($restaurant, $request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Restaurant updated.']);

        return to_route('admin.restaurants.index');
    }

    public function destroy(Restaurant $restaurant, DeleteRestaurant $action): RedirectResponse
    {
        try {
            $action->handle($restaurant);
        } catch (QueryException) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cannot delete a restaurant that has existing orders.']);

            return to_route('admin.restaurants.index');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Restaurant deleted.']);

        return to_route('admin.restaurants.index');
    }
}
