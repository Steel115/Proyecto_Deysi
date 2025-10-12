<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    // Mostrar carrito
    public function index(Request $request)
    {
        $items = $request->query('items') ? json_decode($request->query('items'), true) : [];
        return Inertia::render('Cart/Index', [
            'initialCartItems' => $items,
        ]);
    }

    // Completar la compra y disminuir stock
    public function completePurchase(Request $request)
    {
        $items = $request->input('items', []);

        if (empty($items)) {
            return response()->json([
                'success' => false,
                'message' => 'No hay productos en el carrito.'
            ], 400);
        }

        foreach ($items as $item) {
            $product = Product::find($item['id']);
            if (!$product) continue;

            if ($product->stock >= $item['quantity']) {
                $product->stock -= $item['quantity'];
                $product->save();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "Stock insuficiente para {$product->name}. Disponible: {$product->stock}"
                ], 400);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Compra completada y stock actualizado.'
        ]);
    }
}
