<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', function (Request $request) {

    $categories = Category::all();


    $productsQuery = Product::query()->with(['user:id,name', 'category']);


    $productsQuery->when($request->input('search'), function ($query, $searchTerm) {
        $query->where(function ($subQuery) use ($searchTerm) {
            $subQuery->where('description', 'like', "%{$searchTerm}%")
                ->orWhereHas('category', function ($categoryQuery) use ($searchTerm) {
                    $categoryQuery->where('name', 'like', "%{$searchTerm}%");
                })
                ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'like', "%{$searchTerm}%");
                });
        });
    });

    $productsQuery->when($request->input('category'), function ($query, $categoryId) {
        $query->where('category_id', $categoryId);
    });

    $products = $productsQuery->paginate(12)->withQueryString();

    return Inertia::render('Dashboard', [
        'products' => $products,
        'categories' => $categories,
        'filters' => $request->only(['search', 'category']),
    ]);

})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/report/activity', [App\Http\Controllers\ReportController::class, 'activityReport'])
        ->name('report.activity.download');

    // Rutas de Carrito
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/complete-purchase', [CartController::class, 'completePurchase'])->name('cart.completePurchase');

    // Rutas de Órdenes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Ruta de Catálogo PDF
    Route::get('/products/catalog/pdf', [ProductController::class, 'generateCatalogPdf'])
        ->name('products.catalog.pdf');
});

// Rutas de tipo Resource para Productos
Route::resource('products', ProductController::class)
    ->middleware(['auth', 'verified']);

require __DIR__ . '/auth.php';