<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'product_id'     => $this->product_id,
            'fabric_type'    => $this->fabric_type,
            'color'          => $this->color,
            'quantity_meter' => (float) $this->quantity_meter,
            'critical_level' => (float) $this->critical_level,
            'is_critical'    => $this->is_critical,
            'product'        => new ProductResource($this->whenLoaded('product')),
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}
