// resources/js/Pages/Products/Create.jsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        description: '',
        price: '',
        stock: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight dark:text-white">Crear Nuevo Producto</h2>}
        >
            <Head title="Crear Producto" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg p-6 dark:bg-gray-800 dark:text-white
                    ">
                        <form onSubmit={submit}>

                            {/* Campo Descripción */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-2xl font-medium text-gray-900
                                dark:text-white">Descripción</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-xl p-1
                                    dark:bg-gray-500"
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            {/* Campo Precio */}
                            <div className="mb-6">
                                <label htmlFor="price" className="block text-2xl font-medium text-gray-900 dark:text-white">Precio</label>
                                <div className="mt-1 relative rounded-md shadow-xl">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none 
                                    text-gray-700 dark:text-gray-200 text-lg font-bold">
                                        $
                                    </span>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        className="block w-full border border-gray-500 rounded-md p-3 pl-8 dark:bg-gray-500
                                        text-green-700 dark:text-green-500"
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                            </div>

                            {/*Campo Stock*/}
                            <div className="mb-6">
                                <label htmlFor="stock" className="block text-2xl font-medium text-gray-900
                                dark:text-white">Stock Inicial</label>
                                <input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-xl p-3
                                    dark:bg-gray-500"
                                    onChange={(e) => setData('stock', e.target.value)} // <-- Vinculación correcta
                                    required
                                />
                                {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
                            </div>

                            <div className="flex items-center justify-end"></div>

                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="text-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer
                                    text-white font-bold py-2 px-4 rounded transition duration-150"
                                    disabled={processing}
                                >
                                    {processing ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}