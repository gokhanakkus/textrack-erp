<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller
{
    /**
     * Genel finansal özet + aylık veri.
     */
    public function stats(): JsonResponse
    {
        // Tüm siparişler (fiyat girilmiş olanlar)
        $orders = Order::whereNotNull('unit_price')
            ->whereNotNull('unit_cost')
            ->get();

        $totalRevenue = $orders->sum(fn($o) => $o->quantity * $o->unit_price);
        $totalCost    = $orders->sum(fn($o) => $o->quantity * $o->unit_cost);
        $totalProfit  = $totalRevenue - $totalCost;
        $margin       = $totalRevenue > 0
            ? round(($totalProfit / $totalRevenue) * 100, 1)
            : 0;

        // Aylık breakdown (son 12 ay)
        $monthly = Order::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw("SUM(quantity * unit_price) as revenue"),
                DB::raw("SUM(quantity * unit_cost)  as cost"),
                DB::raw("SUM(quantity * (unit_price - unit_cost)) as profit")
            )
            ->whereNotNull('unit_price')
            ->whereNotNull('unit_cost')
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'   => $r->month,
                'revenue' => round((float) $r->revenue, 2),
                'cost'    => round((float) $r->cost,    2),
                'profit'  => round((float) $r->profit,  2),
            ]);

        // Durum bazlı kâr
        $byStatus = Order::select(
                'status',
                DB::raw("SUM(quantity * unit_price) as revenue"),
                DB::raw("SUM(quantity * (unit_price - unit_cost)) as profit"),
                DB::raw("COUNT(*) as count")
            )
            ->whereNotNull('unit_price')
            ->whereNotNull('unit_cost')
            ->groupBy('status')
            ->get()
            ->map(fn($r) => [
                'status'  => $r->status,
                'revenue' => round((float) $r->revenue, 2),
                'profit'  => round((float) $r->profit,  2),
                'count'   => $r->count,
            ]);

        return response()->json([
            'summary' => [
                'total_revenue' => round($totalRevenue, 2),
                'total_cost'    => round($totalCost, 2),
                'total_profit'  => round($totalProfit, 2),
                'margin'        => $margin,
                'order_count'   => $orders->count(),
            ],
            'monthly'   => $monthly,
            'by_status' => $byStatus,
        ]);
    }

    /**
     * Sipariş bazlı kâr tablosu (sayfalı).
     */
    public function orders(): JsonResponse
    {
        $data = Order::with('customer')
            ->whereNotNull('unit_price')
            ->whereNotNull('unit_cost')
            ->orderByDesc('created_at')
            ->paginate(15);

        $items = $data->map(function (Order $o) {
            $revenue = $o->quantity * $o->unit_price;
            $cost    = $o->quantity * $o->unit_cost;
            $profit  = $revenue - $cost;
            $margin  = $revenue > 0 ? round(($profit / $revenue) * 100, 1) : 0;

            return [
                'id'            => $o->id,
                'customer_name' => $o->customer?->name ?? $o->customer_name,
                'product_type'  => $o->product_type,
                'quantity'      => $o->quantity,
                'unit_price'    => (float) $o->unit_price,
                'unit_cost'     => (float) $o->unit_cost,
                'revenue'       => round($revenue, 2),
                'cost'          => round($cost, 2),
                'profit'        => round($profit, 2),
                'margin'        => $margin,
                'status'        => $o->status,
                'delivery_date' => $o->delivery_date?->format('Y-m-d'),
            ];
        });

        return response()->json([
            'data' => $items,
            'meta' => [
                'total'        => $data->total(),
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
            ],
        ]);
    }
}
