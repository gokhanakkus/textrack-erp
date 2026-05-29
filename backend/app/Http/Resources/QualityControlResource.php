<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QualityControlResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'production_order_id' => $this->production_order_id,
            'defect_type'         => $this->defect_type,
            'description'         => $this->description,
            'defect_quantity'     => $this->defect_quantity,
            'passed_quantity'     => $this->passed_quantity,
            'result'              => $this->result,
            'production_order'    => new ProductionOrderResource($this->whenLoaded('productionOrder')),
            'created_at'          => $this->created_at?->toISOString(),
            'updated_at'          => $this->updated_at?->toISOString(),
        ];
    }
}
