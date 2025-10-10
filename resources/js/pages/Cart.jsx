import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm'; // <-- IMPORTAMOS EL NUEVO COMPONENTE

// Función de utilidad para formatear el precio
const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return '$0.00'; 

    return new Intl.NumberFormat('es-MX', { 
        style: 'currency',
        currency: 'MXN', 
        minimumFractionDigits: 2,
    }).format(numericPrice);
};


// Este componente recibe la prop 'initialCartItems' (que es un JSON string del carrito)
export default function Cart({ auth, initialCartItems, success }) {
    
    // 1. ESTADOS CLAVE
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [message, setMessage] = useState(success ? {type: 'success', text: success} : null);
    // NUEVO ESTADO PARA CONTROLAR LA VISTA DE PAGO
    const [isCheckingOut, setIsCheckingOut] = useState(false); 

    // 2. LÓGICA DE ACTUALIZACIÓN DE CANTIDAD
    const updateQuantity = (id, change) => {
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            ).filter(item => item.quantity > 0);
            
            // Actualizar Inertia con el nuevo estado del carrito inmediatamente
            router.get(route('cart.index', { items: JSON.stringify(newItems) }), {}, { replace: true, preserveState: true });
            return newItems;
        });
        setMessage({type: 'success', text: 'Carrito actualizado.'});
    };

    // 3. LÓGICA DE ELIMINACIÓN DE PRODUCTO
    const removeItem = (id) => {
        const newItems = cartItems.filter(item => item.id !== id);
        setCartItems(newItems);
        setMessage({type: 'warning', text: 'Producto eliminado del carrito.'});
        // Actualizar Inertia
        router.get(route('cart.index', { items: JSON.stringify(newItems) }), {}, { replace: true, preserveState: true });
    };

    // 4. CÁLCULO DE TOTALES
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.15; // 15% IVA
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // 5. LÓGICA DE CHECKOUT (SOLO ACTIVA EL FORMULARIO)
    const handleCheckout = () => {
        if (cartItems.length > 0) {
            // ** EL CAMBIO CLAVE: Cambia el estado para renderizar PaymentForm **
            setIsCheckingOut(true); 
            setMessage(null);
        } else {
            setMessage({type: 'warning', text: 'El carrito debe tener productos para proceder al pago.'});
        }
    };
    
    // 6. EFECTO para limpiar el mensaje después de un tiempo
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [message]);

    // 7. Renderizado Condicional
    if (isCheckingOut) {
        return (
            <PaymentForm 
                auth={auth} 
                total={total} 
                // Función para volver al carrito y vaciarlo al pagar
                onPaymentComplete={(success) => {
                    setIsCheckingOut(false); // Vuelve a la vista del carrito
                    if (success) {
                        setCartItems([]); // Vacía el estado local
                        // ❌ ELIMINA O COMENTA LA SIGUIENTE LÍNEA:
                        // router.get(route('cart.index', { items: JSON.stringify([]) }), {}, { replace: true, preserveState: false }); 
                        setMessage({type: 'success', text: '¡Pago completado! Su carrito ha sido vaciado.'});
                    } else {
                        setMessage({type: 'error', text: 'El pago ha sido rechazado. Intenta con otra tarjeta.'});
                    }
                }}
                onCancel={() => setIsCheckingOut(false)}
            />
        );
    }
    
    // 8. RENDERIZADO DEL CARRITO
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    🛒 Carrito de Compras
                </h2>
            }
        >
            <Head title="Carrito" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Contenedor Principal */}
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 md:p-8 lg:p-10 dark:text-gray-200">

                        {/* Mensaje de Notificación */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg font-semibold ${
                                message.type === 'success' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-600' :
                                message.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600' : 
                                message.type === 'error' ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-600' : 
                                'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-600'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {cartItems.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold mb-4">
                                    Tu carrito está vacío.
                                </p>
                                <Link 
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                >
                                    Volver al Inventario Global
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8">
                                
                                {/* Columna 1: Ítems del Carrito */}
                                <div className="lg:w-3/4">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                                        Productos ({cartItems.length} tipos)
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0 border-gray-100 dark:border-gray-700">
                                                
                                                {/* Detalle del Producto */}
                                                <div className="flex-grow">
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Precio unitario: {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                {/* Control de Cantidad */}
                                                <div className="flex items-center mx-4">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-l-md p-2 font-bold transition duration-150"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-lg border-y py-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-r-md p-2 font-bold transition duration-150"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Subtotal por Ítem */}
                                                <div className="w-24 text-right">
                                                    <p className="font-extrabold text-gray-900 dark:text-gray-100">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>

                                                {/* Botón Eliminar */}
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition duration-150"
                                                    title="Eliminar producto"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                         {/* Icono de papelera */}
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.86 11.14a2 2 0 01-2 1.86H7.86a2 2 0 01-2-1.86L5 7m4 4v6m4-6v6m-4-6h8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Columna 2: Resumen del Pedido */}
                                <div className="lg:w-1/4 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 h-fit">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">
                                        Resumen del Pedido
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                            <span>Subtotal:</span>
                                            <span className="font-medium">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                            <span>IVA ({taxRate * 100}%):</span>
                                            <span className="font-medium">{formatPrice(tax)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between pt-3 border-t-2 border-indigo-200 dark:border-indigo-800">
                                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total:</span>
                                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout} // <--- AHORA SOLO ACTIVA EL FORMULARIO DE PAGO
                                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-150 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                                    >
                                        Pagar y Confirmar
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
