import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// El componente recibe el 'product' que le pasamos desde el controlador
export default function Edit({ auth, product }) {

    // Inicializa el formulario con los datos del producto existente
    const { data, setData, put, processing, errors } = useForm({
        description: product.description,
        price: product.price,
        stock: product.stock, // <- Nuevo campo agregado
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
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg p-6 dark:bg-gray-800">

                        <form onSubmit={submit}>
                            {/* Campo de Descripción */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-2xl font-medium text-gray-900 dark:text-white">Descripción</label>
                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-xl p-3 dark:bg-gray-500"
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <div className="text-red-500 mt-2 text-sm">{errors.description}</div>}
                            </div>

                            {/* Campo de Precio */}
                            <div className="mb-6">
                                <label htmlFor="price" className="block text-2xl font-medium text-gray-900 dark:text-white">Precio</label>
                                <div className="mt-1 relative rounded-md shadow-xl">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-200 text-lg font-bold">
                                        $
                                    </span>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}                                        
                                        className="block w-full border border-gray-500 rounded-md p-3 pl-8 dark:bg-gray-500 text-green-700 dark:text-green-500"
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                            </div>

                            {/* NUEVO CAMPO: Stock */}
                            <div className="mb-4">
                                <label htmlFor="stock" className="block text-2xl font-medium text-gray-900 dark:text-white">Stock</label>
                                <input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="stock"
                                    value={data.stock}
                                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-xl p-3 dark:bg-gray-500"
                                    onChange={(e) => setData('stock', e.target.value)}
                                />
                                {errors.stock && <div className="text-red-500 mt-2 text-sm">{errors.stock}</div>}
                            </div>

                            {/* Botón de Guardar */}
                            <div className="flex items-center justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="text-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer 
                                  text-white font-bold py-2 px-4 rounded transition duration-150 
                                    disabled:opacity-75">
                                    {processing ? 'Actualizando...' : 'Actualizar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
