<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('production_orders', function (Blueprint $table) {
            $table->foreignId('stock_id')->nullable()->constrained()->onDelete('set null')->after('order_id');
            $table->decimal('required_meter', 10, 2)->nullable()->after('stock_id');
        });
    }

    public function down(): void
    {
        Schema::table('production_orders', function (Blueprint $table) {
            $table->dropForeign(['stock_id']);
            $table->dropColumn(['stock_id', 'required_meter']);
        });
    }
};
