<?php

namespace App\Repositories;

use App\Models\Stock;
use Illuminate\Pagination\LengthAwarePaginator;

class StockRepository
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Stock::with('product')->latest();

        if (!empty($filters['fabric_type'])) {
            $query->where('fabric_type', $filters['fabric_type']);
        }

        if (!empty($filters['critical'])) {
            $query->whereRaw('quantity_meter < critical_level');
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('fabric_type', 'like', "%{$filters['search']}%")
                  ->orWhere('color', 'like', "%{$filters['search']}%");
            });
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): Stock
    {
        return Stock::create($data);
    }

    public function update(Stock $stock, array $data): Stock
    {
        $stock->update($data);
        return $stock->fresh(['product']);
    }

    public function delete(Stock $stock): void
    {
        $stock->delete();
    }

    public function getCriticalStocks()
    {
        return Stock::with('product')
            ->whereRaw('quantity_meter < critical_level')
            ->get();
    }
}
