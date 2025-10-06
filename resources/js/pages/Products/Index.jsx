import React, { useState } from 'react'; 
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout'; 
import { Head, Link, router } from '@inertiajs/react'; 
import ConfirmationModal from '../../Components/ConfirmationModal'; 

export default function Index({ auth, products }) {
    
    // 1. ESTADOS PARA EL MODAL DE CONFIRMACIÓN
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Función para formatear el precio como moneda
    const formatPrice = (price) => {
        // Usamos el locale 'es-ES' y 'EUR' como ejemplo, ajústalo a tu moneda real si es diferente a USD
        return new Intl.NumberFormat('es-MX', { 
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
        }).format(price);
    };

    // FUNCIÓN QUE ABRE EL MODAL AL HACER CLICK EN ELIMINAR
    const handleDeleteClick = (product) => {
        setProductToDelete(product); // Guardamos el producto en el estado
        setShowDeleteModal(true);   // Mostramos el modal
    };

    // FUNCIÓN QUE SE EJECUTA AL CONFIRMAR LA ELIMINACIÓN
    const confirmDeletion = () => {
        if (productToDelete) {
            // Usamos router.delete para enviar la solicitud DELETE a Laravel/Inertia
            router.delete(route('products.destroy', productToDelete.id), {
                // Al finalizar la petición (con éxito o error), cerramos el modal
                onFinish: () => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }
                // Si quieres añadir lógica para notificaciones de éxito/error, agrégala aquí (onSuccess/onError)
            });
        }
    };
    
    // Función para cerrar el modal sin hacer nada
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
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

                                                {/* Botón de Eliminar (AHORA LLAMA A handleDeleteClick) */}
                                                <button
                                                    type="button" // Cambiamos de Link a button para evitar la navegación por defecto
                                                    onClick={() => handleDeleteClick(product)} // Llamamos a la función que muestra el modal
                                                    className="text-gray-100 bg-red-700 hover:bg-red-400 
                                                        px-3 py-1 rounded
                                                        transition duration-150"
                                                >
                                                    Eliminar
                                                </button>
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

            {/* 2. RENDERIZACIÓN DEL MODAL DE CONFIRMACIÓN */}
            <ConfirmationModal
                show={showDeleteModal}
                title="Confirmar Eliminación"
                message={`Estás a punto de eliminar el producto "${productToDelete?.description || 'este producto'}". ¿Deseas continuar?`}
                onConfirm={confirmDeletion}
                onClose={handleCloseModal}
                confirmText="Eliminar Permanentemente"
            />

        </AuthenticatedLayout>
    );
}
