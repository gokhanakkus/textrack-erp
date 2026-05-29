<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id'     => 'required|exists:products,id',
            'fabric_type'    => 'required|string|max:100',
            'color'          => 'required|string|max:100',
            'quantity_meter' => 'required|numeric|min:0',
            'critical_level' => 'required|numeric|min:0',
        ];
    }
}
