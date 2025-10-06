import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion, canLogin, canRegister }) {
    const backgroundImageUrl = 'img/fondo.png';
    const ludwingImageUrl = 'img/ludwing.png';
    const enriqueImageUrl = 'img/enrique.jpeg';

    return (
        <>
            <Head title="Bienvenido" />

            {/* 1. CONTENEDOR PRINCIPAL CON LA IMAGEN DE FONDO */}
            <div
                className="relative min-h-screen flex flex-col justify-center items-center"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    // Alineamos el fondo a la parte INFERIOR para ver el nombre de la empresa
                    backgroundPosition: 'bottom',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* CAPA OSCURA (OVERLAY): Proporciona contraste para el texto blanco */}
                <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

                {/* 2. SECCIÓN SUPERIOR: Navegación/Login/Register */}
                {/* Z-50 asegura que sea la capa más alta y los enlaces sean clicables */}
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right z-50">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-white hover:text-indigo-400 focus:outline focus:outline-2 focus:rounded-sm focus:outline-indigo-500 transition duration-150"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded transition duration-150 mr-4"
                            >
                                Iniciar Sesión
                            </Link>

                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="font-bold text-indigo-400 border border-indigo-400 hover:bg-indigo-900 px-4 py-2 rounded transition duration-150"
                                >
                                    Registrarse
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* 3. CONTENIDO CENTRAL DE BIENVENIDA */}
                <main className="flex justify-center items-center pt-12 pb-6 z-10 w-full">
                    {/* Contenedor compacto (max-w-xl) con fondo blanco semitransparente */}
                    <div className="max-w-xl mx-auto p-2 bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl text-center">

                        {/* Logo o Icono de la Tienda */}
                        <header className="mb-10">
                            <div className="flex justify-center mb-2">
                                {/* SVG Placeholder del Logo */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="88"
                                    height="88"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#5A67D8"
                                    stroke-width="1"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M3 21l18 0" />
                                    <path d="M5 21v-14l8 -4v18" />
                                    <path d="M19 21v-10l-6 -4" />
                                    <path d="M9 9l0 .01" />
                                    <path d="M9 12l0 .01" />
                                    <path d="M9 15l0 .01" />
                                    <path d="M9 18l0 .01" />
                                </svg>
                            </div>

                            {/* Título */}
                            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                                Bienvenido a Nuestro Sistema de Inventario
                            </h1>

                            <div className="flex justify-center">
                                <img 
                                    src="img/SteelHZ.png" 
                                    alt="Gráfico de inventario o bienvenida"
                                    className="w-80 h-30 object-contain transition duration-200 transform hover:rotate-12"
                                />
                            </div>

                            {/* Descripción */}
                            <p className="text-ls text-gray-600 max-w-prose mx-auto">
                                Gestión de productos, precios e inventario de manera eficiente. Inicia sesión para acceder a todas las herramientas de tu tienda.
                            </p>
                        </header>

                        {/* SECCIÓN INFERIOR: Desarrolladores */}
                        <footer className="mt-12 pt-6 border-t border-gray-200">
                            <h3 className="text-md font-semibold text-gray-700 mb-4">
                                Desarrollado por:
                            </h3>
                            <div className="flex justify-center space-x-6">

                                {/* Desarrollador 1: Ludwing Mauricio */}
                                <div className="text-center">
                                    <img
                                        src={ludwingImageUrl}
                                        alt="Ludwing Mauricio"
                                        className="w-14 h-14 rounded-full mx-auto mb-2 object-cover border-2 border-indigo-500 shadow-md transition duration-200 transform hover:-translate-y-1"
                                    />
                                    <p className="text-sm font-medium text-gray-800">Ludwing Mauricio</p>
                                    <a href="https://github.com/LudwingHA" target="_blank" className="text-xs text-indigo-500 hover:text-indigo-700">GitHub</a>
                                </div>

                                {/* Desarrollador 2: Enrique Ortega */}
                                <div className="text-center">
                                    <img
                                        src={enriqueImageUrl}
                                        alt="Enrique Ortega"
                                        className="w-14 h-14 rounded-full mx-auto mb-2 object-cover border-2 border-indigo-500 shadow-md transition duration-200 transform hover:-translate-y-1"
                                    />
                                    <p className="text-sm font-medium text-gray-800">Enrique Ortega</p>
                                    <a href="https://github.com/Steel115" target="_blank" className="text-xs text-indigo-500 hover:text-indigo-700">GitHub</a>
                                </div>
                            </div>
                        </footer>

                    </div>
                </main>
            </div>
        </>
    );
}