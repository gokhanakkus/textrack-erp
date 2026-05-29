<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'contact_person' => $this->contact_person,
            'email'          => $this->email,
            'phone'          => $this->phone,
            'city'           => $this->city,
            'address'        => $this->address,
            'tax_no'         => $this->tax_no,
            'orders_count'   => $this->orders_count ?? $this->orders()->count(),
            'created_at'     => $this->created_at?->toISOString(),
        ];
    }
}
