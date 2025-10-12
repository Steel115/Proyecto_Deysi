import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PaymentForm({ total, auth, onPaymentComplete, onCancel }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' o 'card'
    
    // Estado para PayPal
    const [paypalData, setPaypalData] = useState({
        email: '',
        password: ''
    });
    
    // Estado para Tarjeta de Crédito
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false
    });
    
    const [error, setError] = useState(null);

    const formatPrice = (price) => {
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) return '$0.00';
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
        }).format(numericPrice);
    };

    const handlePaypalInputChange = (e) => {
        const { name, value } = e.target;
        setPaypalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCardInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCardData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Formatear número de tarjeta
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        return parts.length ? parts.join(' ') : value;
    };

    // Formatear fecha de expiración
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
        }
        return v;
    };

    const validatePaypalForm = () => {
        if (!paypalData.email || !paypalData.password) {
            setError('Debes ingresar correo y contraseña de PayPal.');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(paypalData.email)) {
            setError('Por favor ingresa un correo electrónico válido.');
            return false;
        }

        if (paypalData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        return true;
    };

    const validateCardForm = () => {
        if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
            setError('Todos los campos de la tarjeta son obligatorios.');
            return false;
        }

        if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
            setError('El número de tarjeta debe tener 16 dígitos.');
            return false;
        }

        if (cardData.cvv.length !== 3) {
            setError('El CVV debe tener 3 dígitos.');
            return false;
        }

        // Validar fecha de expiración
        const [month, year] = cardData.expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (!month || !year || month < 1 || month > 12 || year < currentYear || 
            (year == currentYear && month < currentMonth)) {
            setError('La fecha de expiración no es válida.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        let isValid = false;
        
        if (paymentMethod === 'paypal') {
            isValid = validatePaypalForm();
        } else {
            isValid = validateCardForm();
        }

        if (!isValid) return;

        setIsProcessing(true);

        try {
            // Simulación de pago
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const success = Math.random() > 0.1; // 90% de éxito
                    success ? resolve() : reject(new Error(
                        paymentMethod === 'paypal' 
                            ? 'Error en la autenticación de PayPal. Verifica tus credenciales.'
                            : 'Tarjeta rechazada. Verifica los datos o intenta con otra tarjeta.'
                    ));
                }, 3000);
            });
            
            onPaymentComplete(true, paymentMethod);
        } catch (error) {
            setError(error.message);
            onPaymentComplete(false, paymentMethod);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Procesar Pago</h2>}
        >
            <Head title="Procesar Pago" />
            
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
                        {/* Resumen del pedido */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Resumen del pedido
                            </h3>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">Total a pagar:</span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatPrice(total)}
                                </span>
                            </div>
                        </div>

                        {/* Selector de método de pago */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Método de pago
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                        paymentMethod === 'paypal'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                                            P
                                        </div>
                                        <span className="font-semibold">PayPal</span>
                                    </div>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                                        paymentMethod === 'card'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                            💳
                                        </div>
                                        <span className="font-semibold">Tarjeta</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Formulario PayPal */}
                            {paymentMethod === 'paypal' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                P
                                            </div>
                                            <span className="font-semibold text-blue-800 dark:text-blue-200">
                                                Iniciar sesión en PayPal
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="paypal-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Correo electrónico
                                            </label>
                                            <input
                                                id="paypal-email"
                                                name="email"
                                                type="email"
                                                placeholder="tu@correo.com"
                                                value={paypalData.email}
                                                onChange={handlePaypalInputChange}
                                                disabled={isProcessing}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="paypal-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Contraseña
                                            </label>
                                            <input
                                                id="paypal-password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={paypalData.password}
                                                onChange={handlePaypalInputChange}
                                                disabled={isProcessing}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Formulario Tarjeta de Crédito */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                                                💳
                                            </div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                Información de la tarjeta
                                            </span>
                                        </div>

                                        <div>
                                            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Número de tarjeta
                                            </label>
                                            <input
                                                id="card-number"
                                                name="cardNumber"
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                value={formatCardNumber(cardData.cardNumber)}
                                                onChange={handleCardInputChange}
                                                disabled={isProcessing}
                                                maxLength={19}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nombre en la tarjeta
                                            </label>
                                            <input
                                                id="card-name"
                                                name="cardName"
                                                type="text"
                                                placeholder="JUAN PEREZ"
                                                value={cardData.cardName}
                                                onChange={handleCardInputChange}
                                                disabled={isProcessing}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 uppercase"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Fecha de expiración
                                                </label>
                                                <input
                                                    id="expiry-date"
                                                    name="expiryDate"
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    value={formatExpiryDate(cardData.expiryDate)}
                                                    onChange={handleCardInputChange}
                                                    disabled={isProcessing}
                                                    maxLength={5}
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    CVV
                                                </label>
                                                <input
                                                    id="cvv"
                                                    name="cvv"
                                                    type="text"
                                                    placeholder="123"
                                                    value={cardData.cvv}
                                                    onChange={handleCardInputChange}
                                                    disabled={isProcessing}
                                                    maxLength={3}
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-3">
                                            <input
                                                id="save-card"
                                                name="saveCard"
                                                type="checkbox"
                                                checked={cardData.saveCard}
                                                onChange={handleCardInputChange}
                                                disabled={isProcessing}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label htmlFor="save-card" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                                Guardar tarjeta para futuras compras
                                            </label>
                                        </div>
                                    </div>

                                    {/* Logos de tarjetas aceptadas */}
                                    <div className="flex justify-center space-x-4 opacity-60">
                                        <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                        <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-black text-xs font-bold">MC</div>
                                        <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">AX</div>
                                    </div>
                                </div>
                            )}

                            {/* Botón de pago */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando {paymentMethod === 'paypal' ? 'con PayPal' : 'tarjeta'}...
                                    </>
                                ) : `Pagar ${formatPrice(total)} ${paymentMethod === 'paypal' ? 'con PayPal' : 'con Tarjeta'}`}
                            </button>
                        </form>

                        <button
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="w-full mt-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
                        >
                            ← Volver al carrito
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}