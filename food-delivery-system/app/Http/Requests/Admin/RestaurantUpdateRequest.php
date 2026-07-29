<?php

namespace App\Http\Requests\Admin;

use App\Data\RestaurantData;
use Illuminate\Foundation\Http\FormRequest;

class RestaurantUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'address' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:4096'],
        ];
    }

    public function toData(): RestaurantData
    {
        return RestaurantData::from([
            'name' => $this->validated('name'),
            'description' => $this->validated('description'),
            'address' => $this->validated('address'),
            'phone' => $this->validated('phone'),
            'email' => $this->validated('email'),
            'is_active' => $this->boolean('is_active'),
            'sort_order' => (int) $this->input('sort_order', 0),
            'image' => $this->file('image'),
        ]);
    }
}
