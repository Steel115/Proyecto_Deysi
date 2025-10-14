<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;

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
    $products = Product::with('user:id,name')->get();
    
    return Inertia::render('Dashboard', [
        'products' => $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->description, 
                'price' => $product->price,
                'id_usuario' => $product->id_usuario, 
                'user_name' => $product->user ? $product->user->name : 'Usuario Desconocido', 
                'stock' => $product->stock,
                'image_url' => $product->image_url,
            ];
        })
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/report/activity', [App\Http\Controllers\ReportController::class, 'activityReport'])
        ->name('report.activity.download');
    
    // Rutas de Carrito
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/complete-purchase', [CartController::class, 'completePurchase'])->name('cart.completePurchase');
    
    // Rutas de Órdenes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    
    Route::get('/products/catalog/pdf', [ProductController::class, 'generateCatalogPdf'])
        ->name('products.catalog.pdf'); 
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('products', ProductController::class)
    ->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';