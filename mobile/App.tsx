/**
 * App.tsx — lo que hacía web/app/layout.tsx más el enrutado por archivos de Next (E.1.4).
 *
 * Mismo orden de montaje que el layout: StoreHydrator, SessionTracker y AppShell
 * envolviendo la página. Fuera a propósito: PWARegistry (no hacía nada; el service
 * worker es E.1.6) y Analytics/SpeedInsights de Vercel (esta app no se sirve desde Vercel).
 */
import { Component, type ReactNode } from 'react';
import { Route, Switch } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { StoreHydrator } from '@/components/StoreHydrator';
import { SessionTracker } from '@/components/layout/SessionTracker';
import GlobalError from '@/app/error';
import RootPage from '@/app/page';
import ChatPage from '@/app/chat/page';
import CuidadorPage from '@/app/cuidador/page';
import CuidadorSettingsPage from '@/app/cuidador/settings/page';
import DashboardPage from '@/app/dashboard/page';
import OfflinePage from '@/app/offline/page';
import OnboardingPage from '@/app/onboarding/page';
import SettingsPage from '@/app/settings/page';
import AACSettingsPage from '@/app/settings/aac/page';
// Equivalente a app/error.tsx: en Next envuelve la página dentro del layout.
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    state = { error: null as Error | null };
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    render() {
        const { error } = this.state;
        if (error) return <GlobalError error={error} reset={() => this.setState({ error: null })} />;
        return this.props.children;
    }
}

export function App() {
    return (
        <>
            <StoreHydrator />
            <SessionTracker />
            <AppShell>
                <ErrorBoundary>
                    <Switch>
                        <Route path="/" component={RootPage} />
                        <Route path="/chat" component={ChatPage} />
                        <Route path="/cuidador" component={CuidadorPage} />
                        <Route path="/cuidador/settings" component={CuidadorSettingsPage} />
                        <Route path="/dashboard" component={DashboardPage} />
                        <Route path="/offline" component={OfflinePage} />
                        <Route path="/onboarding" component={OnboardingPage} />
                        <Route path="/settings" component={SettingsPage} />
                        <Route path="/settings/aac" component={AACSettingsPage} />
                        {/* Ruta desconocida: AppShell redirige, como hacía con el 404 de Next. */}
                    </Switch>
                </ErrorBoundary>
            </AppShell>
        </>
    );
}
