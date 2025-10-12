<?php
// database/migrations/2025_10_12_xxxxxx_add_foreign_keys_to_order_items_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Agregar foreign keys después de que products.id sea bigint
            $table->foreign('order_id')
                  ->references('id')
                  ->on('orders')
                  ->onDelete('cascade');
                  
            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);
        });
    }
};