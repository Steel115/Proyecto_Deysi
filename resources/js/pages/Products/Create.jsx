// resources/js/Pages/Products/Create.jsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        // Adaptamos el formulario a tu DB: solo description y price
        description: '',
        price: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Crear Nuevo Producto</h2>}
        >
            <Head title="Crear Producto" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            
                            {/* Campo Descripción */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-2xl font-medium text-gray-900">Descripción</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-xl p-3"
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>
                            
                            {/* Campo Precio */}
                            <div className="mb-6">
                                <label htmlFor="price" className="block text-2xl font-medium text-gray-900">Precio</label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    className="mt-1 block w-full border border-gray-500 rounded-md shadow-xl p-3"
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                />
                                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                            </div>
                            
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="text-xl bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded transition duration-150"
                                    disabled={processing}
                                >
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}