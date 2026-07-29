<?php

namespace App\Http\Requests\Customer;

use App\Data\CartItemData;
use App\Enums\MenuItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CartStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'menu_item_id' => [
                'required',
                'integer',
                Rule::exists('menu_items', 'id')->where('status', MenuItemStatus::Available->value),
            ],
            'quantity' => ['required', 'integer', 'min:1', 'max:20'],
        ];
    }

    public function toData(): CartItemData
    {
        return CartItemData::from($this->validated());
    }
}
