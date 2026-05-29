<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProductSeeder::class,
            StockSeeder::class,
            OrderSeeder::class,
            CustomerSeeder::class,      // Müşterileri oluştur ve siparişlere bağla
            ProductionOrderSeeder::class,
            QualityControlSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
