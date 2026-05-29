<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualityControl extends Model
{
    use HasFactory;

    protected $fillable = [
        'production_order_id', 'defect_type', 'description',
        'defect_quantity', 'passed_quantity', 'result',
    ];

    protected $casts = [
        'defect_quantity' => 'integer',
        'passed_quantity' => 'integer',
    ];

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class);
    }
}
