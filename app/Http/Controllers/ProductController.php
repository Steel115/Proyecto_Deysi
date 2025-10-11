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
    public function index()
    {
        $products = Product::where('id_usuario', auth()->id())->get();

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
        $validated = $request->validated();
        $validated['id_usuario'] = auth()->id(); 
        $product = Product::create($validated);
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'product_created',
            'related_type' => 'product',
            'related_id' => $product->id,
            'details' => 'Producto creado: ' . $product->description, 
        ]);
    
        return Redirect::route('products.index');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product, 
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:1000', 
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0', 
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Producto eliminado exitosamente.');
    }

    public function generateCatalogPdf(Request $request)
    {
        $products = Product::all();
        $pdf = Pdf::loadView('reports.catalog', compact('products'));
        return $pdf->stream('catalogo-productos.pdf');
        
    }
}       

