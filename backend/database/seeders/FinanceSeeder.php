<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    /**
     * Mevcut siparişlere gerçekçi birim fiyat ve maliyet değerleri ata.
     * Tekstil sektörü ortalamaları baz alınmıştır:
     *   – Kumaş: 80–180 TL/adet satış, %35–55 maliyet marjı
     *   – Gömlek: 120–250 TL/adet
     *   – Ürün tipine göre farklı aralıklar
     */
    public function run(): void
    {
        $priceMap = [
            'Gömlek'   => ['min' => 120, 'max' => 220, 'margin' => [0.38, 0.52]],
            'Pantolon' => ['min' => 180, 'max' => 350, 'margin' => [0.40, 0.55]],
            'Tişört'   => ['min' => 80,  'max' => 150, 'margin' => [0.35, 0.50]],
            'Etek'     => ['min' => 140, 'max' => 260, 'margin' => [0.38, 0.52]],
            'Ceket'    => ['min' => 400, 'max' => 900, 'margin' => [0.42, 0.58]],
            'Mont'     => ['min' => 600, 'max' => 1400,'margin' => [0.44, 0.60]],
            'Kumaş'    => ['min' => 60,  'max' => 120, 'margin' => [0.30, 0.48]],
        ];

        $default = ['min' => 100, 'max' => 300, 'margin' => [0.38, 0.52]];

        Order::all()->each(function (Order $order) use ($priceMap, $default) {
            $cfg        = $priceMap[$order->product_type] ?? $default;
            $unitPrice  = rand($cfg['min'] * 100, $cfg['max'] * 100) / 100;
            $costRatio  = $cfg['margin'][0] + mt_rand(0, 100) / 100 * ($cfg['margin'][1] - $cfg['margin'][0]);
            $unitCost   = round($unitPrice * $costRatio, 2);

            $order->update([
                'unit_price' => $unitPrice,
                'unit_cost'  => $unitCost,
            ]);
        });

        $this->command->info('✅ Finance verileri eklendi: ' . Order::count() . ' sipariş güncellendi.');
    }
}
