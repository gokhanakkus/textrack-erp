<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name', 'contact_person', 'email', 'phone',
        'city', 'address', 'tax_no',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Toplam sipariş değeri hesabı
    public function getOrderCountAttribute(): int
    {
        return $this->orders()->count();
    }
}
