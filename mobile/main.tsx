import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/roboto';
import '@/app/globals.css';
import { App } from '@/App';
import { conApi } from '@/lib/apiFetch';
import { getSupabase } from '@/lib/supabase/client';

// E.3: `/api/…` a la URL base con Bearer. Sin VITE_API_URL queda relativa: sirve en el navegador
// con el proxy de Vite, no en el teléfono. A qué servidor apunta el APK que se reparte lo decide
// Alejandro; el de debug usa http://localhost:3000 con `adb reverse`.
window.fetch = conApi(window.fetch.bind(window), import.meta.env.VITE_API_URL ?? '', async () =>
    (await getSupabase().auth.getSession()).data.session?.access_token);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
