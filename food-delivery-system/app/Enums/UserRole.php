<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Customer = 'customer';
    case Driver = 'driver';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Customer => 'Customer',
            self::Driver => 'Driver',
        };
    }
}
