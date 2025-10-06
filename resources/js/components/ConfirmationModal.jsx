import React from 'react';

/**
 * Componente Modal de Confirmación estilizado con Tailwind.
 * Reemplaza la función nativa 'confirm()' del navegador.
 *
 * @param {boolean} show - Controla la visibilidad del modal.
 * @param {string} title - Título del modal (ej: "¿Estás seguro?").
 * @param {string} message - Mensaje de la acción (ej: "Esta acción no se puede deshacer.").
 * @param {function} onConfirm - Función a ejecutar si el usuario confirma.
 * @param {function} onClose - Función para cerrar el modal/cancelar.
 * @param {string} confirmText - Texto del botón de confirmación.
 */
export default function ConfirmationModal({
    show = false,
    title,
    message,
    onConfirm,
    onClose,
    confirmText = 'Eliminar',
}) {
    if (!show) {
        return null;
    }

    return (
        // Fondo oscuro y translúcido del modal (Overlay)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">

            {/* Contenedor principal del modal */}
            <div
                className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl transform transition-all sm:max-w-lg sm:p-8"
                // Se usa aria-modal para accesibilidad
                aria-modal="true"
                role="dialog"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {/* Cabecera y Título */}
                <div className="flex items-center space-x-4 mb-4">
                    {/* Icono de Alerta (Rojo) */}
                    <div className="flex items-center justify-center flex-shrink-0 h-10 w-10 rounded-full bg-red-100 sm:h-12 sm:w-12">
                        {/* SVG de icono de peligro/alerta */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ff3b30"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M12 9v4" />
                            <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                            <path d="M12 16h.01" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                        {title}
                    </h3>
                </div>

                {/* Contenido/Mensaje */}
                <div className="mt-2 mb-6">
                    <p className="text-sm text-gray-500" id="modal-description">
                        {message}
                    </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end space-x-3">
                    {/* Botón de Cancelar */}
                    <button
                        onClick={onClose}
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150 shadow-sm"
                    >
                        Cancelar
                    </button>

                    {/* Botón de Confirmar (Acción Peligrosa - color rojo) */}
                    <button
                        onClick={onConfirm}
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-red-600 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}