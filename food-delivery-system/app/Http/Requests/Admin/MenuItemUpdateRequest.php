<?php

namespace App\Http\Requests\Admin;

use App\Data\MenuItemData;
use App\Enums\MenuItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuItemUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999.99'],
            'status' => ['required', Rule::enum(MenuItemStatus::class)],
            'image' => ['nullable', 'image', 'max:4096'],
        ];
    }

    public function toData(): MenuItemData
    {
        return MenuItemData::from([
            'category_id' => (int) $this->validated('category_id'),
            'name' => $this->validated('name'),
            'description' => $this->validated('description'),
            'price' => (float) $this->validated('price'),
            'status' => $this->validated('status'),
            'image' => $this->file('image'),
        ]);
    }
}
