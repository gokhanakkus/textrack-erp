<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'stock_id', 'production_order_id', 'user_id',
        'type', 'quantity_meter', 'reason',
    ];

    protected $casts = [
        'quantity_meter' => 'float',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
