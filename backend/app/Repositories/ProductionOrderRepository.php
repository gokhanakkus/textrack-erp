<?php

namespace App\Repositories;

use App\Models\ProductionOrder;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductionOrderRepository
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = ProductionOrder::with(['order', 'stock'])->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['production_line'])) {
            $query->where('production_line', $filters['production_line']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): ProductionOrder
    {
        return ProductionOrder::create($data);
    }

    public function update(ProductionOrder $production, array $data): ProductionOrder
    {
        $production->update($data);
        return $production->fresh(['order', 'stock']);
    }

    public function delete(ProductionOrder $production): void
    {
        $production->delete();
    }
}
