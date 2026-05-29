<?php

namespace App\Services;

use App\Models\Stock;
use App\Repositories\StockRepository;

class StockService
{
    public function __construct(
        private StockRepository $repo,
        private NotificationService $notificationService,
    ) {}

    public function list(array $filters)
    {
        return $this->repo->paginate($filters);
    }

    public function create(array $data): Stock
    {
        $stock = $this->repo->create($data);
        $this->checkCritical($stock);
        return $stock;
    }

    public function update(Stock $stock, array $data): Stock
    {
        $stock = $this->repo->update($stock, $data);
        $this->checkCritical($stock);
        return $stock;
    }

    public function delete(Stock $stock): void
    {
        $this->repo->delete($stock);
    }

    public function getCriticalStocks()
    {
        return $this->repo->getCriticalStocks();
    }

    private function checkCritical(Stock $stock): void
    {
        if ($stock->quantity_meter < $stock->critical_level) {
            $this->notificationService->create([
                'title'   => 'Kritik Stok Uyarısı',
                'message' => "\"{$stock->fabric_type} - {$stock->color}\" stoku kritik seviyenin altında ({$stock->quantity_meter}m / {$stock->critical_level}m eşiği).",
                'type'    => 'critical_stock',
            ]);
        }
    }
}
