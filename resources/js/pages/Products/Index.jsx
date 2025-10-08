import React, { useState } from 'react'; 
// Intentamos ruta relativa completa para evitar el alias
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout'; 
import { Head, Link, router } from '@inertiajs/react'; 
// Intentamos ruta relativa completa para evitar el alias
import ConfirmationModal from '../../Components/ConfirmationModal'; 

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

    // --- NUEVA LÓGICA PARA AGREGAR AL CARRITO ---

    // Abre el modal de agregar al carrito
    // Esta función se llama ahora haciendo click en la descripción del producto.
    const handleAddToCartClick = (product) => {
        setProductToBuy(product);
        setShowCartModal(true);
    };

    // Confirma la adición al carrito (simulación)
    const confirmAddToCart = () => {
        if (productToBuy) {
            console.log(`¡PRODUCTO AGREGADO!: ${productToBuy.description} con ID ${productToBuy.id}`);
            // NOTA: Aquí iría la lógica real para guardar el producto en el carrito (ej: una petición POST).
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
                                            
                                            {/* CAMBIO CLAVE: Hacemos la descripción clickeable */}
                                            <td 
                                                className="px-6 py-4 text-xl text-gray-900 max-w-lg overflow-hidden truncate cursor-pointer hover:text-indigo-600 font-bold transition duration-150"
                                                onClick={() => handleAddToCartClick(product)} // Llamamos a la función del carrito
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

            {/* 1. MODAL DE ELIMINACIÓN */}
            <ConfirmationModal
                show={showDeleteModal}
                title="Confirmar Eliminación"
                message={`Estás a punto de eliminar el producto "${productToDelete?.description || 'este producto'}". ¿Deseas continuar?`}
                onConfirm={confirmDeletion}
                onClose={handleCloseModal}
                confirmText="Eliminar Permanentemente"
            />

            {/* 2. MODAL PARA AGREGAR AL CARRITO */}
            <ConfirmationModal
                show={showCartModal}
                title="Agregar Producto"
                message={`¿Deseas agregar "${productToBuy?.description || 'este producto'}" al carrito de compras?`}
                onConfirm={confirmAddToCart}
                onClose={handleCloseModal}
                confirmText="Agregar al Carrito"
            />

        </AuthenticatedLayout>
    );
}
