<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionLog extends Model
{
    protected $fillable = [
        'production_order_id', 'user_id', 'date', 'shift',
        'produced_quantity', 'notes',
    ];

    protected $casts = [
        'date'              => 'date',
        'produced_quantity' => 'integer',
    ];

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
