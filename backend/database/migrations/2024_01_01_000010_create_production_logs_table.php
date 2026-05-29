<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->date('date');
            $table->enum('shift', ['sabah', 'öğle', 'gece']); // 06-14 / 14-22 / 22-06
            $table->unsignedInteger('produced_quantity');       // o vardiyada üretilen adet
            $table->text('notes')->nullable();
            $table->timestamps();

            // Aynı üretim emri + tarih + vardiya kombinasyonu tekrar girilemez
            $table->unique(['production_order_id', 'date', 'shift']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_logs');
    }
};
