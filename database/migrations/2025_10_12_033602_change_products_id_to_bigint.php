<?php
// database/migrations/2025_10_12_033602_change_products_id_to_bigint.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Cambiar products.id a bigint
        Schema::table('products', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->increments('id')->change();
        });
    }
};