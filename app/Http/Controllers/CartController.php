<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product; // Asegúrate de importar tu modelo Product
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use App\Models\ActivityLog;

class CartController extends Controller
{
    /**
     * Muestra la vista del Carrito de Compras.
     * En una app real, los items vendrían de la sesión o DB. Aquí los pasamos por la URL.
     */
    public function index(Request $request)
    {
        $items = [];
        if ($request->has('items')) {
            // Decodifica el JSON de los items del carrito enviado desde Dashboard.jsx
            $items = json_decode($request->items, true); 
        }

        return Inertia::render('Cart/Index', [
            'cartItems' => $items,
        ]);
    }

    /**
     * Procesa la compra, decrementa el stock y elimina el producto si el stock llega a 0.
     */
    public function completePurchase(Request $request)
    {
        $request->validate(['items' => 'required|json']);
        $cartItems = json_decode($request->input('items'), true);

        // 2. Procesar cada ítem y actualizar el stock
        foreach ($cartItems as $item) {
            // a. Buscar el producto por ID
            $product = Product::find($item['id']);

            if ($product) {
                // b. Verificar stock antes de procesar la compra (protección)
                if ($product->stock >= $item['quantity']) {
                    
                    // c. Decrementar el stock
                    $product->stock -= $item['quantity'];
                    
                    // d. Revisar si el stock restante es cero o menos
                    if ($product->stock <= 0) {
                        $product->delete(); // BORRAR PRODUCTO si el stock se agotó
                        // Opcional: Registrar un log de que el producto fue eliminado
                    } else {
                        $product->save(); // Guardar el nuevo stock
                    }

                }
            }
        }
        
        // 3. Redireccionar con un mensaje de éxito.
        return Redirect::route('dashboard')->with('success', 'Compra completada y stock actualizado.');
    }
}