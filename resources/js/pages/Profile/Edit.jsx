import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// ACEPTAMOS LA PROP 'auth' DESDE INERTIA (QUE CONTIENE auth.user)
export default function Edit({ auth, mustVerifyEmail, status }) {
    // 1. Pasamos auth.user al layout para que pueda funcionar la navegación
    // Aunque tu layout también espera 'user' directamente, es buena práctica tomarlo de 'auth'
    const user = auth.user; 

    return (
        <AuthenticatedLayout
            user={user} // Aseguramos que el layout reciba el objeto de usuario
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* 2. PASAMOS user={user} (o user={auth.user}) AL FORMULARIO */}
                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                            user={user} // <--- ESTO ES LO QUE FALTABA
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
