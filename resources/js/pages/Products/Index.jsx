import React, { useState } from 'react';
// Restaurando el alias estándar de Laravel/Inertia
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
// Restaurando el alias estándar de Laravel/Inertia
import ConfirmationModal from '@/Components/ConfirmationModal';

// El componente recibe 'auth' y 'products' (la lista de productos)
export default function Index({ auth, products }) {

    // 1. ESTADOS PARA EL MODAL DE ELIMINACIÓN
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // 2. ESTADOS PARA EL MODAL DE AGREGAR AL CARRITO
    const [showCartModal, setShowCartModal] = useState(false);
    const [productToBuy, setProductToBuy] = useState(null);

    // Función para formatear el precio como moneda
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
        }).format(price);
    };

    // --- LÓGICA PARA ELIMINAR ---

    // Abre el modal de eliminación
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    // Confirma la eliminación y llama al backend (DELETE)
    const confirmDeletion = () => {
        if (productToDelete) {
            router.delete(route('products.destroy', productToDelete.id), {
                onFinish: () => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }
            });
        }
    };

    // Función para cerrar cualquier modal sin hacer nada
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setShowCartModal(false);
        setProductToDelete(null);
        setProductToBuy(null);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight dark:text-gray-100">Gestión de Productos</h2>}
        >
            <Head title="Productos" />

            <div className="py-20">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg p-9 dark:bg-gray-800
                    ">

                        {/* Encabezado y Botón de Creación */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">Inventario de Productos</h3>

                            {/* Botón Nuevo Producto */}
                            <Link
                                href={route('products.create')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 
                                dark:indigo-600"
                            >
                                + Nuevo Producto
                            </Link>
                        </div>

                        {/* Tabla de Productos */}
                        <div className="overflow-x-auto rounded-lg ">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-indigo-200 dark:bg-gray-600 dark:text-gray-300 text-gray-900">
                                    <tr>
                                        {/* Título de la columna ID ajustado */}
                                        <th className="px-6 py-3 text-left text-xl font-medium uppercase tracking-wider">ID.CREADOR</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium uppercase tracking-wider">Imagen</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium uppercase tracking-wider">Descripción</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y dark:bg-gray-800 dark:divide-gray-700 ">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            {/* Usamos product.id_usuario en lugar de product.user_id */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                                                <span className="font-bold text-indigo-700 dark:text-white">{product.id}</span>
                                                <span className="text-gray-400">.</span>
                                                <span className="text-sm font-light text-gray-600 dark:text-white">
                                                    {product.id_usuario || '?'}
                                                </span>
                                            </td>
                                             <td className="px-6 py-4">
                <img 
                    src={product.image_url} // <-- Usamos el accesor del modelo
                    alt={product.description} 
                    className="h-16 w-16 object-cover rounded-md" 
                />
            </td>

                                            <td className="px-6 py-4 text-xl text-gray-900 max-w-lg overflow-hidden truncate font-bold transition duration-150 dark:text-white">
                                                {product.description}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xl text-green-500 dark:text-green-400">
                                                {formatPrice(product.price)}
                                            </td>
                                            {/* Columna Stock */}
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold">
                                                <span className={`px-2 py-1 inline-flex text-base leading-5 rounded-full ${
                                                    product.stock > 10 ?
                                                        'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                        product.stock > 4 ?
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                                            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' // Stock <= 0
                                                    } dark:bg-opacity-20 dark:text-opacity-100`}>
                                                    {product.stock} unidades
                                                </span>
                                            </td>

                                            {/* Columna Acciones: EDITAR y ELIMINAR */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                                                {/* --- BOTÓN EDITAR --- */}
                                                <Link
                                                    href={route('products.edit', product.id)}
                                                    className="text-gray-100 bg-indigo-700 hover:bg-indigo-800 
                                                         px-3 py-1 rounded 
                                                         mr-1 
                                                         transition duration-150 "
                                                >
                                                    Editar
                                                </Link>

                                                {/* Botón de Eliminar */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="text-gray-100 bg-red-700 hover:bg-red-800 
                                                         px-3 py-1 rounded
                                                         transition duration-150 cursor-pointer"
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

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-right dark:bg-gray-800">
                    {/* CAMBIO CLAVE: Usamos 'a' en lugar de 'Link' para forzar la descarga sin Inertia */}
                    <a
                        href={route('report.activity.download')}
                        target="_blank" // Esto ayuda a asegurar la nueva navegación
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        {/* ... SVG Icon ... */}
                        Descargar Reporte de Actividad (PDF)
                    </a>
                </div>
            </div>

            {/* 1. MODAL DE ELIMINACIÓN */}
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
