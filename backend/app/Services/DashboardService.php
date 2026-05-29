<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductionOrder;
use App\Models\QualityControl;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'total_orders' => Order::count(),
            'active_orders' => Order::whereIn('status', ['Pending', 'In Production', 'Quality Control'])->count(),
            'delayed_orders' => Order::where('status', 'Delayed')->count(),
            'completed_orders' => Order::where('status', 'Completed')->count(),
            'critical_stocks' => Stock::whereRaw('quantity_meter < critical_level')->count(),
            'running_productions' => ProductionOrder::where('status', 'Running')->count(),
            'defect_rate' => $this->getDefectRate(),
            'production_efficiency' => $this->getProductionEfficiency(),
        ];
    }

    public function getWeeklyProduction(): array
    {
        $data = DB::table('production_orders')
            ->select(DB::raw('DATE(created_at) as date, COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return $data->map(fn($row) => [
            'date' => $row->date,
            'count' => $row->count,
        ])->toArray();
    }

    public function getMonthlyEfficiency(): array
    {
        $data = DB::table('production_orders')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month, AVG(progress_percentage) as efficiency'))
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))
            ->orderBy('month')
            ->get();

        return $data->map(fn($row) => [
            'month' => $row->month,
            'efficiency' => round($row->efficiency, 1),
        ])->toArray();
    }

    public function getDefectDistribution(): array
    {
        return DB::table('quality_controls')
            ->select('defect_type', DB::raw('SUM(defect_quantity) as value'))
            ->where('defect_type', '!=', 'none')
            ->groupBy('defect_type')
            ->get()
            ->map(fn($row) => [
                'name' => $row->defect_type,
                'value' => (int) $row->value,
            ])
            ->toArray();
    }

    private function getDefectRate(): float
    {
        $total = DB::table('quality_controls')
            ->sum(DB::raw('defect_quantity + passed_quantity'));
        $defects = DB::table('quality_controls')->sum('defect_quantity');
        return $total > 0 ? round(($defects / $total) * 100, 2) : 0;
    }

    private function getProductionEfficiency(): float
    {
        return round(ProductionOrder::avg('progress_percentage') ?? 0, 1);
    }
}
