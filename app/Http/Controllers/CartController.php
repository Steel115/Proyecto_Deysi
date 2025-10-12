<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->query('items') ? json_decode($request->query('items'), true) : [];
        return Inertia::render('Cart', [
            'initialCartItems' => $items,
        ]);
    }

    public function completePurchase(Request $request)
    {
        $items = $request->input('items', []);
        $paymentMethod = $request->input('payment_method', 'card');
        $total = $request->input('total', 0);

        if (empty($items)) {
            return redirect()->back()->with([
                'error' => 'No hay productos en el carrito.'
            ]);
        }

        try {
            DB::beginTransaction();

            // Verificar stock y bloquear registros para actualización
            foreach ($items as $item) {
                $product = Product::lockForUpdate()->find($item['id']);
                
                if (!$product) {
                    DB::rollBack();
                    return redirect()->back()->with([
                        'error' => "Producto no encontrado: {$item['name']}"
                    ]);
                }

                if ($product->stock < $item['quantity']) {
                    DB::rollBack();
                    return redirect()->back()->with([
                        'error' => "Stock insuficiente para {$product->name}. Disponible: {$product->stock}, Solicitado: {$item['quantity']}"
                    ]);
                }
            }

            // Crear orden
            $order = Order::create([
                'user_id' => auth()->id(),
                'total' => $total,
                'payment_method' => $paymentMethod,
                'status' => 'completed'
            ]);

            // Procesar items y actualizar stock
            foreach ($items as $item) {
                $product = Product::lockForUpdate()->find($item['id']);
                
                if (!$product) {
                    continue; // Saltar productos no encontrados
                }

                // Crear item de la orden
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'name' => $item['name']
                ]);
                $product->decrement('stock', $item['quantity']);
          
            }

            DB::commit();

            // DEBUG: Verificar stock actualizado
            \Log::info('Compra completada - Stock actualizado', [
                'order_id' => $order->id,
                'user_id' => auth()->id(),
                'items' => $items
            ]);

            return redirect()->route('cart.index')->with([
                'success' => '¡Compra completada exitosamente! Stock actualizado.',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error en completePurchase: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'items' => $items
            ]);
            
            return redirect()->back()->with([
                'error' => 'Error al procesar la compra: ' . $e->getMessage()
            ]);
        }
    }
}