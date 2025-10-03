<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 1. Obtiene todos los productos de la base de datos
        // Si tienes muchos productos, usarías Product::paginate()
        $products = Product::all();

        // 2. Renderiza el componente de React (Products/Index.jsx)
        // y le pasa los datos de los productos como una "prop"
        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Esto renderizará el formulario para crear un producto
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // La lógica para guardar el nuevo producto (CRUD: Create)
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // Mostrar un producto individual
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        // Renderiza el formulario para editar un producto
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // La lógica para actualizar un producto existente (CRUD: Update)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // La lógica para eliminar un producto (CRUD: Delete)
    }
}