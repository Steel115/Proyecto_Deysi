<?php

namespace App\Http\Controllers;

use App\Models\Product; // Para interactuar con la base de datos
use Inertia\Inertia;   // Para renderizar vistas de React
use Illuminate\Http\Request; // Para manejar la petición HTTP
use App\Http\Requests\StoreProductRequest;
use Illuminate\Support\Facades\Redirect;

class ProductController extends Controller
{
    public function index()
    {
        // Carga todos los productos
        $products = Product::all();

        // Envía los productos a la vista Inertia.js (tu Canvas)
        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }
    
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(StoreProductRequest $request) 
    {
        // 1. Obtener los datos validados
        $validated = $request->validated();

        // 2. Asociar la ID del usuario autenticado al campo 'id_usuario'
        // ¡CORRECCIÓN! Usar 'id_usuario' para la ID del creador, NO 'id'.
        $validated['id_usuario'] = auth()->id(); 

        // 3. Crear el producto
        Product::create($validated);

        // 4. Redireccionar con éxito
        return Redirect::route('products.index');
    }

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
