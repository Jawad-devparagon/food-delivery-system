<?php

namespace App\Actions\Drivers;

use App\Data\DriverData;
use App\Enums\UserRole;
use App\Models\User;

class CreateDriver
{
    public function handle(DriverData $data): User
    {
        return User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => $data->password,
            'role' => UserRole::Driver,
            'email_verified_at' => now(),
        ]);
    }
}
