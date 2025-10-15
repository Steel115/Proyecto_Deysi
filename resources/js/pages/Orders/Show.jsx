import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
    }).format(numericPrice);
};

export default function OrderShow({ auth, order }) {
    const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight dark:text-gray-100">Detalle de Orden</h2>}
        >
            <Head title={`Orden ${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-gray-800">
                        
                        {/* Encabezado */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Orden: {order.order_number}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Realizada el {order.created_at}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('orders.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        ← Volver a Órdenes
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Información de la orden */}
                        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400 mb-2">
                                    Información de Pago
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Método:</span>
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                                            {order.payment_method === 'paypal' ? 'PayPal' : 'Tarjeta de Crédito'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Estado:</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.status === 'completed' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {order.status === 'completed' ? 'Completada' : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400 mb-2">
                                    Resumen
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Productos:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {order.items.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Total:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de productos */}
                        <div className="px-6 py-4">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400 mb-4">
                                Productos Comprados
                            </h4>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatPrice(item.price)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span className="text-gray-900 dark:text-white">Total Pagado:</span>
                                <span className="text-green-600 dark:text-green-400 text-xl">
                                    {formatPrice(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}