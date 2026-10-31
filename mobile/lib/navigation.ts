/**
 * lib/navigation.ts — reemplazo de `next/navigation` sobre wouter (E.1.4).
 *
 * Expone la misma forma que usaban los componentes (`useRouter().replace/push/back`
 * y `usePathname()`) para que la mudanza cambie sólo la línea del import.
 */
import { useMemo } from 'react';
import { useLocation } from 'wouter';

export function usePathname(): string {
    return useLocation()[0];
}

export function useRouter() {
    const [, navigate] = useLocation();
    // Estable entre renders, como el router de Next: AppShell lo tiene en las
    // dependencias de su route guard y un objeto nuevo en cada render lo re-dispararía.
    return useMemo(
        () => ({
            push: (to: string) => navigate(to),
            replace: (to: string) => navigate(to, { replace: true }),
            back: () => window.history.back(),
        }),
        [navigate],
    );
}
