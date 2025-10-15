<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Support\Facades\Redirect;
use App\Models\ActivityLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage; // ¡Importante! Asegúrate de que esté importado.
use App\Models\Category;
class ProductController extends Controller
{
    /**
     * Muestra una lista de los recursos (productos) del usuario autenticado.
     */
    public function index()
    {
        // con el ID del usuario autenticado.
        $products = Product::with('category')->where('id_usuario', auth()->id())->get();
        // Envía los productos a la vista Inertia.js (Products/Index)
        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo producto.
     */
    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::all(['id', 'name']),
        ]);

    }

    /**
     * Guarda un nuevo producto en la base de datos.
     */
    public function store(StoreProductRequest $request)
    {
        // 1. Obtener los datos validados
        $validated = $request->validated();

        // 2. Asociar la ID del usuario autenticado
        $validated['id_usuario'] = auth()->id();

        // --- LÓGICA PARA SUBIR LA IMAGEN ---
        if ($request->hasFile('image')) {
            // Guarda el archivo en 'storage/app/public/products' y obtiene la ruta.
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $path;
        }
        // --- FIN DE LA LÓGICA DE IMAGEN ---
        $request->validate([
            'category_id' => 'nullable|exists:categories,id'
        ]);
        // 3. Crear el producto
        $product = Product::create($validated);

        // LOG DE ACTIVIDAD
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

    /**
     * Muestra el formulario para editar un producto.
     */
    public function edit(Product $product)
    {
        // Se asegura que solo el creador pueda editar
        if (auth()->id() !== $product->id_usuario) {
            return redirect()->route('products.index')->with('error', 'No tienes permiso para editar este producto.');
        }

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all(['id', 'name'])
        ]);
    }

    /**
     * Actualiza un producto existente en la base de datos.
     */
    public function update(Request $request, Product $product)
    {
        // Se asegura que solo el creador pueda actualizar
        if (auth()->id() !== $product->id_usuario) {
            return redirect()->route('products.index')->with('error', 'No tienes permiso para actualizar este producto.');
        }

        // 1. VALIDACIÓN
        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'nullable|exists:categories,id', // Validación para la imagen (opcional)
        ]);

        // --- LÓGICA PARA ACTUALIZAR LA IMAGEN ---
        if ($request->hasFile('image')) {
            // Si existe una imagen anterior, la eliminamos.
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            // Subimos la nueva imagen.
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $path;
        }
        // --- FIN DE LA LÓGICA DE IMAGEN ---

        // 2. ACTUALIZAR
        $product->update($validated);

        // 3. REDIRECCIÓN
        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Elimina un producto de la base de datos.
     */
    public function destroy(Product $product)
    {
        // Se asegura que solo el creador pueda eliminar
        if (auth()->id() !== $product->id_usuario) {
            return redirect()->route('products.index')->with('error', 'No tienes permiso para eliminar este producto.');
        }

        // --- LÓGICA PARA ELIMINAR LA IMAGEN ASOCIADA ---
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        // --- FIN DE LA LÓGICA DE IMAGEN ---

        $product->delete();
        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente.');
    }

    /**
     * Genera un catálogo de productos en PDF.
     */
    public function generateCatalogPdf(Request $request)
    {
        // Solo productos del usuario autenticado
        $products = Product::where('id_usuario', auth()->id())->get();
        $pdf = Pdf::loadView('reports.catalog', compact('products'));
        return $pdf->stream('catalogo-productos.pdf');
    }
}