<?php

namespace App\Services;

use App\Models\ProductionOrder;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Repositories\ProductionOrderRepository;

class ProductionService
{
    public function __construct(
        private ProductionOrderRepository $repo,
        private NotificationService $notificationService,
    ) {}

    public function list(array $filters)
    {
        return $this->repo->paginate($filters);
    }

    public function create(array $data): ProductionOrder
    {
        // ── Stok kontrolü ──────────────────────────────────────────
        if (!empty($data['stock_id']) && !empty($data['required_meter'])) {
            $stock = Stock::findOrFail($data['stock_id']);

            if ($stock->quantity_meter < $data['required_meter']) {
                throw new \Exception(
                    "Stok yetersiz! Mevcut: {$stock->quantity_meter}m, Gereken: {$data['required_meter']}m"
                );
            }
        }

        $data['status']              = 'Waiting';
        $data['progress_percentage'] = 0;

        $production = $this->repo->create($data);

        // ── Stoktan düş + hareket logla ────────────────────────────
        if (!empty($data['stock_id']) && !empty($data['required_meter'])) {
            $stock->decrement('quantity_meter', $data['required_meter']);

            StockMovement::create([
                'stock_id'            => $data['stock_id'],
                'production_order_id' => $production->id,
                'user_id'             => auth()->id(),
                'type'                => 'out',
                'quantity_meter'      => $data['required_meter'],
                'reason'              => "Üretim emri #{$production->id} için kullanıldı",
            ]);

            // Stok kritik seviyeye düştü mü?
            $stock->refresh();
            if ($stock->quantity_meter < $stock->critical_level) {
                $this->notificationService->create([
                    'title'   => 'Kritik Stok Uyarısı',
                    'message' => "\"{$stock->fabric_type} - {$stock->color}\" stoku kritik seviyenin altına düştü ({$stock->quantity_meter}m / {$stock->critical_level}m eşiği).",
                    'type'    => 'critical_stock',
                ]);
            }
        }

        // ── Bağlı siparişin durumunu güncelle ──────────────────────
        $production->order()->update(['status' => 'In Production']);

        return $production;
    }

    public function update(ProductionOrder $production, array $data): ProductionOrder
    {
        $production = $this->repo->update($production, $data);

        // Üretim tamamlandıysa siparişi kalite kontrole taşı
        if (isset($data['status']) && $data['status'] === 'Completed') {
            $production->order()->update(['status' => 'Quality Control']);
        }

        return $production;
    }

    public function delete(ProductionOrder $production): void
    {
        $this->repo->delete($production);
    }
}
