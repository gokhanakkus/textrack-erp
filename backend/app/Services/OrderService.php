<?php

namespace App\Services;

use App\Models\Order;
use App\Repositories\OrderRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderService
{
    public function __construct(private OrderRepository $repo) {}

    public function list(array $filters): LengthAwarePaginator
    {
        return $this->repo->paginate($filters);
    }

    public function create(array $data): Order
    {
        $data['user_id'] = auth()->id();
        $data['status'] = 'Pending';
        return $this->repo->create($data);
    }

    public function update(Order $order, array $data): Order
    {
        return $this->repo->update($order, $data);
    }

    public function delete(Order $order): void
    {
        $this->repo->delete($order);
    }

    public function markDelayed(): int
    {
        return Order::where('status', 'In Production')
            ->where('delivery_date', '<', now())
            ->update(['status' => 'Delayed']);
    }
}
