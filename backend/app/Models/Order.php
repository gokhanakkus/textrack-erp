<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'customer_id', 'customer_name', 'product_type', 'color',
        'size', 'quantity', 'delivery_date', 'status', 'notes',
        'unit_price', 'unit_cost',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'quantity'      => 'integer',
        'unit_price'    => 'decimal:2',
        'unit_cost'     => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function productionOrder()
    {
        return $this->hasOne(ProductionOrder::class);
    }
}
