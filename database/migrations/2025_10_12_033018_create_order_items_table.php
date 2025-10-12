<?php
// database/migrations/2025_10_12_033018_create_order_items_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id'); // Usar bigint temporalmente
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->string('name');
            $table->timestamps();
            
            // Solo índices por ahora, NO foreign keys
            $table->index('order_id');
            $table->index('product_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_items');
    }
};