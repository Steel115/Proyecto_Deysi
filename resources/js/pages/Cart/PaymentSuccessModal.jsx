import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

const PaymentSuccessModal = ({ isOpen, onClose, orderDetails }) => {
    const [progress, setProgress] = useState(100);
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (isOpen) {
            let timer;
            let progressTimer;
            
            // Timer para la redirección
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        clearInterval(progressTimer);
                        router.get(route('dashboard'));
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Timer para la barra de progreso
            progressTimer = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(progressTimer);
                        return 0;
                    }
                    return prev - 20; // 100% / 5 segundos = 20% por segundo
                });
            }, 1000);

            return () => {
                clearInterval(timer);
                clearInterval(progressTimer);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo con overlay animado */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 animate-fade-in"
                onClick={onClose}
            />
            
            {/* Modal con animación */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-500 scale-95 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-10">
                
                {/* Icono de éxito con animaciones */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <svg 
                                className="w-12 h-12 text-white animate-scale-in" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                        {/* Efecto de pulso exterior */}
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Contenido del modal */}
                <div className="pt-16 pb-6 px-6 text-center">
                    {/* Título y mensaje */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">
                        ¡Pago Exitoso!
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in delay-100">
                        Tu pedido ha sido procesado correctamente. Serás redirigido automáticamente.
                    </p>

                    {/* Detalles del pedido */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 animate-slide-in-up">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">Número de orden:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    #{orderDetails?.orderNumber || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">Método de pago:</span>
                                <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                    {orderDetails?.paymentMethod === 'paypal' ? 'PayPal' : 'Tarjeta de Crédito'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">Total pagado:</span>
                                <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                    {orderDetails?.total || '$0.00'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {orderDetails?.date || new Date().toLocaleDateString('es-MX')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contador de redirección */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6 animate-pulse">
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Redirigiendo en {timeLeft} segundo{timeLeft !== 1 ? 's' : ''}...
                        </p>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
                        <div 
                            className="h-2 bg-green-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-3 animate-fade-in delay-300">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            Ver detalles
                        </button>
                        <button
                            onClick={() => router.get(route('dashboard'))}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center font-semibold"
                        >
                            Ir al Dashboard
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Mensaje adicional */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 animate-fade-in delay-500">
                        Recibirás un correo de confirmación con los detalles de tu compra.
                    </p>
                </div>

                {/* Decoración de esquina */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 transform rotate-45 translate-x-4 -translate-y-4"></div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;