<?php

namespace Database\Seeders;

use App\Models\ProductionOrder;
use App\Models\QualityControl;
use Illuminate\Database\Seeder;

class QualityControlSeeder extends Seeder
{
    public function run(): void
    {
        $completedProductions = ProductionOrder::where('status', 'Completed')->get();

        $defects = [
            ['defect_type' => 'stitching_error',  'result' => 'partial', 'defect_quantity' => 12, 'passed_quantity' => 488],
            ['defect_type' => 'color_difference',  'result' => 'failed',  'defect_quantity' => 85, 'passed_quantity' => 215],
            ['defect_type' => 'none',              'result' => 'passed',  'defect_quantity' => 0,  'passed_quantity' => 1000],
            ['defect_type' => 'torn_fabric',       'result' => 'partial', 'defect_quantity' => 25, 'passed_quantity' => 975],
            ['defect_type' => 'print_error',       'result' => 'failed',  'defect_quantity' => 120,'passed_quantity' => 380],
            ['defect_type' => 'none',              'result' => 'passed',  'defect_quantity' => 0,  'passed_quantity' => 800],
            ['defect_type' => 'stitching_error',   'result' => 'partial', 'defect_quantity' => 35, 'passed_quantity' => 965],
            ['defect_type' => 'color_difference',  'result' => 'partial', 'defect_quantity' => 18, 'passed_quantity' => 482],
        ];

        foreach ($completedProductions as $i => $production) {
            $defect = $defects[$i % count($defects)];
            QualityControl::create([
                'production_order_id' => $production->id,
                'defect_type'         => $defect['defect_type'],
                'description'         => $defect['defect_type'] === 'none'
                    ? 'All units passed quality inspection.'
                    : "Found {$defect['defect_quantity']} units with {$defect['defect_type']} issue.",
                'defect_quantity'     => $defect['defect_quantity'],
                'passed_quantity'     => $defect['passed_quantity'],
                'result'              => $defect['result'],
            ]);
        }
    }
}
