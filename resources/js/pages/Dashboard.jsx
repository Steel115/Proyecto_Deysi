// resources/js/Pages/Dashboard.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// El componente recibe 'auth' que contiene el usuario logueado
export default function Dashboard({ auth }) {

    // Obtenemos el nombre del usuario para el saludo personalizado
    const userName = auth.user.name;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 lg:p-8">

                        {/* 1. Mensaje de Bienvenida Personalizado */}
                        <div className="text-lg font-bold text-gray-900 mb-4">
                            ¡Hola, bienvenido de vuelta, {userName}! 👋
                        </div>

                        {/* 2. Sección Principal de Contenido del Dashboard */}
                        <div className="text-gray-700 text-ls mb-6">
                            Ve a la barra de navegación y ve a productos para agregar.
                        </div>
                        

                        {/* 3. Área para la Imagen (Placeholder) */}
                        <div className="mt-1 p-6 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center">
                            <img
                                src="/img/welcome.jpg"
                                alt="Bienvenido al Dashboard"
                                className="w-full max-w-lg sm:max-w-xl md:max-w-1xl lg:max-w-1xl rounded-lg object-contain"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}