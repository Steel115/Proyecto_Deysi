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
        // Esta parte es para mostrar el carrito, la dejaremos como está
        $itemsData = $request->query('items') ? json_decode($request->query('items'), true) : [];
        $productIds = array_column($itemsData, 'id');

        $products = Product::findMany($productIds)->keyBy('id');

        $initialCartItems = [];
        foreach ($itemsData as $item) {
            if (isset($products[$item['id']])) {
                $product = $products[$item['id']];
                $initialCartItems[] = [
                    'id' => $product->id,
                    'name' => $product->description, // Aseguramos que el nombre viene de la DB
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'stock' => $product->stock,
                    'image_url' => $product->image_url,
                ];
            }
        }

        return Inertia::render('Cart', [
            'initialCartItems' => $initialCartItems,
        ]);
    }

    public function completePurchase(Request $request)
    {
        $cartItems = $request->input('items', []);
        $paymentMethod = $request->input('payment_method', 'card');

        if (empty($cartItems)) {
            return back()->with('error', 'No hay productos en el carrito.');
        }

        try {
            DB::beginTransaction();

            $totalCalculado = 0;

            foreach ($cartItems as $item) {
                // Buscamos el producto en la DB para obtener sus datos reales (precio, nombre, stock)
                $product = Product::lockForUpdate()->find($item['id']);

                // --- CAMBIO CLAVE 1: Usar el nombre del producto de la DB ---
                if (!$product) {
                    DB::rollBack();
                    // Usamos una descripción genérica ya que no tenemos el nombre
                    return back()->with('error', "Uno de los productos en tu carrito ya no existe.");
                }

                if ($product->stock < $item['quantity']) {
                    DB::rollBack();
                    // Usamos el nombre real del producto ($product->description)
                    return back()->with('error', "Stock insuficiente para {$product->description}. Disponible: {$product->stock}.");
                }
            }

            // Crear la orden (con total temporal 0)
            $order = Order::create([
                'user_id' => auth()->id(),
                'total' => 0, // Se actualizará al final
                'payment_method' => $paymentMethod,
                'status' => 'completed'
            ]);

            foreach ($cartItems as $item) {
                $product = Product::find($item['id']); // No necesita lock aquí porque ya lo validamos

                // Acumulamos el total usando el precio del servidor (más seguro)
                $totalCalculado += $product->price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price, // Usamos el precio del servidor
                    'name' => $product->description // --- CAMBIO CLAVE 2: Usar el nombre de la DB ---
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            // Actualizamos la orden con el total final calculado en el servidor
            $order->total = $totalCalculado * 1.15; // Aplicamos el IVA del 15%
            $order->save();

            DB::commit();

            // Preparamos los datos para el modal de éxito con datos reales
            $orderDataForFrontend = [
                'orderNumber' => 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                'total' => number_format($order->total, 2),
                'paymentMethod' => $order->payment_method,
                'date' => $order->created_at->format('d/m/Y'),
                'items' => count($cartItems)
            ];

            return Inertia::render('Cart', [
                'initialCartItems' => [], // carrito vacío
                'flash' => [
                    'success' => '¡Compra completada exitosamente!',
                ],
                'order' => $orderDataForFrontend, // enviamos directamente
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error en completePurchase: ' . $e->getMessage());
            return back()->with('error', 'Error al procesar la compra: ' . $e->getMessage());
        }
    }
}