<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'production_order_id' => $this->production_order_id,
            'date'                => $this->date?->format('Y-m-d'),
            'shift'               => $this->shift,
            'produced_quantity'   => $this->produced_quantity,
            'notes'               => $this->notes,
            'user'                => $this->whenLoaded('user', fn() => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ]),
            'created_at'          => $this->created_at?->toISOString(),
        ];
    }
}
