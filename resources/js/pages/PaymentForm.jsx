import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Función de utilidad para formatear el precio (copiada del Cart.jsx)
const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return '$0.00'; 
    return new Intl.NumberFormat('es-MX', { 
        style: 'currency',
        currency: 'MXN', 
        minimumFractionDigits: 2,
    }).format(numericPrice);
};


export default function PaymentForm({ total, auth, onCancel }) {
    const [isProcessing, setIsProcessing] = useState(false);
    // Estados para simular la entrada de datos de PayPal
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Función que SIMULA el inicio de sesión y el proceso de pago de PayPal
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setError(null);
        
        // Simulación básica de validación
        if (!email || !password) {
            setError('Debes ingresar tu correo electrónico y contraseña de PayPal.');
            return;
        }

        setIsProcessing(true);

        // ** SIMULACIÓN DE PROCESAMIENTO Y REDIRECCIÓN **
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% de éxito en la simulación
            
            if (success) {
                // Éxito: Simula la redirección de PayPal de vuelta a la tienda
                // NOTA: Usa router.get para recargar el componente Cart.jsx
                router.get(
                    route('cart.index', { 
                        items: JSON.stringify([]), // Vacía el carrito en la URL
                        success: '¡Pago con PayPal completado! Su carrito ha sido vaciado.' // Mensaje de éxito
                    }), 
                    {}, 
                    { replace: true, preserveState: false }
                );
            } else {
                // Fallo: Se queda en el formulario y muestra un error
                setError('Error en la autenticación o pago con PayPal. Inténtalo de nuevo.');
                setIsProcessing(false);
            }
        }, 3000); // 3 segundos para simular el proceso de pago
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pagar con PayPal</h2>}
        >
            <Head title="Pagar con PayPal" />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-2xl sm:rounded-lg p-8">
                        
                        {/* Logo de PayPal simulado */}
                        <div className="flex items-center justify-center mb-6">
                             <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                                alt="PayPal Logo" 
                                className="h-10" 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.style.display = 'none';
                                    e.target.insertAdjacentHTML('afterend', '<p class="text-3xl font-extrabold text-blue-800 dark:text-blue-400">PayPal</p>');
                                }}
                            />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
                            Inicia sesión en PayPal para pagar:
                            <span className="text-blue-600 dark:text-blue-400 block text-3xl mt-2">{formatPrice(total)}</span>
                        </h3>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Campo: Correo Electrónico */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    placeholder="ejemplo@paypal.com"
                                />
                            </div>

                            {/* Campo: Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    placeholder="********"
                                />
                            </div>
                            
                            {/* Botón de Pago/Inicio de Sesión */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-3 mt-6 font-bold rounded-lg transition-colors shadow-lg flex items-center justify-center 
                                    ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800'}
                                `}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Procesando Pago...
                                    </>
                                ) : (
                                    `Pagar ahora ${formatPrice(total)}`
                                )}
                            </button>
                        </form>
                        
                    </div>
                    
                    {/* Botón para volver al carrito */}
                    <button
                        onClick={onCancel}
                        disabled={isProcessing} // Evita volver mientras procesa
                        className="mt-4 w-full text-center py-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600 font-semibold"
                    >
                        &larr; Cancelar y Volver al Carrito
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}