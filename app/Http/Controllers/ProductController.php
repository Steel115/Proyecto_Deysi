<?php

namespace App\Http\Controllers;
use App\Models\Product; // Para interactuar con la base de datos
use Inertia\Inertia;   // Para renderizar vistas de React
use Illuminate\Http\Request; // Para manejar la petición HTTP
use App\Http\Requests\StoreProductRequest;
use Illuminate\Support\Facades\Redirect;
use App\Models\ActivityLog;

class ProductController extends Controller
{
    /**
     * Muestra una lista de los recursos (productos) del usuario autenticado.
     */
    public function index()
    {
        // con el ID del usuario autenticado.
        $products = Product::where('id_usuario', auth()->id())->get();

        // Envía los productos a la vista Inertia.js (Products/Index)
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
        $validated['id_usuario'] = auth()->id(); 

        // 3. Crear el producto
        $product = Product::create($validated); // ¡Capturamos el objeto $product!

        // ----------------------------------------------------
        // LOG DE ACTIVIDAD: REGISTRAR LA CREACIÓN
        // ----------------------------------------------------
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'product_created',
            'related_type' => 'product',
            'related_id' => $product->id,
            // Usamos $product->description, que es un campo que sí se valida
            'details' => 'Producto creado: ' . $product->description, 
        ]);
        // ----------------------------------------------------
        
        // 4. Redireccionar con éxito
        return Redirect::route('products.index');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product, 
        ]);
    }

    /**
     * Actualiza el recurso especificado en el almacenamiento.
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
     * Elimina el recurso especificado del almacenamiento.
     */
    public function destroy(Product $product)
    {
        // 1. ELIMINAR
        $product->delete();
        
        // 2. REDIRECCIÓN
        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente.');
    }
}
