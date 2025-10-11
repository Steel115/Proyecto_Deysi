<?php

namespace App\Http\Controllers;
use App\Models\Product; // Para interactuar con la base de datos
use Inertia\Inertia;   // Para renderizar vistas de React
use Illuminate\Http\Request; // Para manejar la petición HTTP
use App\Http\Requests\StoreProductRequest;
use Illuminate\Support\Facades\Redirect;
use App\Models\ActivityLog;
use Barryvdh\DomPDF\Facade\Pdf;

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
        // 1. Obtener los datos validados (StoreProductRequest debe validar 'stock')
        $validated = $request->validated();

        // 2. Asociar la ID del usuario autenticado al campo 'id_usuario'
        $validated['id_usuario'] = auth()->id(); 

        // 3. Crear el producto
        $product = Product::create($validated); 

        // ----------------------------------------------------
        // LOG DE ACTIVIDAD: REGISTRAR LA CREACIÓN
        // ----------------------------------------------------
        if (class_exists(ActivityLog::class)) {
            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'product_created',
                'related_type' => 'product',
                'related_id' => $product->id,
                'details' => 'Producto creado: ' . $product->description . ' con Stock Inicial: ' . $product->stock,
            ]);
        }
    
        return Redirect::route('products.index')->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        // Se asegura que solo el creador pueda editar (Si tienes esta lógica)
        if (auth()->id() !== $product->id_usuario) {
             return redirect()->route('products.index')->with('error', 'No tienes permiso para editar este producto.');
        }

        return Inertia::render('Products/Edit', [
            'product' => $product, 
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // Se asegura que solo el creador pueda actualizar (Si tienes esta lógica)
        if (auth()->id() !== $product->id_usuario) {
             return redirect()->route('products.index')->with('error', 'No tienes permiso para actualizar este producto.');
        }
        
        // 1. VALIDACIÓN (Añadir validación de stock aquí si no usas un UpdateRequest)
        $validated = $request->validate([
            'description' => 'required|string|max:1000', 
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0', // <-- ¡CLAVE! Validar el campo stock
        ]);

        // 2. ACTUALIZAR
        $product->update($validated);

        // 3. REDIRECCIÓN
        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        // Se asegura que solo el creador pueda eliminar (Si tienes esta lógica)
        if (auth()->id() !== $product->id_usuario) {
            return redirect()->route('products.index')->with('error', 'No tienes permiso para eliminar este producto.');
        }

        $product->delete();
        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente.');
    }

    public function generateCatalogPdf(Request $request)
    {
        // Solo productos del usuario autenticado
        $products = Product::where('id_usuario', auth()->id())->get();
        $pdf = Pdf::loadView('reports.catalog', compact('products'));
        return $pdf->stream('catalogo-productos.pdf');
    }
}