<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $manager = User::where('role', 'production_manager')->first();

        $orders = [
            // Completed orders
            ['customer_name' => 'LC Waikiki A.Ş.',        'product_type' => 'T-Shirt',   'color' => 'Lacivert',   'size' => 'M',   'quantity' => 5000, 'delivery_date' => now()->subDays(30), 'status' => 'Completed', 'user_id' => $admin->id],
            ['customer_name' => 'Koton Tekstil',           'product_type' => 'Polo Shirt', 'color' => 'Beyaz',      'size' => 'L',   'quantity' => 3000, 'delivery_date' => now()->subDays(20), 'status' => 'Completed', 'user_id' => $admin->id],
            ['customer_name' => 'Mavi Giyim',              'product_type' => 'Jeans',     'color' => 'Lacivert',   'size' => '32',  'quantity' => 2000, 'delivery_date' => now()->subDays(15), 'status' => 'Completed', 'user_id' => $manager->id],
            ['customer_name' => 'Defacto Perakende',       'product_type' => 'Dress',     'color' => 'Bordo',      'size' => 'S',   'quantity' => 1500, 'delivery_date' => now()->subDays(10), 'status' => 'Completed', 'user_id' => $manager->id],
            ['customer_name' => 'H&M Türkiye',             'product_type' => 'Blouse',    'color' => 'Beyaz',      'size' => 'XS',  'quantity' => 4000, 'delivery_date' => now()->subDays(5),  'status' => 'Completed', 'user_id' => $admin->id],

            // In Production
            ['customer_name' => 'Zara Türkiye',            'product_type' => 'Jacket',    'color' => 'Siyah',      'size' => 'L',   'quantity' => 2500, 'delivery_date' => now()->addDays(15), 'status' => 'In Production', 'user_id' => $admin->id],
            ['customer_name' => 'Bershka Perakende',       'product_type' => 'Trousers',  'color' => 'Haki',       'size' => 'M',   'quantity' => 1800, 'delivery_date' => now()->addDays(20), 'status' => 'In Production', 'user_id' => $manager->id],
            ['customer_name' => 'Pull&Bear Mağazaları',    'product_type' => 'Shorts',    'color' => 'Bej',        'size' => 'XL',  'quantity' => 3500, 'delivery_date' => now()->addDays(25), 'status' => 'In Production', 'user_id' => $admin->id],
            ['customer_name' => 'Stradivarius Türkiye',    'product_type' => 'Skirt',     'color' => 'Kırmızı',    'size' => 'S',   'quantity' => 1200, 'delivery_date' => now()->addDays(18), 'status' => 'In Production', 'user_id' => $manager->id],
            ['customer_name' => 'Massimo Dutti TR',        'product_type' => 'Suit',      'color' => 'Gri',        'size' => '50',  'quantity' => 800,  'delivery_date' => now()->addDays(30), 'status' => 'In Production', 'user_id' => $admin->id],

            // Quality Control
            ['customer_name' => 'Boyner Mağazaları',       'product_type' => 'Cardigan',  'color' => 'Bej',        'size' => 'M',   'quantity' => 2200, 'delivery_date' => now()->addDays(7),  'status' => 'Quality Control', 'user_id' => $manager->id],
            ['customer_name' => 'Network Moda',            'product_type' => 'Vest',      'color' => 'Lacivert',   'size' => 'L',   'quantity' => 1600, 'delivery_date' => now()->addDays(10), 'status' => 'Quality Control', 'user_id' => $admin->id],

            // Pending
            ['customer_name' => 'Marks & Spencer TR',      'product_type' => 'Coat',      'color' => 'Siyah',      'size' => 'XXL', 'quantity' => 900,  'delivery_date' => now()->addDays(45), 'status' => 'Pending', 'user_id' => $admin->id],
            ['customer_name' => 'Tommy Hilfiger TR',       'product_type' => 'Polo Shirt', 'color' => 'Lacivert',  'size' => 'M',   'quantity' => 3000, 'delivery_date' => now()->addDays(35), 'status' => 'Pending', 'user_id' => $manager->id],
            ['customer_name' => 'Calvin Klein TR',         'product_type' => 'T-Shirt',   'color' => 'Beyaz',      'size' => 'S',   'quantity' => 4500, 'delivery_date' => now()->addDays(40), 'status' => 'Pending', 'user_id' => $admin->id],
            ['customer_name' => 'Levi\'s Türkiye',         'product_type' => 'Jeans',     'color' => 'Lacivert',   'size' => '34',  'quantity' => 2800, 'delivery_date' => now()->addDays(50), 'status' => 'Pending', 'user_id' => $manager->id],
            ['customer_name' => 'Nike Türkiye',            'product_type' => 'Shorts',    'color' => 'Siyah',      'size' => 'L',   'quantity' => 5000, 'delivery_date' => now()->addDays(28), 'status' => 'Pending', 'user_id' => $admin->id],
            ['customer_name' => 'Adidas TR',               'product_type' => 'Tracksuit', 'color' => 'Kırmızı',    'size' => 'M',   'quantity' => 2000, 'delivery_date' => now()->addDays(32), 'status' => 'Pending', 'user_id' => $manager->id],

            // Delayed
            ['customer_name' => 'Ipekyol Moda',           'product_type' => 'Evening Dress', 'color' => 'Bordo', 'size' => 'S', 'quantity' => 600, 'delivery_date' => now()->subDays(3), 'status' => 'Delayed', 'user_id' => $admin->id],
            ['customer_name' => 'Vakko Tekstil',           'product_type' => 'Suit',      'color' => 'Lacivert',   'size' => '48',  'quantity' => 400,  'delivery_date' => now()->subDays(7), 'status' => 'Delayed', 'user_id' => $manager->id],
            ['customer_name' => 'Twist Moda',              'product_type' => 'Blouse',    'color' => 'Pembe',      'size' => 'XS',  'quantity' => 1800, 'delivery_date' => now()->subDays(2), 'status' => 'Delayed', 'user_id' => $admin->id],
            ['customer_name' => 'Çiçek Tekstil',          'product_type' => 'T-Shirt',   'color' => 'Sarı',       'size' => 'M',   'quantity' => 2500, 'delivery_date' => now()->subDays(5), 'status' => 'Delayed', 'user_id' => $manager->id],
            ['customer_name' => 'Atlas Tekstil',           'product_type' => 'Trousers',  'color' => 'Siyah',      'size' => 'L',   'quantity' => 1100, 'delivery_date' => now()->subDays(1), 'status' => 'Delayed', 'user_id' => $admin->id],

            // More pending
            ['customer_name' => 'Puma TR',                 'product_type' => 'Jacket',    'color' => 'Yeşil',      'size' => 'M',   'quantity' => 1500, 'delivery_date' => now()->addDays(22), 'status' => 'Pending', 'user_id' => $manager->id],
            ['customer_name' => 'Under Armour TR',         'product_type' => 'T-Shirt',   'color' => 'Gri',        'size' => 'XL',  'quantity' => 3000, 'delivery_date' => now()->addDays(26), 'status' => 'Pending', 'user_id' => $admin->id],
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }
    }
}
