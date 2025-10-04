<?php

namespace Database\Seeders;

use App\Models\Product; // Importa tu modelo
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Crea 5 productos de prueba
        \App\Models\Product::create([
            'description' => 'Laptop Gamer Z100, la más rápida para desarrollo y juegos.',
            'price' => 1200.00,
        ]);

        \App\Models\Product::create([
            'description' => 'Teclado Mecánico RGB con teclas Cherry MX Brown.',
            'price' => 85.50,
        ]);

        // Y puedes agregar más productos aquí...
    }
}