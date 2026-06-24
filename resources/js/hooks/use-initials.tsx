import { useCallback } from 'react';

// Relajamos un poco el tipo para que acepte valores nulos o indefinidos sin que TypeScript se queje
export type GetInitialsFn = (fullName?: string | null) => string;

export function useInitials(): GetInitialsFn {
    return useCallback((fullName?: string | null): string => {
        // ESCUDO: Si no hay nombre, devolvemos las iniciales de la empresa directamente
        if (!fullName) {
            return 'SF';
        }

        // Si sí hay nombre, ejecutamos la lógica original de forma segura
        const names = String(fullName).trim().split(' ');

        if (names.length === 0 || names[0] === '') {
            return 'SF';
        }

        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}