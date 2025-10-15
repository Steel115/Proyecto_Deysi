<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Hogar'],
            ['name' => 'Electrónica'],
            ['name' => 'Ropa y Accesorios'],
            ['name' => 'Alimentos y Bebidas'],
            ['name' => 'Juguetes y Juegos'],
            ['name' => 'Salud y Belleza'],
            ['name' => 'Deportes'],
        ]);
    }
}
