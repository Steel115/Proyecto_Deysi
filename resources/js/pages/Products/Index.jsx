// resources/js/Pages/Products/Index.jsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// El componente recibe 'auth' (datos del usuario logueado) y 'products' (los datos del controlador)
export default function Index({ auth, products }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Productos</h2>}
        >
            <Head title="Productos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Listado de Productos</h3>

                        {/* Muestra los productos recibidos en formato JSON para verificar */}
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                            {JSON.stringify(products, null, 2)}
                        </pre>

                        {/* Aquí irá la tabla de productos más adelante */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}