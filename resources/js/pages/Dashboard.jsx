import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Dashboard({ auth, products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const handleDetail = (product) => {
        setSelectedProduct(product);
    };
    const closeModal = () => {
        setSelectedProduct(null);
    };

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const exists = prevItems.find(item => item.id === product.id);

            if (exists) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        // Cerramos el modal después de agregar
        closeModal();
    };


    // Función para formatear el precio como moneda (usando MXN como ejemplo)
    const formatPrice = (price) => {
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) return '$0.00';

        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
        }).format(numericPrice);
    };

    // Calculamos el número total de ítems en el carrito para el badge
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            // Agregamos el enlace y el contador del carrito al header
            header={
                <div className="flex justify-between items-center gap-3">
                    <div className="font-semibold text-2xl text-gray-800 leading-tight dark:text-gray-100">
                        Gestión de Productos
                        <div>
                            <a
                                href={route('products.catalog.pdf')}
                                target="_blank"
                                className="text-sm font-bold focus-rin bg-green-500 hover:bg-green-600
                                text-white py-1 px-1 rounded-lg"
                            >
                                Imprimir Catálogo (PDF)
                            </a>
                        </div>
                    </div>

                    {/* BOTÓN / ENLACE AL CARRITO (usando Link para Inertia) */}
                    <Link
                        href={route('cart.index', { items: JSON.stringify(cartItems) })}
                        as="button"
                        className="relative bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.25 3 12.17 3 13c0 1.657 1.343 3 3 3h10a1 1 0 000-2H6a1 1 0 010-2h10a1 1 0 00.894-.553l4-8a1 1 0 00-.93-1.447H3z" />
                        </svg>
                        Carrito
                        {/* Badge de Contador */}
                        {totalItemsInCart > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItemsInCart}
                            </span>
                        )}
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard Global" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Contenedor de las Tarjetas (Responsive Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {products.filter(product => product.stock > 0).length === 0 ? (
                            <p className="col-span-full text-center text-gray-500 text-lg py-8 bg-white shadow-xl rounded-xl">
                                No hay productos agregados en el inventario global.
                            </p>
                        ) : (products
        .filter(product => product.stock > 0)
                            .map((product) => (
                                // Tarjeta de Producto (Estilo limpio y moderno)
                                <div
                                    key={product.id}
                                    className="bg-white overflow-hidden shadow-lg rounded-xl transition duration-300 transform hover:scale-[1.02] hover:shadow-2xl border border-gray-100 flex flex-col dark:bg-blue-800 "
                                >
                                    <div className="p-6 flex flex-col flex-grow">

                                        {/* Nombre del Producto */}
                                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2 truncate dark:text-white">
                                            {product.name}
                                        </h3>

                                        {/* Precio */}
                                        <p className="text-3xl font-bold text-indigo-600 mb-4 dark:text-white">
                                            {formatPrice(product.price)}
                                        </p>

                                        {/* Información del Creador (Sección de detalle) */}
                                        <div className="text-sm border-t pt-3 mt-3 space-y-1">

                                            {/* Stock Disponible (con estilo de bloque y color condicional) */}
                                            <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                Stock Disponible:
                                                <span className={`font-mono text-xs px-2 py-0.5 ml-1 rounded font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                                            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                                    }`}>
                                                    {product.stock} unidades
                                                </span>
                                            </p>

                                            {/* ID Creador (con estilo de bloque) */}
                                            <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                ID Creador:
                                                <span className="font-mono text-xs bg-indigo-100 px-1.5 py-0.5 ml-1 rounded font-bold text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100">
                                                    {product.id_usuario}
                                                </span>
                                            </p>

                                            {/* Agregado por (user_name) */}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                                                <span className="font-semibold">Agregado por:</span>
                                                <span className="font-medium text-indigo-500 ml-1 dark:text-yellow-300">
                                                    {product.user_name}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Botón de Comprar (Abre el modal con los datos del producto) */}
                                        <div className="mt-6">
                                            <button
                                                onClick={() => handleDetail(product)} // Cambiado a handleDetail
                                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300
                                                "
                                            >
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            </div>

            {/* MODAL DE DETALLE DEL PRODUCTO */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 transition-transform transform scale-100">
                        <h2 className="text-3xl font-bold text-gray-900 border-b pb-3 mb-4 flex items-center justify-between">
                            Detalle del Producto
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </h2>

                        <div className="space-y-3">
                            <p className="text-2xl font-extrabold text-indigo-600">{selectedProduct.name}</p>
                            <p className="text-lg text-gray-700">
                                Precio: <span className="font-bold">{formatPrice(selectedProduct.price)}</span>
                            </p>
                            <p className="text-md text-gray-600 border-t pt-3">
                                <span className="font-semibold">Agregado por:</span> {selectedProduct.user_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">ID Global:</span> {selectedProduct.id}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            {/* Botón para CERRAR */}
                            <button
                                onClick={closeModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md focus:outline-none focus:ring-4 focus:ring-gray-300"
                            >
                                Cancelar
                            </button>
                            {/* Botón para AÑADIR AL CARRITO */}
                            <button
                                onClick={() => addToCart(selectedProduct)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md focus:outline-none focus:ring-4 focus:ring-green-300"
                            >
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
