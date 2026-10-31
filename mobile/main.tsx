import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// E.1.2: sólo el andamiaje. E.1.3 trae los componentes y E.1.4 el router.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <p>PictoLink</p>
    </StrictMode>,
);
