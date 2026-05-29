<?php

namespace App\Services;

use App\Models\ProductionLog;
use App\Models\ProductionOrder;

class ProductionLogService
{
    /**
     * Belirtilen üretim emrinin tüm vardiya kayıtlarını getir.
     */
    public function getForOrder(ProductionOrder $production): \Illuminate\Database\Eloquent\Collection
    {
        return $production->productionLogs()->with('user')->get();
    }

    /**
     * Yeni vardiya kaydı ekle ve ilerlemeyi otomatik güncelle.
     */
    public function create(ProductionOrder $production, array $data): ProductionLog
    {
        $data['production_order_id'] = $production->id;
        $data['user_id']             = auth()->id();

        $log = ProductionLog::create($data);

        $this->recalculateProgress($production);

        return $log->load('user');
    }

    /**
     * Vardiya kaydını güncelle ve ilerlemeyi yeniden hesapla.
     */
    public function update(ProductionLog $log, array $data): ProductionLog
    {
        $log->update($data);
        $this->recalculateProgress($log->productionOrder);
        return $log->fresh('user');
    }

    /**
     * Vardiya kaydını sil ve ilerlemeyi yeniden hesapla.
     */
    public function delete(ProductionLog $log): void
    {
        $production = $log->productionOrder;
        $log->delete();
        $this->recalculateProgress($production);
    }

    /**
     * Tüm logların toplamından progress_percentage hesapla.
     * Hedef: siparişteki quantity (adet).
     */
    private function recalculateProgress(ProductionOrder $production): void
    {
        $production->load('order');
        $target = $production->order?->quantity ?? 0;

        if ($target <= 0) return;

        $totalProduced = $production->productionLogs()->sum('produced_quantity');
        $percentage    = min(100, (int) round(($totalProduced / $target) * 100));

        $production->update(['progress_percentage' => $percentage]);
    }
}
