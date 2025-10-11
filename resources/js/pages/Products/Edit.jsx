import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// El componente recibe el 'product' que le pasamos desde el controlador
export default function Edit({ auth, product }) {
    
    // Inicializa el formulario con los datos del producto existente
    const { data, setData, put, processing, errors } = useForm({
        description: product.description,
        price: product.price,
    });

    const submit = (e) => {
        e.preventDefault();
        
        // El método 'put' es el equivalente al método HTTP PUT/PATCH de Laravel
        // Apuntamos a la ruta 'products.update' pasándole el ID del producto
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-900 leading-tight dark:text-white">Editar Producto</h2>}
        >
            <Head title="Editar Producto" />

            <div className="py-12 dark:text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg p-6 dark:bg-blue-950">
                        
                        <form onSubmit={submit}>
                            {/* Campo de Descripción */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-3xl font-medium text-gray-900 dark:text-white">Descripción</label>
                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    className="text-xl mt-1 block w-full border-gray-500 rounded-md shadow-sm dark:bg-cyan-600 "
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <div className="text-red-500 mt-2 text-sm">{errors.description}</div>}
                            </div>
                            
                            {/* Campo de Precio */}
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-3xl font-medium text-gray-900 dark:text-white">Precio</label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01" // Para permitir decimales
                                    name="price"
                                    value={data.price}
                                    className="text-xl mt-1 block w-full border-gray-500 rounded-md shadow-sm  dark:bg-cyan-600 "
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                {errors.price && <div className="text-red-500 mt-2 text-sm">{errors.price}</div>}
                            </div>

                            {/* Botón de Guardar */}
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="text-xl px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-75"
                            >
                                {processing ? 'Actualizando...' : 'Actualizar Producto'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}