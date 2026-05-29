<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'stock_id', 'required_meter',
        'production_line', 'start_date', 'end_date',
        'progress_percentage', 'status', 'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'progress_percentage' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function productionLogs()
    {
        return $this->hasMany(ProductionLog::class)->orderBy('date')->orderBy('shift');
    }

    // Tüm loglardan toplam üretilen adet
    public function getTotalProducedAttribute(): int
    {
        return $this->productionLogs()->sum('produced_quantity');
    }

    public function qualityControls()
    {
        return $this->hasMany(QualityControl::class);
    }
}
