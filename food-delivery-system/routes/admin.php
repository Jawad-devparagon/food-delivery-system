<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\RestaurantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('menu-items', [MenuItemController::class, 'index'])->name('menu-items.index');
    Route::post('menu-items', [MenuItemController::class, 'store'])->name('menu-items.store');
    Route::put('menu-items/{menuItem}', [MenuItemController::class, 'update'])->name('menu-items.update');
    Route::delete('menu-items/{menuItem}', [MenuItemController::class, 'destroy'])->name('menu-items.destroy');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::patch('orders/{order}/assign-driver', [OrderController::class, 'assignDriver'])->name('orders.assign-driver');

    Route::get('drivers', [DriverController::class, 'index'])->name('drivers.index');
    Route::post('drivers', [DriverController::class, 'store'])->name('drivers.store');
    Route::put('drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
    Route::delete('drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');

    Route::get('restaurants', [RestaurantController::class, 'index'])->name('restaurants.index');
    Route::post('restaurants', [RestaurantController::class, 'store'])->name('restaurants.store');
    Route::put('restaurants/{restaurant}', [RestaurantController::class, 'update'])->name('restaurants.update');
    Route::delete('restaurants/{restaurant}', [RestaurantController::class, 'destroy'])->name('restaurants.destroy');
});
