<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('menu', [MenuController::class, 'index'])->name('menu.index');

Route::middleware(['auth', 'verified', 'role:customer'])->group(function () {
    Route::get('cart', [CartController::class, 'show'])->name('cart.show');
    Route::post('cart/items', [CartController::class, 'store'])->name('cart.store');
    Route::patch('cart/items/{menuItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('cart/items/{menuItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('cart', [CartController::class, 'clear'])->name('cart.clear');

    Route::get('checkout', [CheckoutController::class, 'create'])->name('checkout.create');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('checkout/{order}/pay', [PaymentController::class, 'show'])->name('checkout.pay');
    Route::post('checkout/{order}/confirm', [PaymentController::class, 'confirm'])->name('checkout.confirm');
    Route::post('checkout/{order}/fail', [PaymentController::class, 'fail'])->name('checkout.fail');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});
