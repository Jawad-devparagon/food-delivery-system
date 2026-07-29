<?php

namespace App\Http\Requests\Admin;

use App\Data\CategoryData;
use Illuminate\Foundation\Http\FormRequest;

class CategoryUpdateRequest extends FormRequest
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
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:4096'],
        ];
    }

    public function toData(): CategoryData
    {
        return CategoryData::from([
            'name' => $this->validated('name'),
            'description' => $this->validated('description'),
            'is_active' => $this->boolean('is_active'),
            'sort_order' => (int) $this->input('sort_order', 0),
            'image' => $this->file('image'),
        ]);
    }
}
