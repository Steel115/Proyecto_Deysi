import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react'; // <-- Se añadió 'router'
import React, { useState } from 'react';

// Se aceptan las props 'products' (objeto paginado) y 'filters'
export default function Dashboard({ auth, products, filters }) {
    
    // Estado para el término de búsqueda, inicializado con el filtro actual
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // Estados existentes para el modal y el carrito
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
        closeModal();
    };
    const formatPrice = (price) => {
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) return '$0.00';
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
        }).format(numericPrice);
    };
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Función para manejar el envío del formulario de búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('dashboard'), { search: searchTerm }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center gap-3">
                    <div className="font-semibold text-2xl text-gray-800 leading-tight dark:text-gray-100">
                        Gestión de Productos
                        <div>
                            <a
                                href={route('products.catalog.pdf')}
                                target="_blank"
                                className="text-sm font-bold focus-rin bg-green-500 hover:bg-green-600 text-white py-1 px-1 rounded-lg"
                            >
                                Imprimir Catálogo (PDF)
                            </a>
                        </div>
                    </div>
                    <Link
                        href={route('cart.index', { items: JSON.stringify(cartItems) })}
                        as="button"
                        className="relative bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-md flex items-center cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.25 3 12.17 3 13c0 1.657 1.343 3 3 3h10a1 1 0 000-2H6a1 1 0 010-2h10a1 1 0 00.894-.553l4-8a1 1 0 00-.93-1.447H3z" />
                        </svg>
                        Carrito
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
                    
                    {/* --- INPUT DE BÚSQUEDA --- */}
                    <div className="mb-8">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por producto, categoría o usuario..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            />
                        </form>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* IMPORTANTE: Se usa 'products.data' para mapear los resultados */}
                        {products.data.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 text-lg py-10 bg-white shadow-xl rounded-xl dark:bg-gray-800 dark:text-gray-400">
                                No se encontraron productos.
                            </div>
                        ) : (
                            products.data.map((product) => (
                                <div key={product.id} className="bg-white overflow-hidden shadow-lg rounded-xl transition duration-300 transform hover:scale-[1.02] hover:shadow-2xl border border-gray-200 flex flex-col dark:bg-gray-800 dark:border-gray-700">
                                    <img
                                        src={product.image_url}
                                        alt={product.description}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6 flex flex-col flex-grow">
                                        {product.category && (
                                            <span className="mb-2 self-start text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                {product.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate dark:text-gray-100">
                                            {product.description}
                                        </h3>
                                        <p className="text-2xl font-bold text-green-600 mb-4 dark:text-green-400">
                                            {formatPrice(product.price)}
                                        </p>
                                        <div className="text-sm border-t pt-3 mt-auto space-y-2 dark:border-gray-700">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                Stock: <span className="font-bold text-gray-900 dark:text-white">{product.stock}</span> unidades
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Vendido por: <span className="font-medium text-indigo-500 dark:text-cyan-400">{product.user.name}</span>
                                            </p>
                                        </div>
                                        <div className="mt-6">
                                            <button
                                                onClick={() => handleDetail(product)}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-150 shadow-md"
                                            >
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* --- ENLACES DE PAGINACIÓN --- */}
                    <div className="mt-10 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'}
                                        ${!link.url ? 'cursor-not-allowed opacity-50' : ''}
                                    `}
                                />
                            ))}
                        </nav>
                    </div>

                </div>
            </div>

            {/* Modal de Detalle (sin cambios) */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 transition-transform transform scale-100">
                        <h2 className="text-3xl font-bold text-gray-900 border-b pb-3 mb-4 flex items-center justify-between">
                            Detalle del Producto
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </h2>
                        <img src={selectedProduct.image_url} alt={selectedProduct.description} className="w-full h-64 object-cover rounded-lg mb-4" />
                        <div className="space-y-3">
                            <p className="text-2xl font-extrabold text-indigo-600">{selectedProduct.description}</p>
                            {selectedProduct.category && (
                                <p className="text-md text-gray-700">Categoría: <span className="font-bold">{selectedProduct.category.name}</span></p>
                            )}
                            <p className="text-lg text-gray-700">Precio: <span className="font-bold">{formatPrice(selectedProduct.price)}</span></p>
                            <p className="text-md text-gray-600 border-t pt-3"><span className="font-semibold">Agregado por:</span> {selectedProduct.user.name}</p>
                            <p className="text-sm text-gray-500"><span className="font-semibold">ID Global:</span> {selectedProduct.id}</p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button onClick={() => addToCart(selectedProduct)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Añadir al Carrito</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}