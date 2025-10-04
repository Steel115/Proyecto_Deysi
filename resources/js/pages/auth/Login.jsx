import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            {/* TÍTULO DEL FORMULARIO AÑADIDO */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Acceder al Inventario
            </h1>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    {/* Aumentamos el tamaño de la etiqueta */}
                    <InputLabel htmlFor="email" value="Email" className="text-xl font-semibold text-gray-900" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full text-lg" // Aumentamos el tamaño del texto de entrada
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    {/* Aumentamos el tamaño de la etiqueta */}
                    <InputLabel htmlFor="password" value="Contraseña" className="text-xl font-semibold text-gray-800" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full text-lg" // Aumentamos el tamaño del texto de entrada
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Sección "Recordarme" */}
                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-md text-gray-700">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            // Estilos del enlace de "Olvidaste tu contraseña"
                            className="rounded-md text-base text-gray-700 underline hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    {/* Dejamos el PrimaryButton con su color original */}
                    <PrimaryButton className="ms-4 py-2 px-5 text-base" disabled={processing}>
                        Iniciar Sesión
                    </PrimaryButton>
                </div>
                
                {/* Enlace a Registro (opcional, si está habilitado) */}
                <div className="mt-6 text-center border-t pt-4">
                    <Link
                        href={route('register')}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-base transition duration-150"
                    >
                        ¿No tienes cuenta? Regístrate aquí.
                    </Link>
                </div>

            </form>
        </GuestLayout>
    );
}
