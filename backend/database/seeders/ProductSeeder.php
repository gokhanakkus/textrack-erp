<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Pamuk Düz Kumaş',     'type' => 'Cotton',      'description' => '100% cotton plain weave fabric'],
            ['name' => 'Polyester Örgü',       'type' => 'Polyester',   'description' => 'High-quality polyester knit fabric'],
            ['name' => 'Denim Kumaş',          'type' => 'Denim',       'description' => 'Classic denim fabric 12oz'],
            ['name' => 'Viskon Kumaş',         'type' => 'Rayon',       'description' => 'Soft rayon viscose fabric'],
            ['name' => 'Keten Kumaş',          'type' => 'Linen',       'description' => 'Natural linen fabric'],
            ['name' => 'Yün Blend',            'type' => 'Wool Blend',  'description' => 'Wool-polyester blend for outerwear'],
            ['name' => 'Streç Kumaş',          'type' => 'Spandex',     'description' => 'Spandex elastane stretch fabric'],
            ['name' => 'İpek Kumaş',           'type' => 'Silk',        'description' => 'Luxury silk fabric'],
            ['name' => 'Polar Kumaş',          'type' => 'Fleece',      'description' => 'Soft polar fleece fabric'],
            ['name' => 'Kadife Kumaş',         'type' => 'Velvet',      'description' => 'Premium velvet fabric'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
