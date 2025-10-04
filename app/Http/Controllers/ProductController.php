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
        // Obtiene todos los productos y los pasa a la vista de Inertia
        return Inertia::render('Products/Index', [
            // Usamos ::all() por simplicidad, pero se recomienda ::paginate() para proyectos grandes
            'products' => Product::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource (CREATE Form).
     */
    public function create()
    {
        // Renderiza el componente de React del formulario de creación
        return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage (CREATE Logic).
     */
    public function store(Request $request)
    {
        // 1. VALIDACIÓN
        $validated = $request->validate([
            // La validación solo incluye los campos que existen en la DB
            'description' => 'required|string|max:1000',
            // El precio debe ser un número mayor o igual a cero
            'price' => 'required|numeric|min:0.01', 
        ]);

        // 2. GUARDAR
        Product::create($validated); 

        // 3. REDIRECCIÓN
        // Redirige al listado (products.index) con un mensaje flash de éxito.
        return redirect()->route('products.index')->with('success', 'Producto creado exitosamente.');
    }

    // Los métodos 'show', 'edit', 'update' y 'destroy' se implementarán después...
    
    public function show(Product $product) { /* ... */ }
    public function edit(Product $product) { /* ... */ }
    public function update(Request $request, Product $product) { /* ... */ }
    public function destroy(Product $product) { /* ... */ }
}