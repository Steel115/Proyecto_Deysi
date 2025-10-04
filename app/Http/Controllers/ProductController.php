<?php

namespace App\Http\Controllers;

use App\Models\Product; // Para interactuar con la base de datos
use Inertia\Inertia;   // Para renderizar vistas de React
use Illuminate\Http\Request; // Para manejar la petición HTTP

class ProductController extends Controller
{
    /**
     * Display a listing of the resource (READ).
     */
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Product::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource (CREATE Form).
     */
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage (CREATE Logic).
     */
    public function store(Request $request)
    {
        // 1. VALIDACIÓN
        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0.01', 
        ]);

        // 2. GUARDAR
        Product::create($validated); 

        // 3. REDIRECCIÓN
        return redirect()->route('products.index')->with('success', 'Producto creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource (UPDATE Form).
     * Pasa el objeto Producto a la vista de edición.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product, // Pasamos el producto existente
        ]);
    }

    /**
     * Update the specified resource in storage (UPDATE Logic).
     */
    public function update(Request $request, Product $product)
    {
        // 1. VALIDACIÓN
        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0.01', 
        ]);

        // 2. ACTUALIZAR
        $product->update($validated);

        // 3. REDIRECCIÓN
        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage (DELETE Logic).
     */
    public function destroy(Product $product)
    {
        // 1. ELIMINAR
        $product->delete();
        
        // 2. REDIRECCIÓN
        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente.');
    }
}