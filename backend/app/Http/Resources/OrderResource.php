<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'customer_name'    => $this->customer_name,
            'product_type'     => $this->product_type,
            'color'            => $this->color,
            'size'             => $this->size,
            'quantity'         => $this->quantity,
            'delivery_date'    => $this->delivery_date?->format('Y-m-d'),
            'status'           => $this->status,
            'notes'            => $this->notes,
            'user'             => new UserResource($this->whenLoaded('user')),
            'production_order' => new ProductionOrderResource($this->whenLoaded('productionOrder')),
            'created_at'       => $this->created_at?->toISOString(),
            'updated_at'       => $this->updated_at?->toISOString(),
        ];
    }
}
