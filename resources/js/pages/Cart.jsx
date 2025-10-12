import React, { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaymentForm from './PaymentForm';

// Utilidad de formato de precio (podría moverse a un archivo de utils)
const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
    }).format(numericPrice);
};

export default function Cart({ auth, initialCartItems, success }) {
    const [cartItems, setCartItems] = useState(initialCartItems || []);
    const [message, setMessage] = useState(success ? { type: 'success', text: success } : null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Calcular totales
    const { subtotal, tax, total } = React.useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = 0.15;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        
        return { subtotal, tax, total };
    }, [cartItems]);

    // Actualizar cantidad con validación de stock
    const updateQuantity = useCallback((id, change) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + change);
                    
                    if (item.stock && newQty > item.stock) {
                        setMessage({ 
                            type: 'warning', 
                            text: `Stock insuficiente. Máximo disponible: ${item.stock}` 
                        });
                        return { ...item, quantity: item.stock };
                    }
                    
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    }, []);

    // Eliminar producto del carrito
    const removeItem = useCallback((id) => {
        const itemToRemove = cartItems.find(item => item.id === id);
        setCartItems(prev => prev.filter(item => item.id !== id));
        setMessage({ 
            type: 'warning', 
            text: `"${itemToRemove?.name}" eliminado del carrito.` 
        });
    }, [cartItems]);

    // Procesar checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            setMessage({ type: 'warning', text: 'Tu carrito está vacío.' });
            return;
        }

        // Verificar stock antes de proceder al pago
        const outOfStockItems = cartItems.filter(item => item.stock < item.quantity);
        if (outOfStockItems.length > 0) {
            setMessage({ 
                type: 'error', 
                text: `Algunos productos no tienen suficiente stock disponible.` 
            });
            return;
        }

        setIsCheckingOut(true);
        setMessage(null);
    };

    // Manejar completación del pago
// En el handlePaymentComplete del Cart.jsx, actualiza esta parte:
const handlePaymentComplete = useCallback((success, paymentMethod) => {
    setIsCheckingOut(false);
    
    if (success) {
        router.post(route('cart.purchase'), { 
            items: cartItems,
            payment_method: paymentMethod,
            total: total
        }, {
            onSuccess: () => {
                setCartItems([]);
                setOrderDetails({
                    orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
                    total: formatPrice(total),
                    paymentMethod: paymentMethod,
                    date: new Date().toLocaleDateString('es-MX')
                });
                setShowSuccessModal(true);
            },
            onError: (errors) => {
                const errorMsg = errors?.message || 
                               errors?.response?.data?.message || 
                               'Error al procesar el pedido. Por favor, intenta nuevamente.';
                setMessage({ type: 'error', text: errorMsg });
            }
        });
    } else {
        setMessage({ 
            type: 'error', 
            text: paymentMethod === 'paypal' 
                ? 'Error en la autenticación de PayPal. Verifica tus credenciales.'
                : 'Tarjeta rechazada. Verifica los datos o intenta con otra tarjeta.'
        });
    }
}, [cartItems, total]);g

    // Auto-ocultar mensajes
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (isCheckingOut) {
        return (
            <PaymentForm
                auth={auth}
                total={total}
                onPaymentComplete={handlePaymentComplete}
                onCancel={() => setIsCheckingOut(false)}
            />
        );
    }

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">🛒 Carrito de Compras</h2>}
        >
            <Head title="Carrito de Compras" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">
                        {/* Mensajes del sistema */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg font-semibold ${
                                message.type === 'success' 
                                    ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-200'
                                    : message.type === 'warning' 
                                    ? 'bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200'
                                    : 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-4">
                                    Tu carrito está vacío
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 mb-6">
                                    Agrega algunos productos para comenzar a comprar
                                </p>
                                <a 
                                    href={route('products.index')} 
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Continuar comprando
                                </a>
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Lista de productos */}
                                <div className="lg:w-2/3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Productos ({cartItems.length})
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatPrice(item.price)} c/u
                                                    </p>
                                                    {item.stock && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            Stock disponible: {item.stock}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        disabled={item.stock && item.quantity >= item.stock}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                
                                                <div className="w-24 text-right">
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                                    title="Eliminar producto"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resumen del pedido */}
                                <div className="lg:w-1/3">
                                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-inner sticky top-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Resumen del pedido
                                        </h3>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                <span>Subtotal:</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                <span>IVA (15%):</span>
                                                <span>{formatPrice(tax)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3 text-gray-900 dark:text-white">
                                                <span>Total:</span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={handleCheckout}
                                            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                        >
                                            Proceder al pago
                                        </button>
                                        
                                        <a 
                                            href={route('products.index')} 
                                            className="w-full mt-3 py-2 text-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-200 block"
                                        >
                                            Continuar comprando
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}