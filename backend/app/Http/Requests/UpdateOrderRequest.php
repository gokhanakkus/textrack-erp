<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'sometimes|string|max:255',
            'product_type'  => 'sometimes|string|max:255',
            'color'         => 'sometimes|string|max:100',
            'size'          => 'sometimes|string|max:50',
            'quantity'      => 'sometimes|integer|min:1',
            'delivery_date' => 'sometimes|date',
            'status'        => 'sometimes|in:Pending,In Production,Quality Control,Completed,Delayed',
            'notes'         => 'nullable|string',
        ];
    }
}
