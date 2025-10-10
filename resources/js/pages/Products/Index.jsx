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

    // --- LÓGICA PARA AGREGAR AL CARRITO ---

    // Abre el modal de agregar al carrito (al hacer clic en la descripción)
    const handleAddToCartClick = (product) => {
        setProductToBuy(product);
        setShowCartModal(true);
    };

    // Confirma la adición al carrito (simulación)
    const confirmAddToCart = () => {
        if (productToBuy) {
            console.log(`¡PRODUCTO AGREGADO!: ${productToBuy.description} con ID ${productToBuy.id}`);
            // Aquí iría la lógica real para guardar el producto en el carrito.
        }
        // Cerrar el modal de carrito
        setShowCartModal(false);
        setProductToBuy(null);
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
                                        {/* Título de la columna ID ajustado */}
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">ID.CREADOR</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">Descripción</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-3 text-left text-xl font-medium text-gray-900 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-800">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            {/* *** CAMBIO CLAVE AQUÍ *** */}
                                            {/* Usamos product.id_usuario en lugar de product.user_id */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                                                <span className="font-bold text-indigo-700">{product.id}</span>
                                                <span className="text-gray-400">.</span>
                                                <span className="text-sm font-light text-gray-600">
                                                    {product.id_usuario || '?'}
                                                </span>
                                            </td>
                                            {/* FIN DEL CAMBIO */}

                                            {/* Hacemos la descripción clickeable para el carrito */}
                                            <td
                                                className="px-6 py-4 text-xl text-gray-900 max-w-lg overflow-hidden truncate cursor-pointer hover:text-indigo-600 font-bold transition duration-150"
                                                onClick={() => handleAddToCartClick(product)} // Llama a la función del carrito
                                                title={`Click para agregar ${product.description} al carrito`}
                                            >
                                                {product.description}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">
                                                {formatPrice(product.price)}
                                            </td>

                                            {/* Columna Acciones: EDITAR y ELIMINAR */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                                                {/* --- BOTÓN EDITAR --- */}
                                                <Link
                                                    href={route('products.edit', product.id)}
                                                    className="text-gray-100 bg-indigo-700 hover:bg-indigo-800 
                                                         px-3 py-1 rounded 
                                                         mr-1 
                                                         transition duration-150"
                                                >
                                                    Editar
                                                </Link>

                                                {/* Botón de Eliminar */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(product)}
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
            
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-right">
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
