<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'product_type'  => 'required|string|max:255',
            'color'         => 'required|string|max:100',
            'size'          => 'required|string|max:50',
            'quantity'      => 'required|integer|min:1',
            'delivery_date' => 'required|date',
            'notes'         => 'nullable|string',
        ];
    }
}
