<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\ProductionOrder;
use Illuminate\Database\Seeder;

class ProductionOrderSeeder extends Seeder
{
    public function run(): void
    {
        $lines = ['Hat-A', 'Hat-B', 'Hat-C', 'Hat-D'];

        // Completed orders → completed production orders
        $completedOrders = Order::where('status', 'Completed')->get();
        foreach ($completedOrders as $i => $order) {
            ProductionOrder::create([
                'order_id'            => $order->id,
                'production_line'     => $lines[$i % 4],
                'start_date'          => now()->subDays(rand(40, 60))->format('Y-m-d'),
                'end_date'            => $order->delivery_date->format('Y-m-d'),
                'progress_percentage' => 100,
                'status'              => 'Completed',
            ]);
        }

        // In Production orders → running production orders
        $productionOrders = Order::where('status', 'In Production')->get();
        $progresses = [65, 40, 80, 25, 55];
        foreach ($productionOrders as $i => $order) {
            ProductionOrder::create([
                'order_id'            => $order->id,
                'production_line'     => $lines[$i % 4],
                'start_date'          => now()->subDays(rand(5, 15))->format('Y-m-d'),
                'end_date'            => null,
                'progress_percentage' => $progresses[$i % count($progresses)],
                'status'              => 'Running',
            ]);
        }

        // Quality Control orders → completed production (waiting QC)
        $qcOrders = Order::where('status', 'Quality Control')->get();
        foreach ($qcOrders as $i => $order) {
            ProductionOrder::create([
                'order_id'            => $order->id,
                'production_line'     => $lines[$i % 4],
                'start_date'          => now()->subDays(rand(20, 30))->format('Y-m-d'),
                'end_date'            => now()->subDays(rand(2, 5))->format('Y-m-d'),
                'progress_percentage' => 100,
                'status'              => 'Completed',
            ]);
        }

        // Delayed orders → paused production
        $delayedOrders = Order::where('status', 'Delayed')->get();
        $pauseProgresses = [30, 45, 10, 70, 50];
        foreach ($delayedOrders as $i => $order) {
            ProductionOrder::create([
                'order_id'            => $order->id,
                'production_line'     => $lines[$i % 4],
                'start_date'          => now()->subDays(rand(15, 25))->format('Y-m-d'),
                'end_date'            => null,
                'progress_percentage' => $pauseProgresses[$i % count($pauseProgresses)],
                'status'              => 'Paused',
            ]);
        }
    }
}
