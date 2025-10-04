// resources/js/Pages/Products/Index.jsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react'; // Importamos Link para la navegación

// El componente recibe 'auth' y 'products' (la lista de productos)
export default function Index({ auth, products }) {
    
    // Función para formatear el precio como moneda
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const handleDelete = (e, productId) => {
        // Muestra un cuadro de confirmación antes de eliminar
        if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
            e.preventDefault();
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Gestión de Productos</h2>}
        >
            <Head title="Productos" />

            <div className="py-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg p-9">
                        
                        {/* Encabezado y Botón de Creación */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-3xl font-semibold text-gray-900">Inventario de Productos</h3>
                            
                            {/* Botón Nuevo Producto */}
                            <Link 
                                href={route('products.create')} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                            >
                                + Nuevo Producto
                            </Link>
                        </div>
                        
                        {/* Tabla de Productos */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg ">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-indigo-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">Descripción</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                
                                <tbody className="bg-white divide-y divide-gray-800">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">{product.id}</td>
                                            
                                            <td className="px-6 py-4 text-xl text-gray-900 max-w-lg overflow-hidden truncate">
                                                {product.description}
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">
                                                {formatPrice(product.price)}
                                            </td>
                                            
                                            {/* Columna Acciones con Editar y Eliminar */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {/* Enlace de Editar */}
                                                <Link 
                                                    href={route('products.edit', product.id)} 
                                                    className="text-gray-100 bg-indigo-700 hover:bg-blue-400 
                                                        px-3 py-1 rounded 
                                                        mr-1 
                                                        transition duration-150"
                                                >
                                                    Editar
                                                </Link>

                                                {/* Botón de Eliminar */}
                                                <Link
                                                    href={route('products.destroy', product.id)}
                                                    method="delete" // Importante: usa el método DELETE
                                                    as="button"
                                                    className="text-gray-100 bg-red-700 hover:bg-red-400 
                                                        px-3 py-1 rounded
                                                        transition duration-150"
                                                    onClick={handleDelete} // Usa la función de confirmación
                                                >
                                                    Eliminar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Mensaje si la tabla está vacía */}
                            {products.length === 0 && (
                                <p className="p-8 text-center text-gray-500">
                                    No hay productos en el inventario. ¡Crea uno nuevo!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}