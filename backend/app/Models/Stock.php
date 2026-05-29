<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'fabric_type', 'color', 'quantity_meter', 'critical_level'];

    protected $casts = [
        'quantity_meter' => 'decimal:2',
        'critical_level' => 'decimal:2',
    ];

    protected $appends = ['is_critical'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getIsCriticalAttribute(): bool
    {
        return $this->quantity_meter < $this->critical_level;
    }
}
