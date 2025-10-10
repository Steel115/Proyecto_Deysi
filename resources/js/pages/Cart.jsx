import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react'; // <-- Asegúrate de que Link esté aquí
import React, { useState, useEffect } from 'react';

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
export default function Cart({ auth, initialCartItems }) {
    
    // Inicializamos el estado del carrito con los ítems pasados desde el Dashboard
    // NOTA: Usar query params para el carrito es una simplificación. En producción, 
    // se usaría un Context o Firestore.
    const [cartItems, setCartItems] = useState(initialCartItems);


    // Alerta/Mensaje de simulación
    const [message, setMessage] = useState(null);

    // 1. LÓGICA DE ACTUALIZACIÓN DE CANTIDAD
    const updateQuantity = (id, change) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            ).filter(item => item.quantity > 0); // Elimina si la cantidad llega a 0
        });
        setMessage({type: 'success', text: 'Carrito actualizado.'});
    };

    // 2. LÓGICA DE ELIMINACIÓN DE PRODUCTO
    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        setMessage({type: 'warning', text: 'Producto eliminado del carrito.'});
    };

    // 3. CÁLCULO DE TOTALES
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.15; // 16% IVA
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // 4. SIMULACIÓN DE CHECKOUT
    const handleCheckout = () => {
        // Aquí iría la lógica de pago real (API call a Stripe, etc.)
        setMessage({type: 'success', text: `¡Procesando pago de ${formatPrice(total)}!`});
        setTimeout(() => {
            setCartItems([]); // Vacía el carrito después del "pago"
            setMessage({type: 'success', text: 'Pago completado y carrito vaciado.'});
        }, 3000);
    };

    // 5. EFECTO para limpiar el mensaje después de un tiempo
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    // 6. EFECTO para forzar el vaciado del carrito si Inertia navega (simulación de sesión)
    // Esto es necesario porque el estado del carrito se pasa por URL y no persiste bien entre navegaciones.
    useEffect(() => {
        // Actualiza la URL para reflejar el estado actual del carrito
        const url = route('cart.index', { items: JSON.stringify(cartItems) });
        // Reemplazamos el estado del historial para que el botón "Atrás" funcione correctamente
        window.history.replaceState(null, '', url);
    }, [cartItems]);
    


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight dark:text-gray-100">
                    🛒 Carrito de Compras
                </h2>
            }
        >
            <Head title="Carrito" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Contenedor Principal */}
                    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 lg:p-10">

                        {/* Mensaje de Notificación */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg font-semibold ${
                                message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
                                message.type === 'warning' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-blue-100 text-blue-700 border border-blue-300'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {cartItems.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-2xl text-gray-500 font-bold mb-4">
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
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                                        Productos ({cartItems.length} tipos)
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                                                
                                                {/* Detalle del Producto */}
                                                <div className="flex-grow">
                                                    <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Precio unitario: {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                {/* Control de Cantidad */}
                                                <div className="flex items-center mx-4">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-l-md p-2 font-bold transition duration-150"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-lg border-y py-1 bg-gray-50">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-r-md p-2 font-bold transition duration-150"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Subtotal por Ítem */}
                                                <div className="w-24 text-right">
                                                    <p className="font-extrabold text-gray-900">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>

                                                {/* Botón Eliminar */}
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="ml-4 text-red-500 hover:text-red-700 transition duration-150"
                                                    title="Eliminar producto"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.86 11.14a2 2 0 01-2 1.86H7.86a2 2 0 01-2-1.86L5 7m4 4v6m4-6v6m-4-6h8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Columna 2: Resumen del Pedido */}
                                <div className="lg:w-1/4 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 h-fit">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                        Resumen del Pedido
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-gray-700">
                                            <span>Subtotal:</span>
                                            <span className="font-medium">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>IVA (15%):</span>
                                            <span className="font-medium">{formatPrice(tax)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between pt-3 border-t-2 border-indigo-200">
                                            <span className="text-xl font-bold text-gray-900">Total:</span>
                                            <span className="text-xl font-bold text-indigo-600">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-150 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
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
