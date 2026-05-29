<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductionOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id'            => 'required|exists:orders,id',
            'stock_id'            => 'nullable|exists:stocks,id',
            'required_meter'      => 'nullable|numeric|min:0.01',
            'production_line'     => 'required|string|max:100',
            'start_date'          => 'required|date',
            'end_date'            => 'nullable|date|after_or_equal:start_date',
            'progress_percentage' => 'sometimes|integer|min:0|max:100',
            'status'              => 'sometimes|in:Waiting,Running,Paused,Completed',
            'notes'               => 'nullable|string',
        ];
    }
}
