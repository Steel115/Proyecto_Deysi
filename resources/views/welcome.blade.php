<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bienvenido a {!! config('app.name', 'Tienda') !!}</title>

        {{-- Importa los estilos de Tailwind CSS generados por Vite --}}
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])

        {{-- Opcional: Fuente de Google Fonts --}}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    
    <body class="antialiased bg-gray-50 min-h-screen flex flex-col justify-center items-center">
        
        <div class="max-w-4xl mx-auto p-6 lg:p-8 bg-white shadow-2xl rounded-xl text-center">
            
            {{-- SECCIÓN SUPERIOR: Navegación/Login/Register --}}
            <div class="flex justify-end mb-10 border-b pb-4">
                @if (Route::has('login'))
                    <nav class="-mx-3 flex flex-1 justify-end">
                        @auth
                            {{-- Si está logueado, va al Dashboard --}}
                            <a
                                href="{{ url('/dashboard') }}"
                                class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-white dark:hover:text-white/80 dark:focus:ring-offset-gray-800"
                            >
                                Dashboard
                            </a>
                        @else
                            {{-- Botón Iniciar Sesión --}}
                            <a
                                href="{{ route('login') }}"
                                class="rounded-md px-4 py-2 text-white bg-indigo-600 font-semibold hover:bg-indigo-700 transition duration-150 mr-4"
                            >
                                Iniciar Sesión
                            </a>

                            @if (Route::has('register'))
                                {{-- Botón Registrar --}}
                                <a
                                    href="{{ route('register') }}"
                                    class="rounded-md px-4 py-2 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition duration-150"
                                >
                                    Registrarse
                                </a>
                            @endif
                        @endauth
                    </nav>
                @endif
            </div>

            {{-- SECCIÓN PRINCIPAL: Logo y Bienvenida --}}
            <header class="mb-12">
                {{-- Logo o Icono de la Tienda (Placeholder) --}}
                <div class="flex justify-center mb-6">
                    <svg class="w-20 h-20 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                </div>
                
                {{-- Título --}}
                <h1 class="text-5xl font-extrabold text-gray-900 mb-4">
                    Bienvenido a Nuestro Sistema de Inventario
                </h1>
                
                {{-- Descripción --}}
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Tu solución integral para gestionar productos, precios e inventario de manera eficiente. Inicia sesión para acceder a todas las herramientas de tu tienda.
                </p>
            </header>

            {{-- SECCIÓN INFERIOR: Desarrolladores --}}
            <footer class="mt-16 pt-8 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Desarrollado por:
                </h3>
                <div class="flex justify-center space-x-8">
                    {{-- Desarrollador 1 --}}
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-700 font-bold">JD</div>
                        <p class="text-sm font-medium text-gray-800">Jane Doe</p>
                        <a href="#" class="text-xs text-indigo-500 hover:text-indigo-700">GitHub</a>
                    </div>
                    
                    {{-- Desarrollador 2 --}}
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-700 font-bold">SM</div>
                        <p class="text-sm font-medium text-gray-800">Steven Mark</p>
                        <a href="#" class="text-xs text-indigo-500 hover:text-indigo-700">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    </body>
</html>