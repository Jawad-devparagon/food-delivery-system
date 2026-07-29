<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Drivers\CreateDriver;
use App\Actions\Drivers\DeleteDriver;
use App\Actions\Drivers\UpdateDriver;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DriverStoreRequest;
use App\Http\Requests\Admin\DriverUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/drivers/index', [
            'drivers' => User::where('role', UserRole::Driver)
                ->withCount('deliveries')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(DriverStoreRequest $request, CreateDriver $action): RedirectResponse
    {
        $action->handle($request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Driver created.']);

        return to_route('admin.drivers.index');
    }

    public function update(DriverUpdateRequest $request, User $driver, UpdateDriver $action): RedirectResponse
    {
        $action->handle($driver, $request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Driver updated.']);

        return to_route('admin.drivers.index');
    }

    public function destroy(User $driver, DeleteDriver $action): RedirectResponse
    {
        $action->handle($driver);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Driver removed.']);

        return to_route('admin.drivers.index');
    }
}
