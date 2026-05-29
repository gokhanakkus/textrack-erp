<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        $colors = ['Ham Beyaz', 'Lacivert', 'Siyah', 'Gri', 'Kırmızı', 'Haki', 'Bordo', 'Bej', 'Yeşil', 'Mavi'];

        $stocks = [
            ['product_id' => 1, 'fabric_type' => 'Cotton',    'color' => 'Ham Beyaz', 'quantity_meter' => 2500.00, 'critical_level' => 500.00],
            ['product_id' => 1, 'fabric_type' => 'Cotton',    'color' => 'Lacivert',  'quantity_meter' => 80.00,   'critical_level' => 500.00],  // CRITICAL
            ['product_id' => 2, 'fabric_type' => 'Polyester', 'color' => 'Siyah',     'quantity_meter' => 1800.00, 'critical_level' => 300.00],
            ['product_id' => 2, 'fabric_type' => 'Polyester', 'color' => 'Gri',       'quantity_meter' => 45.00,   'critical_level' => 200.00],  // CRITICAL
            ['product_id' => 3, 'fabric_type' => 'Denim',     'color' => 'Lacivert',  'quantity_meter' => 3200.00, 'critical_level' => 600.00],
            ['product_id' => 3, 'fabric_type' => 'Denim',     'color' => 'Siyah',     'quantity_meter' => 120.00,  'critical_level' => 400.00],  // CRITICAL
            ['product_id' => 4, 'fabric_type' => 'Rayon',     'color' => 'Bej',       'quantity_meter' => 950.00,  'critical_level' => 200.00],
            ['product_id' => 5, 'fabric_type' => 'Linen',     'color' => 'Haki',      'quantity_meter' => 750.00,  'critical_level' => 150.00],
            ['product_id' => 6, 'fabric_type' => 'Wool Blend','color' => 'Bordo',     'quantity_meter' => 60.00,   'critical_level' => 100.00],  // CRITICAL
            ['product_id' => 7, 'fabric_type' => 'Spandex',   'color' => 'Siyah',     'quantity_meter' => 500.00,  'critical_level' => 100.00],
            ['product_id' => 8, 'fabric_type' => 'Silk',      'color' => 'Kırmızı',   'quantity_meter' => 200.00,  'critical_level' => 50.00],
            ['product_id' => 9, 'fabric_type' => 'Fleece',    'color' => 'Gri',       'quantity_meter' => 1100.00, 'critical_level' => 250.00],
            ['product_id' => 10,'fabric_type' => 'Velvet',    'color' => 'Yeşil',     'quantity_meter' => 30.00,   'critical_level' => 80.00],   // CRITICAL
        ];

        foreach ($stocks as $stock) {
            Stock::create($stock);
        }
    }
}
