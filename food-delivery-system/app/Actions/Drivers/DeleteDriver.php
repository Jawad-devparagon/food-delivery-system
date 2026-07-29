<?php

namespace App\Actions\Drivers;

use App\Models\User;

class DeleteDriver
{
    public function handle(User $driver): void
    {
        $driver->delete();
    }
}
