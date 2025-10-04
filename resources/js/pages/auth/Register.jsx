import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            {/* TÍTULO DEL FORMULARIO AÑADIDO Y ESTILIZADO */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Crear Cuenta
            </h1>

            <form onSubmit={submit}>
                {/* CAMPO: Name */}
                <div>
                    <InputLabel htmlFor="name" value="Nombre:" className="text-xl font-semibold text-gray-900" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full text-xl" // Tamaño de texto de entrada
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* CAMPO: Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email:" className="text-xl font-semibold text-gray-900" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full text-xl" // Tamaño de texto de entrada
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* CAMPO: Password */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña:" className="text-xl font-semibold text-gray-900" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full text-xl" // Tamaño de texto de entrada
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* CAMPO: Confirm Password */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña:"
                        className="text-xl font-semibold text-gray-900"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full text-xl" // Tamaño de texto de entrada
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    {/* Enlace a Login (modificamos estilos) */}
                    <Link
                        href={route('login')}
                        className="rounded-md text-base text-gray-700 underline hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                    >
                        ¿Ya estás registrado?
                    </Link>

                    {/* Botón de Registro (modificamos tamaño) */}
                    <PrimaryButton className="ms-4 py-2 px-5 text-base" disabled={processing}>
                        Registrar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
