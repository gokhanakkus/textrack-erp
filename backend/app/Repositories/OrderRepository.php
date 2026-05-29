<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Order::with('user')->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('customer_name', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['from'])) {
            $query->where('delivery_date', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->where('delivery_date', '<=', $filters['to']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): Order
    {
        return Order::create($data);
    }

    public function update(Order $order, array $data): Order
    {
        $order->update($data);
        return $order->fresh();
    }

    public function delete(Order $order): void
    {
        $order->delete();
    }
}
