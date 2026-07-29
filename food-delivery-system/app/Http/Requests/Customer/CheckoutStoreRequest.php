<?php

namespace App\Http\Requests\Customer;

use App\Data\CheckoutData;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'delivery_address' => ['required', 'string', 'max:500'],
            'phone' => ['required', 'string', 'max:30'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function toData(): CheckoutData
    {
        return CheckoutData::from($this->validated());
    }
}
