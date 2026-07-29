<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = [
            ['name' => 'Alex Rivera', 'email' => 'driver1@example.com'],
            ['name' => 'Sam Chen', 'email' => 'driver2@example.com'],
        ];

        foreach ($drivers as $driver) {
            User::updateOrCreate(
                ['email' => $driver['email']],
                [
                    'name' => $driver['name'],
                    'password' => 'password',
                    'role' => UserRole::Driver,
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
