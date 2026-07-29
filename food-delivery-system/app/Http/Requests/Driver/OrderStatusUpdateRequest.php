<?php

namespace App\Http\Requests\Driver;

use App\Data\OrderStatusData;
use App\Enums\OrderStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderStatusUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(OrderStatus::class)],
        ];
    }

    public function toData(): OrderStatusData
    {
        return OrderStatusData::from($this->validated());
    }
}
