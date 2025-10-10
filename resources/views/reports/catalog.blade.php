<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Catálogo de Productos</title>
    <style>
        body { font-family: sans-serif; }
        h1 { color: #333; text-align: center; }
        .product-list { width: 100%; border-collapse: collapse; }
        .product-list th, .product-list td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>Catálogo de Productos</h1>
    
    <table class="product-list">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($products as $product)
                <tr>
                    <td>{{ $product->id }}</td>
                    <td>{{ $product->description }}</td>
                    <td>${{ number_format($product->price, 2) }}</td>
                    <td>{{ Str::limit($product->description, 50) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>