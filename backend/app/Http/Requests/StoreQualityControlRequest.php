<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQualityControlRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'production_order_id' => 'required|exists:production_orders,id',
            'defect_type'         => 'required|in:stitching_error,color_difference,torn_fabric,print_error,none',
            'description'         => 'nullable|string',
            'defect_quantity'     => 'required|integer|min:0',
            'passed_quantity'     => 'required|integer|min:0',
            'result'              => 'required|in:passed,failed,partial',
        ];
    }
}
