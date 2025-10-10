<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Models\Product; 
use App\Models\User;    

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// RUTA DEL DASHBOARD MODIFICADA (Carga Global y Usuario Creador)
Route::get('/dashboard', function () {
    // 1. Obtenemos TODOS los productos y cargamos la relación 'user'.
    $products = Product::with('user:id,name')->get();
    
    return Inertia::render('Dashboard', [
        'products' => $products->map(function ($product) {
            return [
                'id' => $product->id,
                // Usamos 'description' como nombre del producto (basado en Index.jsx)
                'name' => $product->description, 
                'price' => $product->price,
                // Punto 3: Enviamos el campo correcto 'id_usuario'
                'id_usuario' => $product->id_usuario, 
                // Nombre del creador (tomado de la relación 'user')
                'user_name' => $product->user ? $product->user->name : 'Usuario Desconocido', 
            ];
        })
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/cart', function () {
        $items = request()->query('items');
        
        return Inertia::render('Cart', [
            'initialCartItems' => $items ? json_decode($items, true) : [],
        ]);
    })->name('cart.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/report/activity', [App\Http\Controllers\ReportController::class, 'activityReport'])
        ->name('report.activity.download');
    // RUTAS DEL CARRITO
    Route::get('/cart', function () {
        return Inertia::render('Cart/Index');
    })->name('cart.index');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('products', ProductController::class)
    ->middleware(['auth', 'verified']);

Route::get('/cart', function () {
        // En Inertia, recuperamos los ítems del carrito enviados como query param 
        // y los pasamos como prop a la vista Cart.jsx
        $items = request()->query('items');
        
        return Inertia::render('Cart', [
            'initialCartItems' => $items ? json_decode($items, true) : [],
        ]);
    })->name('cart.index');

require __DIR__.'/auth.php';
