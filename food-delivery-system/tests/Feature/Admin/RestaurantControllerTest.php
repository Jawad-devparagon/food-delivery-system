<?php

use App\Enums\UserRole;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function admin(): User
{
    return User::factory()->create(['role' => UserRole::Admin]);
}

test('guests cannot access restaurant routes', function () {
    $restaurant = Restaurant::factory()->create();

    $this->get(route('admin.restaurants.index'))->assertRedirect(route('login'));
    $this->put(route('admin.restaurants.update', $restaurant))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from restaurant routes', function () {
    $customer = User::factory()->create(['role' => UserRole::Customer]);

    $this->actingAs($customer)
        ->get(route('admin.restaurants.index'))
        ->assertForbidden();
});

test('an admin can view the restaurants index', function () {
    Restaurant::factory()->count(3)->create();

    $this->actingAs(admin())
        ->get(route('admin.restaurants.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('restaurants', 3));
});

test('an admin can create a restaurant', function () {
    Storage::fake('public');

    $response = $this->actingAs(admin())->post(route('admin.restaurants.store'), [
        'name' => 'The Corner Bistro',
        'description' => 'Cozy neighborhood spot.',
        'address' => '123 Main St, Springfield',
        'phone' => '555-0100',
        'email' => 'hello@cornerbistro.test',
        'is_active' => true,
        'sort_order' => 1,
        'image' => UploadedFile::fake()->image('restaurant.jpg'),
    ]);

    $response->assertRedirect(route('admin.restaurants.index'));

    $restaurant = Restaurant::sole();

    expect($restaurant->name)->toBe('The Corner Bistro')
        ->and($restaurant->slug)->toBe('the-corner-bistro')
        ->and($restaurant->address)->toBe('123 Main St, Springfield')
        ->and($restaurant->phone)->toBe('555-0100')
        ->and($restaurant->email)->toBe('hello@cornerbistro.test')
        ->and($restaurant->is_active)->toBeTrue()
        ->and($restaurant->sort_order)->toBe(1)
        ->and($restaurant->image_path)->not->toBeNull();

    Storage::disk('public')->assertExists($restaurant->image_path);
});

test('creating a restaurant requires the core fields', function () {
    $response = $this->actingAs(admin())->post(route('admin.restaurants.store'), []);

    $response->assertSessionHasErrors(['name', 'address', 'phone']);
});

test('an admin can update a restaurant', function () {
    $restaurant = Restaurant::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs(admin())->put(route('admin.restaurants.update', $restaurant), [
        'name' => 'New Name',
        'description' => $restaurant->description,
        'address' => $restaurant->address,
        'phone' => $restaurant->phone,
        'email' => $restaurant->email,
        'is_active' => false,
        'sort_order' => 5,
    ]);

    $response->assertRedirect(route('admin.restaurants.index'));

    expect($restaurant->fresh())
        ->name->toBe('New Name')
        ->slug->toBe('new-name')
        ->is_active->toBeFalse()
        ->sort_order->toBe(5);
});

test('an admin can delete a restaurant', function () {
    $restaurant = Restaurant::factory()->create();

    $response = $this->actingAs(admin())->delete(route('admin.restaurants.destroy', $restaurant));

    $response->assertRedirect(route('admin.restaurants.index'));

    expect(Restaurant::find($restaurant->id))->toBeNull();
});
