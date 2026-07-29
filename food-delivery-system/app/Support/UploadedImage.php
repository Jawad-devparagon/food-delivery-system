<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use RuntimeException;

class UploadedImage
{
    public static function store(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        if ($path === false) {
            throw new RuntimeException("Failed to store uploaded image in [{$directory}].");
        }

        return $path;
    }
}
