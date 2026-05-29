<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quality_controls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_order_id')->constrained()->onDelete('cascade');
            $table->enum('defect_type', ['stitching_error', 'color_difference', 'torn_fabric', 'print_error', 'none'])->default('none');
            $table->text('description')->nullable();
            $table->integer('defect_quantity')->default(0);
            $table->integer('passed_quantity')->default(0);
            $table->enum('result', ['passed', 'failed', 'partial'])->default('passed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quality_controls');
    }
};
