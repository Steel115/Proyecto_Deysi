import React, { useState, useEffect, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaymentForm from './Cart/PaymentForm';
import PaymentSuccessModal from './Cart/PaymentSuccessModal';

const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
    }).format(numericPrice);
};

export default function Cart({ auth, initialCartItems = [] }) {
    const { flash, order } = usePage().props;

    const [cartItems, setCartItems] = useState(initialCartItems);
    const [message, setMessage] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderDetails, setOrderDetails] = useState(order || null);
    const [showSuccessModal, setShowSuccessModal] = useState(!!order);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mostrar modal si viene order desde backend
    useEffect(() => {
        if (order) {
            setOrderDetails(order);
            setShowSuccessModal(true);
        }
    }, [order]);

    // Manejar flash messages de Laravel
    useEffect(() => {
        if (flash.success) {
            setMessage({ type: 'success', text: flash.success });
        } else if (flash.error) {
            setMessage({ type: 'error', text: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        setCartItems(initialCartItems);
    }, [initialCartItems]);

    const { subtotal, tax, total } = React.useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.15;
        return { subtotal, tax, total: subtotal + tax };
    }, [cartItems]);

    const updateQuantity = useCallback((id, change) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + change);
                    if (item.stock && newQty > item.stock) {
                        setMessage({ type: 'warning', text: `Stock insuficiente. Máximo disponible: ${item.stock}` });
                        return { ...item, quantity: item.stock };
                    }
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    }, []);

    const removeItem = useCallback((id) => {
        const itemToRemove = cartItems.find(item => item.id === id);
        setCartItems(prev => prev.filter(item => item.id !== id));
        setMessage({ type: 'warning', text: `"${itemToRemove?.name}" eliminado del carrito.` });
    }, [cartItems]);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            setMessage({ type: 'warning', text: 'Tu carrito está vacío.' });
            return;
        }
        const outOfStockItems = cartItems.filter(item => item.stock < item.quantity);
        if (outOfStockItems.length > 0) {
            setMessage({ type: 'error', text: `Algunos productos no tienen suficiente stock disponible.` });
            return;
        }
        setIsCheckingOut(true);
        setMessage(null);
    };

    const handlePaymentComplete = useCallback((success, paymentMethod) => {
        setIsCheckingOut(false);
        if (!success) {
            setMessage({ type: 'error', text: 'Tarjeta rechazada. Verifica los datos.' });
            return;
        }
        setIsProcessing(true);

        router.post(route('cart.completePurchase'), {
            items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
            payment_method: paymentMethod,
        }, {
            preserveScroll: true,
            onSuccess: page => {
                if (page.props.flash.success && page.props.flash.order) {
                    setOrderDetails(page.props.flash.order);
                    setShowSuccessModal(true);
                    setMessage(null);
                } else if (page.props.flash.error) {
                    setMessage({ type: 'error', text: page.props.flash.error });
                }
            },
            onError: () => setMessage({ type: 'error', text: 'Error al procesar el pedido. Por favor, intenta nuevamente.' }),
            onFinish: () => setIsProcessing(false)
        });
    }, [cartItems]);

    useEffect(() => {
        if (message && message.type !== 'success') {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (isCheckingOut) {
        return <PaymentForm auth={auth} total={total} onPaymentComplete={handlePaymentComplete} onCancel={() => setIsCheckingOut(false)} />;
    }
    return (
        <>
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
                                        {flash.success ? '¡Compra Exitosa!' : 'Tu carrito está vacío'}
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 mb-6">
                                        {flash.success 
                                            ? 'Tu pedido ha sido procesado correctamente.' 
                                            : 'Agrega algunos productos para comenzar a comprar'}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a 
                                            href={route('dashboard')} 
                                            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                        >
                                            Continuar comprando
                                        </a>
                                        <a 
                                            href={route('orders.index')} 
                                            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors duration-200"
                                        >
                                            Ver Mis Órdenes
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Lista de productos */}
                                    <div className="lg:w-2/3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Productos en el carrito ({cartItems.length})
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="flex items-center gap-4 p-4 border bg-gray-200 border-gray-600 
                                                dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200
                                                dark:bg-gray-900">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {item.name}
                                                        </p>
                                                        <img src={item.image_url || '/images/default.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                                         onError={(e) => (e.target.src = '/images/default.jpg')} />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatPrice(item.price)} c/u
                                                        </p>
                                                        {item.stock && (
                                                            <p className={`text-xs mt-1 ${
                                                                item.stock < 10 
                                                                    ? 'text-orange-500 dark:text-orange-400' 
                                                                    : 'text-green-600 dark:text-green-500'
                                                            }`}>
                                                                Stock disponible: {item.stock}
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 
                                                            rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 
                                                            disabled:cursor-not-allowed transition-colors cursor-pointer"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            disabled={item.stock && item.quantity >= item.stock}
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 
                                                            rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 
                                                            disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                                                        className="p-2 text-red-500 hover:text-red-700 
                                                        dark:hover:text-red-400 transition-colors duration-200
                                                        cursor-pointer"
                                                        title="Eliminar producto"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resumen del pedido */}
                                    <div className="lg:w-1/3">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-inner sticky top-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Resumen del pedido 📋
                                            </h3>
                                            
                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between text-gray-800 dark:text-gray-400">
                                                    <span>Productos ({cartItems.length}):</span>
                                                    <span>{formatPrice(subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sky-700">
                                                    <span>IVA (15%):</span>
                                                    <span>{formatPrice(tax)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-lg border-t border-gray-200 
                                                dark:border-gray-700 pt-3 text-green-600 dark:text-green-400">
                                                    <span>Total:</span>
                                                    <span>{formatPrice(total)}</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleCheckout}
                                                disabled={isProcessing}
                                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
                                                text-white font-semibold rounded-lg transition-colors duration-200 flex items-center 
                                                justify-center cursor-pointer"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Procesando...
                                                    </>
                                                ) : (
                                                    'Proceder al pago'
                                                )}
                                            </button>
                                            
                                            <div className="flex gap-3 mt-3">
                                                <a 
                                                    href={route('products.index')} 
                                                    className="flex-1 py-2 text-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                                                >
                                                    Seguir comprando
                                                </a>
                                                <button 
                                                    onClick={() => setCartItems([])}
                                                    className="flex-1 py-2 text-center text-red-500 hover:text-red-700 dark:text-red-400 
                                                    dark:hover:text-red-300 font-medium transition-colors duration-200 cursor-pointer"
                                                >
                                                    Limpiar carrito
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* Modal de éxito */}
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                orderDetails={orderDetails}
            />
        </>
    );
}