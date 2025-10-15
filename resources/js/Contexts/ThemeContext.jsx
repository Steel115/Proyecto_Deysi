import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Crear el Contexto
const ThemeContext = createContext();

// 2. Hook para usar el contexto fácilmente
export const useTheme = () => useContext(ThemeContext);

// 3. Proveedor del Contexto (Lógica principal)
export const ThemeProvider = ({ children }) => {
    // Inicializa el tema leyendo el almacenamiento local (localStorage)
    // Por defecto, usa el modo 'light'
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    // Función para alternar entre 'light' y 'dark'
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    // Efecto que se ejecuta cada vez que el 'theme' cambia
    useEffect(() => {
        const root = window.document.documentElement;
        
        // 1. Aplicar la clase 'dark' al <html> si el tema es 'dark'
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // 2. Guardar la preferencia del usuario en el almacenamiento local
        localStorage.setItem('theme', theme);

    }, [theme]); // Dependencia: Se ejecuta al montar y cada vez que 'theme' cambia

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};