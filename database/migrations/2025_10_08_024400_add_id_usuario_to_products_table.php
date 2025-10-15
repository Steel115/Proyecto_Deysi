<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Agrega la nueva columna 'id_usuario' como clave foránea, 
            // asegurándote de que sea el mismo tipo de dato que el 'id' de tu tabla 'users'.
            // Usamos after('price') para colocarla lógicamente.
            $table->unsignedBigInteger('id_usuario')->after('price')->nullable();

            // Opcional: Definir una clave foránea si la columna 'user_id' no existe
            // Si tu columna 'id' en users es un BigInt, usa esto:
            // $table->foreign('id_usuario')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Si definiste la clave foránea, descomenta la siguiente línea:
            // $table->dropForeign(['id_usuario']); 
            
            // Eliminar la columna
            $table->dropColumn('id_usuario');
        });
    }
};
