<?php

use App\Http\Controllers\Driver\DashboardController;
use App\Http\Controllers\Driver\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:driver'])->prefix('driver')->name('driver.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
});
