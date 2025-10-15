<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // Obtener órdenes del usuario autenticado con sus items y productos
        $orders = Order::with(['items.product', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [    
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                    'total' => $order->total,
                    'payment_method' => $order->payment_method,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                    'items_count' => $order->items->count(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'subtotal' => $item->price * $item->quantity,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->description,
                            ] : null
                        ];
                    })
                ];
            })
        ]);
    }

    public function show(Order $order)
    {
        // Verificar que la orden pertenezca al usuario autenticado
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product', 'user']);

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => 'ORD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                'total' => $order->total,
                'payment_method' => $order->payment_method,
                'status' => $order->status,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->price * $item->quantity,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->description,
                            'current_price' => $item->product->price,
                        ] : null
                    ];
                })
            ]
        ]);
    }
}