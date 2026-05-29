<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'order_id'            => $this->order_id,
            'stock_id'            => $this->stock_id,
            'required_meter'      => $this->required_meter,
            'production_line'     => $this->production_line,
            'start_date'          => $this->start_date?->format('Y-m-d'),
            'end_date'            => $this->end_date?->format('Y-m-d'),
            'progress_percentage' => $this->progress_percentage,
            'status'              => $this->status,
            'notes'               => $this->notes,
            'order'               => new OrderResource($this->whenLoaded('order')),
            'stock'               => $this->whenLoaded('stock', fn() => [
                'id'            => $this->stock->id,
                'fabric_type'   => $this->stock->fabric_type,
                'color'         => $this->stock->color,
                'quantity_meter'=> $this->stock->quantity_meter,
            ]),
            'quality_controls'    => QualityControlResource::collection($this->whenLoaded('qualityControls')),
            'created_at'          => $this->created_at?->toISOString(),
            'updated_at'          => $this->updated_at?->toISOString(),
        ];
    }
}
