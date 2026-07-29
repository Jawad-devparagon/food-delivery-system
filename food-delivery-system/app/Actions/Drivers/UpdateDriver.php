<?php

namespace App\Actions\Drivers;

use App\Data\DriverData;
use App\Models\User;

class UpdateDriver
{
    public function handle(User $driver, DriverData $data): User
    {
        $driver->name = $data->name;
        $driver->email = $data->email;

        if ($data->password) {
            $driver->password = $data->password;
        }

        $driver->save();

        return $driver;
    }
}
