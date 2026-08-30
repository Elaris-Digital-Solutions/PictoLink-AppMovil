# PictoLink — Estado del proyecto y registro de cambios

> **Propósito:** documento vivo. Registra el estado de la arquitectura, los hallazgos
> pendientes y lo que se va corrigiendo camino a publicar en App Store y Play Store
> con modalidad freemium.
>
> **Cómo usarlo:** cada hallazgo tiene un **ID estable** (`P0-1`, `SEC-3`, `PERF-2`…).
> Al corregir algo: marca la casilla, cambia el estado, y añade una línea en el
> [Registro de cambios](#12-registro-de-cambios) al final con la fecha, el ID y el commit.
> Los IDs no se reutilizan ni se renumeran, aunque se cierren.

- **Auditoría inicial:** 2026-07-26
- **Última actualización:** 2026-08-30 (`E.0.2` **cerrada e integrada** en `develop`: el gate pasa cuando debe y corta cuando debe, las dos mitades medidas. `SEC-16` **contenida**: los 5 PAT revocados, HTTP 401 en los cinco)

> **Restricción de planificación (decidida 2026-07-27):** no hay fecha límite del proyecto.
> El criterio de orden es **riesgo/costo activo primero, y agrupar todo lo legal, comercial
> y de pictogramas en un único bloque final** — incluido cualquier trabajo técnico que sea
> más barato hacer en ese mismo movimiento. Ver [§9 Roadmap](#9-roadmap-orden-revisado).
- **Commit base de la auditoría:** `057a1ed` (Add local pictogram overrides and notes)
- **Rama:** `main`

### Leyenda de estados

| Símbolo | Significado |
|---|---|
| 🔴 | Abierto — bloqueador |
| 🟠 | Abierto — importante |
| 🟡 | Abierto — menor |
| 🔵 | En progreso |
| 🟢 | Resuelto y verificado |
| ⚪ | Descartado / no aplica (justificar en el registro) |

---

## 1. Veredicto ejecutivo

**El proyecto hoy es una PWA web (Next.js 16 + Supabase), no una app móvil.** No existe
proyecto nativo, ni Capacitor, ni React Native, ni build para iOS/Android. Publicar en
las tiendas no es un paso de empaquetado: requiere una decisión arquitectónica y
reescribir tres subsistemas (auth, push, TTS).

| Eje | Estado inicial | Estado actual | Notas |
|---|---|---|---|
| Producto / UX | 🟢 Avanzado | 🟢 | Tablero AAC con ~44 páginas curadas por terapeuta, dos interfaces (AAC / cuidador), chat P2P y grupos |
| Arquitectura web | 🟡 Funcional con deuda | 🟡 | Todo client-side, sin capa de servicio, páginas de 1000–1400 líneas |
| Seguridad / RLS | 🔴 Fallos explotables | 🔴 | **14 hallazgos, 1 cerrado** (`SEC-7`, por eliminación del panel admin). Sigue crítico: `P0-2` (freemium escribible por el usuario) y `SEC-12` (borrar una cuenta destruye datos de terceros) |
| Rendimiento / costos | 🔴 Problemas graves | 🟠 | **Los 22 MB por usuario ya no están** (`PERF-1` cerrado). Siguen el polling permanente (`PERF-2`) y la ausencia del índice más caliente del esquema (`PERF-7`) |
| Calidad de ingeniería | 🔴 Ausente | 🟠 | Gate `npm run verify:full` operativo: typecheck + lint + 13 tests unitarios + build + 27 comprobaciones de humo sobre la app corriendo. Falta CI, tests de RLS y del flujo de mensajes |
| Preparación tiendas | 🔴 No iniciada | 🔴 | Faltan bloqueadores legales y de guidelines |
| Licencia de contenido | 🔴 **Bloqueador legal** | 🟠 | Decidido: set propio generado con IA. Deja de ser negociación externa y pasa a ser producción + migración interna (`P0-1`) |

---

## 2. Arquitectura actual (mapa real)

```
web/  (Next.js 16.1.6 · React 19 · App Router · Tailwind 4 · Webpack)
│
├── app/
│   ├── page.tsx              → spinner, delega routing al AppShell
│   ├── layout.tsx            → PWARegistry + StoreHydrator + SessionTracker + AppShell
│   ├── onboarding/           → auth (email+password) + selección de rol
│   ├── chat/       1013 L    → interfaz AAC (comunicador)
│   ├── cuidador/   1373 L    → interfaz cuidador (chat, grupos, ajustes)
│   ├── settings/, dashboard/
│   └── api/                  → push/send, push/subscribe, contacts/search,
│                               cloudinary/delete, health-check
├── components/
│   ├── layout/AppShell.tsx  318 L → hydration gate + verificación de sesión +
│   │                                 permiso de notificaciones + orientation lock +
│   │                                 route guard  ← 5 responsabilidades
│   └── board/               → AACBoard, AACButton, SentenceBar, PredictionBar…
├── lib/
│   ├── store/               → 7 stores Zustand (chat, group, board, contact,
│   │                          profile, phraseLog, chatNav)
│   ├── supabase/            → client / server
│   ├── ai/                  → cliente del HF Space (FastAPI externo)
│   └── pictograms/, cloudinary.ts, notifications.ts, analytics.ts
├── data/aac-grid-layout.ts  6082 L / 520 KB  ← se empaqueta en el bundle cliente
├── worker/index.ts          → SW custom (push + notificationclick)
├── supabase/schema.sql      → 8 tablas, RLS, 9 funciones SECURITY DEFINER
├── supabase/queries/        → SQL de métricas del piloto (reemplaza al panel admin)
└── tests/unit/              → suite Vitest
```

> **Ya no existe middleware.** `proxy.ts` se borró el 2026-07-27 junto con el panel
> administrativo: era su única razón de ser. **No hay ninguna protección server-side de
> rutas** — cosa que en la práctica ya era cierta, porque el matcher solo cubría `/admin`
> (ver `BUG-3`). El guard real es 100% cliente, en `AppShell`.

**Dependencias externas críticas**

| Servicio | Uso | Riesgo |
|---|---|---|
| Supabase | BD, auth, realtime | Único punto de fallo de todo el backend |
| `static.arasaac.org` | CDN de imágenes de pictogramas | **Provisional** — se elimina al desplegar el set propio (`P0-1`). Hoy: licencia NC + dependencia de disponibilidad de un tercero sin SLA |
| HF Space `elarisdigitalsolutions-pictolink` | NLP (predicción, búsqueda, texto↔pictos) | Tier gratuito, cold starts de ~30 s |
| Cloudinary | Avatares | Preset unsigned expuesto (ver `SEC-2`) |
| Vercel | Hosting + analytics + speed insights | Analítica condicionada por política de menores (`P0-8`) |

**Nota arquitectónica clave:** la app es *client-heavy por diseño* — casi todo es
`'use client'`, la lógica vive en stores Zustand que hablan directo a Supabase vía RLS,
y Next.js solo aporta el shell, 5 route handlers y un middleware. Esto es malo para una
web (sin SSR, sin protección server-side) pero **excelente para portar a móvil**: el
código ya es una SPA disfrazada. Es el mayor activo para el port.

Contrapartida: no existe ninguna capa donde imponer reglas de negocio. Cualquier límite
freemium escrito en el cliente es cosmético.

---

## 3. P0 — Bloqueadores para publicar

### `P0-1` 🟠 Reemplazo del set de pictogramas por uno propio generado con IA

**Decisión tomada (2026-07-27): el set ARASAAC actual es un mockup y será sustituido por
un set propio generado con IA.** Esto cierra `DEC-3` y elimina la dependencia de una
negociación externa que podía tardar meses. Baja de 🔴 a 🟠: ya no puede invalidar el
modelo de negocio, pero sigue siendo un *gate* de la Fase 4 (freemium).

**El bloqueo legal no desaparece con la decisión, desaparece cuando ARASAAC sale del
build desplegado.** Mientras el set actual siga en producción no se puede activar ningún
plan pago: CC BY-NC-SA prohíbe el uso comercial y no distingue entre "provisional" y
"definitivo". Por tanto `P0-1` es prerequisito duro de `P0-6` (IAP).

**Tres condiciones que la generación con IA debe cumplir para que la licencia realmente
deje de ser un problema:**

1. **Generar desde texto, nunca desde imágenes ARASAAC.** Si el pipeline usa
   `img2img`, un fine-tune entrenado sobre el catálogo, o calco/recoloreado sobre un
   picto existente, el resultado es obra derivada y hereda el `NC`. El caso ya existe en
   el repo: las manchas `anaranjado` y `celeste` de `public/pictos/` se hicieron
   recoloreando la mancha roja de ARASAAC (`REVISION-PENDIENTES.md:26,31`) — hay que
   regenerarlas desde cero, no reutilizarlas.
2. **Verificar los términos del generador.** Que el proveedor conceda derechos
   comerciales sobre las salidas en el tier que se vaya a usar (varios los restringen en
   el plan gratuito), y que no haya cláusula de no-competencia. Guardar los términos
   vigentes en el repo con fecha.
3. **Sustituir también los 3 assets de Global Symbols** (`dedo del pie`, `uña del pie`,
   `manos sucias`, sets 110 y 96, licencia nunca verificada). Con set propio ya no hace
   falta verificarla: se regeneran.

**Requisito de producto, no legal — y es el más difícil:** en AAC la **consistencia
visual** del set es un criterio clínico, no estético. Un set con 1813 imágenes de estilo
inconsistente (trazos, encuadre, paleta, representación de personas) es peor para el
usuario que ARASAAC con licencia mal resuelta. Hace falta una guía de estilo fijada
*antes* de generar en volumen, y revalidación del terapeuta sobre el set completo.

**Alcance técnico del reemplazo (medido sobre el commit base):**

| Punto de acoplamiento | Ubicación | Nota |
|---|---|---|
| `pictogramId` en el layout | `data/aac-grid-layout.ts` — **4487 referencias, 1813 IDs únicos** | El campo *es* el ID numérico de ARASAAC. Necesita mapa `id_arasaac → clave propia` |
| URL del CDN construida a mano | `AACButton.tsx:28`, `cuidador/page.tsx:989` y `:1190`, `lib/pictograms/catalog.ts:25` | 4 sitios. Unificar en **una** función antes de migrar, o la migración se hace 4 veces |
| `remotePatterns` del host | `next.config.ts:50` | Cambiar al host propio |
| Frases núcleo con IDs fijos | `lib/store/usePhraseLogStore.ts:44-68` | 22 `arasaacId` hardcodeados |
| **Historial de mensajes en la BD** | `useChatStore.ts:227`, `useGroupStore.ts:299` | Cada mensaje persiste `arasaacId` en su JSON → los mensajes ya enviados quedan huérfanos tras la migración. Decidir: migrar con el mapa, o aceptar degradación a solo-texto en el historial previo |
| Búsqueda NLP por catálogo | `lib/ai/picto-nlp.ts:97` | El HF Space busca contra el catálogo ARASAAC; hay que reindexar con el set propio |
| Overrides locales | `PICTO_OVERRIDES` en `aac-grid-layout.ts:17` + `public/pictos/` (5 archivos) | Es el mecanismo por el que puede entrar el set propio de forma incremental |

**Recomendación de secuencia:** unificar primero el constructor de URL en un solo punto
(`lib/pictograms/catalog.ts:getPictoImageUrl`) y hacer que `pictogramId` pase por una
capa de resolución indirecta. Con eso, el reemplazo del set se convierte en cambiar un
mapa, y se puede hacer por lotes (una carpeta del tablero a la vez) sin romper el resto.
Ese refactor es útil aunque el set tarde, y desbloquea entregar Fase 1 y 2 en paralelo.

- [x] Decisión tomada: set propio generado con IA (2026-07-27) — cierra `DEC-3`
- [ ] Guía de estilo del set definida y aprobada por el terapeuta
- [ ] Términos del generador verificados (uso comercial) y archivados en el repo
- [ ] Capa de resolución indirecta de `pictogramId` (desacopla layout ↔ proveedor)
- [ ] Constructor de URL unificado en un solo punto
- [ ] Set propio generado y hospedado (decidir host: `public/` empaquetado vs. CDN)
- [ ] Revalidación clínica del set completo
- [ ] Decisión sobre el historial de mensajes con `arasaacId` (migrar vs. degradar)
- [ ] `PICTO_OVERRIDES` regenerados sin derivar de ARASAAC (manchas de color)
- [ ] Assets de Global Symbols (sets 96/110) sustituidos
- [ ] **ARASAAC eliminado del build desplegado** ← gate de `P0-6` / Fase 4
- [ ] Pantalla de créditos: atribución del set propio y del pipeline usado

---

### `P0-2` 🔴 `plan_type` es escribible por el usuario

```sql
-- supabase/schema.sql:166
create policy profiles_update on public.profiles for update
    to authenticated using (id = auth.uid());   -- sin restricción de columnas
```

Cualquier usuario autenticado puede hacer `PATCH /rest/v1/profiles` y ponerse
`plan_type = 'premium'`. Además **no existe ninguna lógica de límites en el código**:
buscando `premium|paywall|limit|subscription` el único resultado es el simulador del
dashboard admin. El freemium está modelado, no implementado.

**Fix:** quitar `plan_type` y `user_type` del UPDATE del usuario mediante trigger
`BEFORE UPDATE` que restaure los valores anteriores, o moverlo a una tabla
`subscriptions` sin políticas de escritura para `authenticated`. Los límites deben vivir
en funciones `SECURITY DEFINER` o route handlers, nunca en el cliente.

- [ ] `plan_type` protegido a nivel de BD
- [ ] Límites freemium implementados server-side

---

### `P0-3` 🔴 Borrado de cuenta en la app — Apple 5.1.1(v)

Solo existe "Cerrar sesión" (`app/settings/page.tsx:192`). Apple rechaza
automáticamente apps con creación de cuenta que no ofrezcan borrado **dentro** de la app.
Play además exige una ruta de borrado accesible desde web.

Bloqueado técnicamente por `SEC-8` y `SEC-13` (no hay políticas `DELETE` en `profiles`,
`groups`, `messages` ni `group_messages`).

**Alcance ampliado por `SEC-12` (auditoría del 2026-07-27):** no es solo añadir políticas.
`groups.created_by` cascadea en `on delete cascade` y `leave_group` prohíbe que el creador
abandone el grupo. Tal como está, **borrar la cuenta de un cuidador destruye el grupo y todo
su historial para el resto de los miembros**. Hace falta decidir y implementar qué pasa con
los grupos que la cuenta borrada creó: transferir la propiedad al miembro más antiguo,
convertirlos en huérfanos con `created_by` nulo, o exigir transferencia explícita antes de
permitir el borrado. **Es una decisión de producto, no solo técnica.**

Además `PERF-8`: las FKs sin índice hacen que el cascade recorra tablas completas. Conviene
crear esos índices *antes* de implementar el borrado.

- [ ] Decidido el destino de los grupos creados por la cuenta borrada (`SEC-12`)
- [ ] Políticas `DELETE` añadidas al esquema (`SEC-8` + `SEC-13`)
- [ ] Índices de FK creados (`PERF-8`) para que el cascade no bloquee
- [ ] Función `SECURITY DEFINER` de borrado en cascada
- [ ] UI de borrado en ajustes (ambas interfaces)
- [ ] Ruta web de borrado para Play

---

### `P0-4` 🔴 Política de privacidad y términos sin enlace

`components/onboarding/OnboardingFlow.tsx:201` muestra el texto *«Al continuar aceptas
los Términos de uso y Política de privacidad»* como texto plano, sin enlaces. Ambas
tiendas exigen URL de política de privacidad; el formulario de envío la pide.

- [ ] Página pública de política de privacidad
- [ ] Página pública de términos de uso
- [ ] Enlazadas desde onboarding y ajustes

---

### `P0-5` 🔴 Reportar y bloquear — Apple 1.2 (UGC)

PictoLink es una app de mensajería, por tanto contenido generado por usuarios. Apple
exige: filtrado de contenido, mecanismo de reporte, capacidad de bloquear usuarios
abusivos, y datos de contacto de soporte publicados. Hoy no existe ninguno de los cuatro
(el único contacto es `mailto:instituciones@pictolink.app`).

- [ ] Tabla `blocks` + integrada en RLS de `messages`
- [ ] Flujo de reporte de contenido
- [ ] UI de bloqueo de usuario
- [ ] Datos de soporte publicados

---

### `P0-6` 🔴 Compras vía IAP / Play Billing

No hay nada implementado. Apple 3.1.1 y la política de Play obligan a usar StoreKit y
Play Billing para contenido digital — **Stripe está prohibido** para desbloqueos in-app.
Requiere validación de recibos server-side y sincronización del estado hacia
`profiles`/`subscriptions`.

> **Bloqueado por `P0-1`:** no se puede activar cobro mientras el set ARASAAC (CC BY-NC-SA)
> siga en el build desplegado.

- [ ] StoreKit (iOS)
- [ ] Play Billing (Android)
- [ ] Validación de recibos server-side
- [ ] Sincronización de estado de suscripción

---

### `P0-7` 🔴 Confirmación de email desactivada en producción

`components/onboarding/OnboardingFlow.tsx:99` muestra al usuario el mensaje:
*«ve a tu panel de Supabase > Authentication > Providers > Email y apaga Confirm email»*.
Eso significa que producción corre con verificación de correo desactivada: habilita
registro con correos de terceros y suplantación de identidad. Tampoco existe flujo de
recuperación de contraseña.

- [ ] Confirmación de email habilitada y flujo implementado
- [ ] Flujo de reset de contraseña
- [ ] Mensaje de error de debug eliminado del código

---

### `P0-8` 🔴 Decisión pendiente: ¿el público incluye menores de edad?

Probable en AAC. Kids Category de Apple (5.1.4) y Families Policy de Play prohíben
analítica de terceros y recolección de datos sin consentimiento verificable de un adulto.
Hoy hay `@vercel/analytics`, `@vercel/speed-insights` y una tabla `analytics_events`
propia. Habría que condicionar los tres y evaluar COPPA/GDPR-K.

**Decisión de producto que hay que tomar antes de rellenar los formularios de tienda.**

> **Cambio del 2026-07-27:** borrado el panel admin, **la app ya no lee `analytics_events`
> desde ningún lado**. Se sigue recolectando (decisión explícita del usuario) desde cuatro
> escritores — `SessionTracker.tsx` (`session_start`/`session_end`), `AACBoard.tsx`
> (`aacboard_opened`/`aacboard_pictogram_used`), `OnboardingFlow.tsx`
> (`onboarding_completed`) y `lib/hooks/useSpeech.ts` (`voice_tts_used`) — y se consulta a
> demanda con `web/supabase/queries/pilot-metrics.sql`. Los datos se conservan porque son
> la única evidencia para validar el freemium (`F.5`).
>
> **Consecuencia para este hallazgo:** al rellenar App Privacy y Data Safety hay que
> declarar esa recolección igual. Si `DEC-2` sale «sí incluye menores», el consentimiento
> verificable no aplica solo a Vercel Analytics: aplica también a `analytics_events`. Los
> cuatro escritores son el punto donde habría que condicionarla.

- [ ] Decisión tomada y documentada
- [ ] Analítica condicionada según la decisión
- [ ] Formulario App Privacy (Apple) completado
- [ ] Formulario Data Safety (Play) completado

---

## 4. Seguridad — hallazgos técnicos

| ID | Sev. | Hallazgo | Ubicación | Estado |
|---|---|---|---|---|
| `SEC-1` | 🔴 Alta | `/api/cloudinary/delete` no verifica propiedad del `publicId`: cualquier usuario autenticado borra **cualquier** imagen de la cuenta Cloudinary | `app/api/cloudinary/delete/route.ts:36` | [ ] |
| `SEC-2` | 🔴 Alta | Preset de subida Cloudinary *unsigned* y expuesto en el bundle → subida arbitraria de imágenes a tu cuenta, sin límite de tamaño/tipo ni moderación | `lib/cloudinary.ts:2,69` | [ ] |
| `SEC-3` | 🟠 Media | `profiles_select using (true)`: cualquier autenticado lee **todos** los perfiles (nombres, avatares, modo, plan) | `supabase/schema.sql:164` | [ ] |
| `SEC-4` | 🟠 Media | `get_user_id_by_email` es `SECURITY DEFINER` invocable por cualquier autenticado → oráculo de enumeración de correos, sin rate limiting | `schema.sql:273`, `app/api/contacts/search/route.ts` | [ ] |
| `SEC-5` | 🟠 Media | `messages_update_read` permite al receptor actualizar **cualquier** columna, incluidos `content` y `pictograms` → puede reescribir el mensaje que recibió | `supabase/schema.sql:178` | [ ] |
| `SEC-6` | 🟡 Baja | `/api/health-check` sin auth: expone estado de infraestructura y el modelo HF | `app/api/health-check/route.ts` | [ ] |
| `SEC-7` | ⚪ | ~~`/admin/metrics` usa `service_role` y su única protección es el matcher del middleware~~ **Cerrado 2026-07-27 por eliminación.** El panel administrativo era un prototipo para una presentación puntual y no forma parte del producto publicable (decisión del usuario). Se borraron la ruta, `lib/supabase/admin.ts` y `proxy.ts`. Ya no existe ningún Server Component con `service_role`; la clave solo la usa `/api/push/send`, que sí verifica autorización | — | [x] |
| `SEC-8` | 🟡 Baja | No hay política `DELETE` en `profiles` ni `groups` → imposible implementar borrado de cuenta con el esquema actual (bloquea `P0-3`) | `supabase/schema.sql` | [ ] |
| `SEC-9` | 🟡 Baja | Ningún rate limiting en route handlers ni RPCs (push, búsqueda de contactos, envío de mensajes) | global | [ ] |
| `SEC-10` | 🟠 Media | **Segundo oráculo de enumeración de correos.** `create_group_with_members` y `update_group_with_members` (`SECURITY DEFINER`, invocables por cualquier autenticado) resuelven miembros con `join auth.users u on u.email = lower(trim(m_email))`. Se prueba la existencia de un correo pasándolo como miembro y viendo si aparece la fila. **Arreglar `SEC-4` por separado no cierra la enumeración**: los tres puntos son un solo problema | `schema.sql:305,359` | [ ] |
| `SEC-11` | 🟡 Baja | **Tabla escribible por el usuario sin ninguna restricción.** `analytics_insert` solo valida `user_id = auth.uid()`; `event_type` y `metadata` son texto/JSON arbitrario sin `check`, sin límite de tamaño y sin rate limiting → cualquier autenticado puede inflar la tabla indefinidamente. **Rebajada de 🟠 a 🟡 el 2026-07-27:** su gravedad estaba argumentada como «las decisiones de negocio se apoyan en datos falsificables» porque `/admin/metrics` leía de ahí; borrado el panel, ese argumento se cae. Queda como abuso de almacenamiento y como higiene previa a usar los datos para validar el freemium (`F.5`) | `schema.sql:203` | [ ] |
| `SEC-12` | 🔴 Alta | **El borrado de cuenta destruye datos de terceros.** `groups.created_by` es `on delete cascade` y `leave_group` prohíbe que el creador se vaya. Cuando un cuidador borre su cuenta (obligatorio, `P0-3`), **el grupo y todo su historial desaparecen para el resto de los miembros**, sin aviso. Requiere transferencia de propiedad de grupos → agranda el alcance de `P0-3` | `schema.sql:64,387` | [ ] |
| `SEC-14` | 🟢 Resuelta | **Next.js 16.1.6 acumulaba 28 advisories.** Detectado 2026-07-27, resuelto 2026-07-28 en `fix/sec-14-dependency-vulns`. `next` 16.1.6→**16.2.12** cierra los 28 (verificado: 0 advisories propios en 16.2.12), incluidos SSRF por WebSocket upgrade (CVSS 8.6), bypass de middleware por inyección de parámetro dinámico (8.1), XSS con nonces de CSP y exposición no autenticada de endpoints de Server Function. `@supabase/supabase-js` 2.98→**2.111** elimina `ws` del árbol: era **la única vulnerable que corría en producción**, el transporte del chat en vivo. `npm audit fix` cierra `@babel/*` y `fast-uri`. **Advisories reales de 15 a 7.** Ver `SEC-15` para el residual aceptado. | [x] |
| `SEC-15` | 🔵 Aceptada | **Residual de `SEC-14`: 7 advisories que no se pueden cerrar desde acá.** Seis son de *build time* — corren en el pipeline con input propio, no en producción: `postcss` (3, embebido en `node_modules/next/`), `serialize-javascript` (2, vía workbox) y `brace-expansion` (1, vía `minimatch` de eslint/glob). El séptimo es `sharp` <0.35.0 (CVEs de libvips), que **sí** corre en producción con `next/image`, mitigado porque `next.config.ts:47-53` restringe `remotePatterns` a `static.arasaac.org/pictograms/**`: el optimizador no acepta URLs arbitrarias, así que no hay input controlable por un atacante. `postcss` y `sharp` dependen de que Vercel los suba en una próxima versión de `next`; se descartó forzarlos con `overrides` porque `sharp` es binario nativo y divergir de la versión que Next probó arriesga romper el build de Vercel (Linux) sin mitigar un vector real. **`@ducanh2912/next-pwa` no se toca**: el «fix» que propone npm es *bajarlo* de 10.2.9 a 10.2.6 (y luego a 8.7.1), un cambio mayor hacia atrás en el generador del service worker, para mitigar un DoS de CPU en el propio build. **Revisar cuando salga `next` 16.3 estable.** | [ ] |
| `SEC-13` | 🟠 Media | **No hay política `DELETE` en `messages` ni `group_messages`**: nadie puede borrar un mensaje que envió. Problema doble — moderación UGC (Apple 1.2, `P0-5`) y derecho de supresión (GDPR). Extiende `SEC-8`, que solo cubría `profiles` y `groups` | `supabase/schema.sql` | [ ] |
| `SEC-16` | 🟠 Contenida | **Tres PAT de Supabase completos en el historial público de este repo.** Detectado 2026-08-24. `.claude/settings.local.json` se versionó en `beb3b69` (2026-04-26, un token) y `d130b8e` (2026-04-29, dos más); los tres son `sbp_` de **44 caracteres**, o sea el valor íntegro, y los dos commits son ancestros de `origin/main`. **Verificado por efecto, no deducido:** la API pública de GitHub devuelve `.claude/settings.local.json@d130b8e` con **13 898 bytes**, sin autenticar. Se destrackeó en `5ef32cd` (2026-06-02, *«untrack local Claude settings with secrets»*) y `.gitignore:33` lo ignora hoy — **pero destrackear no borra el historial, y el propio commit que lo destrackea lleva los tokens en su diff**. Un PAT es de la **cuenta**, no de un proyecto: alcanza todos los proyectos de la organización. **No es hallazgo** el JWT del mismo archivo: se decodificó y es `"role":"anon"` del proyecto `xxbvzvoglnxrgcwhkktc`, público por diseño. **Cierre:** revocar los tres en el panel de cuenta + `E.0.1` (push protection verificada con control negativo). **Reescribir el historial no es la contención** — revocado, el valor publicado no vale nada, y un `force-push` a `main` rompe todos los clones. **Revocados y verificado por efecto el 2026-08-29:** `GET https://api.supabase.com/v1/projects` con `Authorization: Bearer <PAT>` devuelve **HTTP 401 en los tres de este repo**, medido el 2026-08-29 — 200 habría significado token vivo. **Los 2 de `UPC-Inventario` (`6f34e0b`, `92cc01c`) también dan 401**, medido el 2026-08-29: los cinco revocados. El comando corre en la PowerShell de Alejandro: el sandbox no alcanza `api.supabase.com`. **Queda abierta sólo por `E.0.1`**: lo publicado ya no vale nada, pero nada impide todavía que se publique otro | historial de `main`, commits `beb3b69` y `d130b8e` | [ ] |

> `SEC-10`→`SEC-13` provienen de la auditoría del esquema del 2026-07-27, hecha sobre
> `web/supabase/schema.sql` (sincronizado 2026-06-02). **Pendiente de verificar contra la BD
> real.** El token del MCP se renovó el 2026-07-27 y el acceso a prod está restaurado
> (8 tablas, RLS activo en todas), así que la verificación ya no está bloqueada. Queda
> confirmar: que las políticas desplegadas coincidan con el archivo, si existen tablas o
> columnas en prod ausentes del archivo, y el volumen real de `messages` /
> `analytics_events` para dimensionar `PERF-5`. Se hace al abrir el Bloque C.

### Lo que está bien hecho (no tocar sin motivo)

- `search_path` fijado en **todas** las funciones `SECURITY DEFINER` — previene hijacking.
- `/api/push/send` verifica autorización real antes de enviar: membresía de grupo o
  contacto previo existente. Evita spam de push a usuarios arbitrarios.
- `service_role` correctamente aislado en server-only (`lib/supabase/admin.ts`).
- Poda de suscripciones push caducadas por HTTP 410 (`app/api/push/send/route.ts:152`).
- VAPID y el cliente service-role se inicializan de forma perezosa para no romper el
  build de Vercel cuando faltan env vars.

---

## 5. Rendimiento y costos

| ID | Sev. | Hallazgo | Estado |
|---|---|---|---|
| `PERF-1` | 🟢 | ~~**El SW precachea 22 MB de código muerto.**~~ **Resuelto y verificado 2026-07-28.** Borrados `public/data/arasaac_catalog.jsonl` (**21,61 MB** medidos) y la función muerta que lo leía (`getPictogramsByCategory` + su `CUSTOM_CATEGORY_DATA` en `lib/pictograms.ts`) — dejar el lector apuntando a un archivo inexistente habría sido peor que no tocar nada. **Verificado sobre el `sw.js` regenerado:** 0 referencias a `arasaac_catalog`, el manifiesto pasó de 63 a 62 entradas, y la única diferencia real es esa (el resto son el build id de Next y hashes de CSS). La regla `CacheFirst` de imágenes ARASAAC sigue intacta. | [x] |
| `PERF-2` | 🔴 | **Polling permanente sobre realtime.** `useChatStore.ts:178` recarga mensajes cada **3 s** y `useGroupStore.ts:410` cada **5 s**, *además* de las suscripciones realtime. Con un chat abierto son ~1200 queries/hora/usuario: batería, datos móviles y egress facturado que escala linealmente. El fallback debería activarse solo al detectar desconexión del canal, con backoff. | [ ] |
| `PERF-3` | 🟠 | **520 KB de layout en el bundle cliente.** `data/aac-grid-layout.ts` (6082 líneas) se importa desde `AACBoard`/`AACButton`, componentes cliente → las ~44 páginas del tablero viajan y se parsean aunque el usuario abra una. Debería ser JSON cargado por página bajo demanda y cacheado por el SW; permitiría además actualizar el tablero sin redesplegar. | [ ] |
| `PERF-4` | 🟠 | **`AACButton` hace una petición HTTP por celda sin `pictogramId`** (`AACButton.tsx:36`): hasta 45 llamadas concurrentes al HF Space por página, cuyo tier gratuito tiene cold starts de 30 s (el timeout está justo en 30 s). Peor: la URL se deriva de forma sincrónica en el 99% de los casos pero se calcula dentro de un `useEffect` con `useState`, forzando un render extra por botón. | [ ] |
| `PERF-5` | ⚪ | ~~**`/admin/metrics` sin límites.** Seis `select()` sin `limit` ni filtro de fecha, agregados en JS.~~ **Cerrado 2026-07-27 por eliminación** junto con el panel. Las agregaciones se conservan como SQL en `web/supabase/queries/pilot-metrics.sql`, ejecutable por el MCP: Postgres agrega, no el runtime serverless, así que el problema no se reproduce. **Volumen real medido de paso:** 13 usuarios en `auth.users`, 10 `profiles`, 109 `messages` (106 con pictogramas, 3 solo texto), 18 `group_messages`, 67 `analytics_events`, 20 `contacts`, 6 `groups`, 13 `group_members`, 8 `push_subscriptions`. | [x] |
| `PERF-6` | 🟡 | **Sin paginación de mensajes.** `limit(100)` fijo: el mensaje 101 hacia atrás es inalcanzable. `loadSummary` trae 500 mensajes al cliente para calcular badges que Postgres podría agregar en una query. | [ ] |
| `PERF-7` | 🟠 | **Falta el índice más caliente del esquema: `group_members(user_id)`.** El único índice es `unique (group_id, user_id)`, inútil para filtrar por `user_id` solo — y *todas* las políticas RLS de grupos hacen exactamente `select group_id from group_members where user_id = auth.uid()`. Se ejecuta en cada query de `groups`, `group_messages` y `group_members`, multiplicado por el polling de 5 s de `PERF-2`. | [ ] |
| `PERF-8` | 🟠 | **FKs sin índice → el borrado de cuenta será lento y con locks.** Sin índice: `contacts.contact_id`, `groups.created_by`, `group_messages.sender_id`. `messages.receiver_id` solo tiene índice **parcial** (`where read = false`), así que el cascade sobre mensajes ya leídos hace seq scan. Cada `delete from auth.users` recorre esas tablas completas → impacta directo a `P0-3`. | [ ] |
| `PERF-9` | 🟡 | **`auth.uid()` se re-evalúa por fila en todas las políticas RLS.** El patrón correcto en Supabase es `(select auth.uid())`, que Postgres resuelve como InitPlan (una vez por query, no una por fila). Es el lint `auth_rls_initplan`. Fix mecánico, gana en todas las tablas a la vez. | [ ] |
| `PERF-10` | 🟡 | **El comentario de `schema.sql:114` es incorrecto.** Afirma que `idx_messages_conversation (sender_id, receiver_id, created_at desc)` "cubre la query de conversación basada en OR"; no la cubre — Postgres no puede usar un índice compuesto para `sender_id = X or receiver_id = X`, resuelve con BitmapOr o seq scan. Es la query más caliente de la app (polling cada 3 s). Necesita dos índices unidireccionales o reescribir la query como `UNION ALL`. | [ ] |

---

## 6. Calidad de ingeniería

### `QA-1` 🔴 Ausencias absolutas

Ningún test (0 archivos), ningún ESLint/Prettier configurado, ningún CI (`.github/` no
existe), ningún script de `lint`/`test`/`typecheck` en `package.json`. Para una app de
salud/educación que va a tiendas, este es el mayor riesgo estructural: no hay red que
impida que un refactor rompa el tablero de 44 páginas.

- [x] ESLint + Prettier (2026-07-27, rama `chore/qa-1-tooling-base`)
- [x] Script `typecheck` en `package.json` (+ `lint`, `test`, `verify`)
- [x] Runner de tests (Vitest) con alias `@/` y primera suite
- [x] **Suite de humo contra la app en ejecución** (`tests/smoke/smoke.mjs`, 27 comprobaciones)
- [x] CI en GitHub Actions ~~← pendiente de decisión del usuario~~ **Desbloqueado por `DEC-7`**
      (repo público → minutos gratis) y **escrito el 2026-08-28** en `.github/workflows/ci.yml`
      como tanda `E.0.2`. **Corrió por primera vez el 2026-08-29** (PR #2): rojo en `Typecheck` por
      un fallo real del gate, y **verde tras el fix** (run `33292830744`, 65 s) — verificado en el
      log: typegen OK, lint 88, tests 13+1 todo, humo 27/27. **Control negativo hecho el 2026-08-29**
      (run `33293288058`, rama de descarte `test/e0-control-negativo`): un aviso de lint introducido
      a propósito — 89 contra un techo de 88 — puso el job **rojo en el paso `Lint`**, con los cuatro
      pasos siguientes sin ejecutar y el aviso atribuible al archivo canario. **El rojo real del
      `TS2307` no habría servido:** cortó en `Typecheck`, con `Lint` en verde antes. **Cierre de la
      tanda en el plan del Bloque E.** **Integrada en `develop` el 2026-08-30** (merge `ea026f5`),
      así que el workflow ya cubre los PR de las demás ramas.
- [ ] Tests de RLS contra Supabase local
- [ ] Test de integridad del layout AAC (ninguna celda apunta a carpeta inexistente ni a `pictogramId` roto)
- [ ] Test del flujo envío/recepción de mensajes

**Gate de verificación disponible desde 2026-07-27:** `npm run verify` en `web/`
(= `typecheck && lint && test:run`). Se comprobó que los tres escalones fallan ante una
violación nueva introducida a propósito, no solo que pasan en verde.

**`npm run verify:full`** = `verify` + `next build` + `test:smoke`. Disponible desde que se
borró el panel admin: hasta entonces el build fallaba (`BUG-8`) y no servía como gate. Ahora
pasa incluso con la `SUPABASE_SERVICE_ROLE_KEY` local inválida, porque ya nada consulta a
Supabase en tiempo de build.

### Prueba de humo — `npm run test:smoke`

`verify` demuestra que el código **compila**, no que la app **funcione**: typecheck, lint y
13 tests unitarios sobre un módulo puro no ejecutan la aplicación. `tests/smoke/smoke.mjs`
llena ese hueco: levanta el build de producción y lo interroga por HTTP. **27
comprobaciones** — 12 rutas con su código esperado, integridad de los assets de 4 páginas
(49 chunks verificados uno por uno), y aserciones sobre el `sw.js` servido.

Los **404 esperados son tan importantes como los 200**: son la prueba *en ejecución* de que
`PERF-1` y la eliminación del panel admin surtieron efecto, no solo de que los archivos ya
no están en el árbol.

Se validó introduciendo la regresión a propósito —volver a poner
`public/data/arasaac_catalog.jsonl` y reconstruir— y confirmando que la suite falla con
exit 1 en las dos comprobaciones correctas.

> **Dos trampas encontradas al construirla, ambas del entorno Windows:**
>
> 1. **`spawn(..., { shell: true })` deja servidores zombi.** `child.kill()` mata el
>    `cmd.exe` envoltorio, no el `node` nieto, que sigue escuchando en el puerto. La
>    consecuencia era grave: la corrida siguiente no podía enlazar el puerto, pero
>    `waitForServer` se daba por satisfecho con el zombi y **la suite medía un build
>    viejo dando 27/27 en verde**. Se corrigió lanzando el binario de Next con
>    `process.execPath` sin shell, más una guarda que aborta si el puerto está ocupado.
> 2. **Next resuelve las rutas de `public/` con un manifiesto de arranque, pero lee el
>    contenido del disco en cada pedido.** Un archivo agregado a `public/` después de
>    arrancar el servidor da 404 aunque exista; el `sw.js`, en cambio, refleja los cambios
>    al instante. Por eso una prueba sobre `public/` solo es válida con `build` de por
>    medio.

> ⚠️ **Al borrar o renombrar una ruta hay que limpiar `.next/` antes de `typecheck`.**
> `tsconfig.json` incluye `.next/types/**/*.ts`, que son tipos generados: si la ruta ya no
> existe pero su tipo generado sí, `tsc` falla con `TS2307 Cannot find module`. Pasó al
> borrar `/admin/metrics`. `Remove-Item -Recurse -Force .next` y reconstruir.

### `QA-4` 🟡 Deuda de lint congelada — 90 avisos

Al introducir ESLint sobre un código que nunca se había lineado aparecieron **17 errores y
105 avisos**. Política adoptada: **ninguna regla se desactiva**; las 3 reglas del React
Compiler que reportaban error se bajan a `warn` y `npm run lint` fija un techo con
`--max-warnings`. Efecto: la deuda existente se tolera, pero **una sola violación nueva
rompe el gate**. El techo se baja a medida que se salda.

**Historial del techo:** 98 (2026-07-27, al introducir el linter, tras excluir los
artefactos generados de `public/`) → **90** (2026-07-27, al borrar el panel admin, que se
llevó los 8 avisos de `UserTable.tsx`).

Los 17 errores se revisaron uno por uno antes de bajarlos de severidad — ninguno era un bug
vivo:

| Regla | Nº | Ubicación | Por qué no era un bug |
|---|---|---|---|
| `react-hooks/static-components` | 8 | ~~`app/admin/metrics/UserTable.tsx:61-68`~~ | Una sola causa: `ColHeader` declarado dentro del render. **Eliminados** con el panel admin |
| `react-hooks/preserve-manual-memoization` | 6 | `chat/page.tsx:255,308,815`, `cuidador/page.tsx:1044` | El React Compiler renuncia a optimizar. Se pierde optimización, no hay fallo de corrección |
| `react-hooks/set-state-in-effect` | 3 | `hooks/useSpeech.ts:24,131` · `AppShell.tsx:42` | Los 2 de `useSpeech.ts` están en **código muerto** (`QA-2`). El de `AppShell` es el hydration gate deliberado (`AppShell.tsx:31-47`) |

Distribución de los 90 avisos restantes: `no-explicit-any` ~50 · `no-unused-vars` ~26 ·
`preserve-manual-memoization` 6 · `set-state-in-effect` 3 · `exhaustive-deps` 2 ·
directivas `eslint-disable` inútiles 2 · `no-img-element` 1. Concentrados en
`useGroupStore.ts` (16), `cuidador/page.tsx` (12), `chat/page.tsx` (11) y
`hooks/useSpeech.ts` (10 — desaparecen al ejecutar `QA-2`).

- [ ] Techo de avisos bajado tras `QA-2` (código muerto)
- [ ] `no-explicit-any` saldado en los stores de Supabase
- [ ] Reglas del React Compiler devueltas a `error`

> ⚠️ **No ejecutar `npm run format` sobre todo el repo.** Prettier está configurado pero
> nunca se corrió: reformatear todo produciría un diff inrevisable que se mezclaría con
> cada cambio funcional del roadmap. Usarlo solo sobre archivos ya tocados.
> `data/aac-grid-layout.ts` está en `.prettierignore` a propósito (destruiría la
> alineación en columnas que usa el terapeuta).

### `QA-2` 🟡 Código muerto identificado

| Archivo / símbolo | Líneas | Nota |
|---|---|---|
| `hooks/useSpeech.ts` | 185 | Duplicado de `lib/hooks/useSpeech.ts`; nadie lo importa. Contiene la única implementación de speech-to-text del proyecto |
| `components/layout/RouteGuard.tsx` | 44 | Nadie lo usa; la lógica real vive en `AppShell` |
| ~~`lib/pictograms.ts:getPictogramsByCategory` + `CUSTOM_CATEGORY_DATA`~~ | ~~70~~ | **Eliminados 2026-07-28 con `PERF-1`** |
| `lib/pictograms.ts:getPictogramCategories` + `CATEGORY_ICONS` | 25 | Sin llamadas. Quedaron al borrar lo anterior; se dejaron fuera de `PERF-1` a propósito para no ensanchar esa rama |
| `types/index.ts` → `Message`, `Room` | — | Describen un esquema (`room_id`) que la BD no tiene |

- [ ] Código muerto eliminado

### `QA-3` 🔵 Artefactos versionados que no deberían estar

`web/ts-errors.txt`, `web/compile-errors.txt`, `bash.exe.stackdump`,
`PictoLink_Guia.pptx` (547 KB), y 15 archivos `*_result*.txt` en `web/scripts/`.

**Parcialmente resuelto 2026-07-28 — la parte que bloqueaba el flujo de trabajo.** Los
artefactos de next-pwa (`public/sw.js`, `workbox-*`, `worker-*`, `swe-worker-*`,
`fallback-*`) estaban versionados sin motivo: Vercel los regenera en cada deploy. Peor,
`sw.js` embebe el **build id de Next**, que cambia en cada compilación → **cada
`npm run build` ensuciaba el árbol y bloqueaba el `git checkout`**. Pasó tres veces en una
sola sesión. Ahora están en `.gitignore` y fuera del índice.

**Hallazgo colateral que justifica ignorar también las carpetas locales:** la detección
automática de contenido de **Tailwind 4 escanea el proyecto y omite lo que `.gitignore`
excluya**. `web/docs/` no estaba ignorado (solo sin trackear), y contiene planes de
implementación con **código fuente completo en bloques cerrados** — incluido el del panel
admin borrado. Tailwind generaba CSS para clases que ya no existen en la app: se verificó
que `accent-orange-500`, que solo vivía en el `FreemiumSlider.tsx` eliminado, seguía en el
bundle de producción. Al ignorar `docs/`, `desencriptar/` y `fotos/`, el CSS bajó de
**56,87 KB a 55,13 KB** y las clases muertas desaparecieron, conservando las reales.

> **Regla general que deja este hallazgo:** en este proyecto, dejar una carpeta *sin
> trackear pero sin ignorar* no es neutro — entra al escaneo de Tailwind. Si no es fuente
> de la app, va al `.gitignore`.

- [x] Artefactos de next-pwa fuera del índice y en `.gitignore`
- [x] Carpetas locales (`docs/`, `desencriptar/`, `fotos/`) ignoradas
- [ ] Resto de artefactos: `ts-errors.txt`, `compile-errors.txt`, `bash.exe.stackdump`,
      `PictoLink_Guia.pptx`, `scripts/*_result*.txt` (Bloque D)

### Bugs funcionales confirmados

| ID | Sev. | Bug | Estado |
|---|---|---|---|
| `BUG-1` | 🟠 | **Los ajustes de TTS nunca se guardan en la BD.** `useProfileStore.updateProfile` solo muta el estado local persistido en `localStorage`; solo `avatar_url` se escribe a Supabase (`app/settings/aac/page.tsx:91`). Las columnas `tts_voice`, `tts_rate`, `tts_enabled` del esquema nunca se pueblan → los ajustes se pierden al cambiar de dispositivo o reinstalar. En una app AAC la voz configurada es un ajuste de accesibilidad central. | [ ] |
| `BUG-2` | 🟡 | `OnboardingFlow.tsx:122` escribe el perfil con `fetch()` crudo al REST de Supabase en lugar del SDK, duplicando manejo de auth y errores. | [ ] |
| `BUG-3` | 🟡 | El comentario de `app/page.tsx:7` afirma que el middleware redirige a usuarios no autenticados. **Desde el 2026-07-27 ya no existe middleware en absoluto** (`proxy.ts` se borró con el panel admin), así que el comentario pasó de impreciso a directamente falso. El guard es 100% cliente, en `AppShell`. Corregir el comentario, o implementar la protección server-side que afirma existir. | [ ] |
| `BUG-4` | 🟡 | `README.md` obsoleto: describe Vite, `VITE_SUPABASE_*` y `supabase-setup.sql`. Nada de eso existe. | [ ] |
| `BUG-5` | 🟡 | Errores de pictograma documentados por el terapeuta y sin corregir (`web/data/REVISION-PENDIENTES.md:45`): "dormir" muestra "hacer" (`acc-14`) y "pañal" (`ayu-23`); "algo" muestra "chocar contra algo" en 38 celdas. **Diferido al Bloque F** (se descarta al reemplazar el set). Tradeoff asumido: un picto incorrecto es un fallo de comunicación real para los usuarios del piloto, no cosmético. | [ ] |
| `BUG-8` | ⚪ | **Cerrado 2026-07-27 por eliminación** — el archivo con el defecto ya no existe. Se conserva el registro porque el patrón puede reaparecer: **el default de una desestructuración no cubre `null`**, y supabase-js devuelve `data: null` en cada fallo. Si alguna vez vuelve a escribirse `const { data: x = [] } = await supabase...`, el bug vuelve. Texto original: ~~Un error de Supabase en `/admin/metrics` rompe el build entero.~~ `app/admin/metrics/page.tsx:54-68` desestructura con `const [{ data: profiles = [] }, …]`. El valor por defecto de una desestructuración **solo se aplica a `undefined`**, y supabase-js devuelve `data: null` cuando la query falla — así que `profiles` queda en `null` y `.map()` (`:72`) revienta. Además el `error` de las 6 queries se descarta sin mirarlo. Como la página es un Server Component que Next prerenderiza en build, **cualquier fallo de Supabase en tiempo de build tumba el despliegue completo**, no solo esa ruta. Reproducido el 2026-07-27: `npm run build` → `TypeError: Cannot read properties of null (reading 'map')` → `Export encountered an error on /admin/metrics/page, exiting the build`. **Fix:** usar `?? []` en vez del default de desestructuración, comprobar `error`, y sacar la página del prerender (`export const dynamic = 'force-dynamic'`) — no tiene sentido prerenderizar un panel de métricas. | [ ] |
| `BUG-7` | 🟡 | **`getPictoImageUrl` ignora su parámetro `size`.** `lib/pictograms/catalog.ts:24` declara `size: 300 \| 500 = 300` pero el template literal escribe `${id}_300.png` siempre. Latente: los 4 llamadores (`chat/page.tsx:233`, `SentenceBar.tsx:48`, `PredictionBar.tsx:42`, `FolderRow.tsx:86`) pasan `300` explícitamente. **Trampa para `P0-1`:** al unificar el constructor de URL en un solo punto (F.2), quien lo lea va a asumir que el parámetro funciona. Corregir o eliminar el parámetro en ese movimiento. Detectado 2026-07-27 al escribir la primera suite de tests. | [ ] |
| `BUG-6` | 🟡 | **`update_group_with_members` borra campos en lugar de preservarlos.** `schema.sql:348-349` asigna `description = p_description` y `avatar_url = p_avatar_url` sin `coalesce`, mientras `name` justo arriba sí usa `coalesce(nullif(trim(p_name),''), name)`. Los parámetros están tipados opcionales (`lib/supabase/types.ts:164-165`), así que llamarla sin ellos pone ambos en `null`. Latente: el único llamador (`cuidador/page.tsx:525`) siempre los pasa — pero la RPC está expuesta al REST. | [ ] |

### `A11Y-1` 🟠 Accesibilidad — el punto más débil para una app AAC

Solo 8 de ~30 componentes tienen algún atributo `aria-`. El tablero se construye con
`<div>` + `<button>` sin roles de grid, sin `aria-label` en los botones de pictograma
(el texto visible ayuda, pero no hay descripción del estado), sin gestión de foco.

Y `app/layout.tsx:42` fija `maximumScale: 1, userScalable: false`, que **bloquea el
zoom** — antipatrón de accesibilidad que Apple señala en revisiones de apps de esta
categoría. Ambas tiendas escrutan accesibilidad en apps declaradas como
`medical`/`education`, y el manifest declara ambas (`app/manifest.ts:18`).

- [ ] Zoom desbloqueado
- [ ] Roles y `aria-label` en el tablero AAC
- [ ] Gestión de foco
- [ ] Auditoría con lector de pantalla (VoiceOver + TalkBack)

---

## 7. Camino a las tiendas

### 7.1 Lo que se rompe al empaquetar (en cualquier camino)

| Subsistema | Hoy | En WebView nativo (iOS) |
|---|---|---|
| **Web Push (VAPID)** | `web-push` + tabla `push_subscriptions` | ❌ iOS solo soporta Web Push en PWA instalada desde Safari, **no en WKWebView**. Migrar a APNs/FCM: nueva tabla `device_tokens`, nuevo sender, plugin nativo |
| **Auth por cookies** | `@supabase/ssr` con cookies | ⚠️ El origen `capacitor://` rompe el modelo de cookies. Pasar a tokens + almacenamiento seguro nativo, y que los route handlers acepten `Authorization: Bearer` |
| **TTS** | `window.speechSynthesis` | ⚠️ Funciona en WKWebView pero con voces, timing y `getVoices()` inconsistentes. Recomendable plugin nativo de TTS en ambas plataformas |
| **STT** | `webkitSpeechRecognition` | ❌ No existe en WKWebView. Ya es código muerto (`QA-2`) — decidir si se elimina o se implementa nativo |
| **Orientation lock** | `screen.orientation.lock()` (`AppShell.tsx:190`) | ⚠️ Reemplazar por configuración nativa / plugin |

### 7.2 Los cuatro caminos

| Camino | Esfuerzo | Veredicto |
|---|---|---|
| **A** — Capacitor apuntando a la URL de Vercel (`server.url`) | 1–2 sem | ❌ **No recomendado.** Lo más rápido y lo más probable de ser rechazado: Apple 4.2 (funcionalidad mínima) rechaza envoltorios de sitios web. Además pierde el offline, esencial para usuarios AAC en colegios con WiFi irregular |
| **B** — Capacitor con assets locales: SPA estática + APIs en Vercel | 4–8 sem | ⭐ **Recomendado.** Los assets se empaquetan en la app (offline real) y los route handlers siguen en Vercel como backend. Viable *precisamente* porque casi todo es `'use client'`; solo `/admin/metrics` es Server Component y no pertenece a la app móvil. Requiere: quitar SSR/middleware del bundle móvil, auth por tokens, push nativo, TTS nativo, y suficiente integración nativa para superar 4.2 |
| **C** — SPA nueva con Vite reutilizando componentes | 6–10 sem | Más limpio que B a medio plazo (elimina la ambigüedad Next-en-móvil), reutiliza `components/` y `lib/store/` casi tal cual, pero duplica mantenimiento web/móvil salvo que la web pase a ser solo landing + admin |
| **D** — React Native / Expo | 4–6 meses | Mejor rendimiento del tablero (45 celdas con imágenes remotas es donde un WebView sufre), TTS y push nativos de primera. Reescritura completa de la UI; conserva stores y esquema. Solo si el tablero resulta insuficientemente fluido en WebView |

**El factor decisivo entre B y D no es el esfuerzo, es la latencia percibida al pulsar un
pictograma.** En AAC, el retardo entre tap y voz es el criterio de usabilidad que los
terapeutas evalúan. Un WebView con 45 imágenes remotas, TTS puenteado y `active:scale`
de CSS suele quedar en 100–250 ms; nativo baja de 50 ms.

> ~~**Recomendación:** ir por **B**, y medir ese retardo en el dispositivo más lento del
> piloto *antes* de comprometerse con la tienda.~~ **Superada el 2026-08-24 por `DEC-1`, que
> eligió C.** Se conserva porque su segunda mitad sigue vigente y es la que manda: **ese
> número, no una preferencia de stack, es lo que debe decidir si algún día se justifica D.**
>
> **`DEC-1` resuelta el 2026-08-24 → camino C (Vite + Capacitor), en el mismo repo.**
>
> **Por qué C y no B.** Medido sobre el árbol real ese día: **0 Server Components, 0
> `'use server'`, sin middleware, 35 de 58 archivos `'use client'`, y 21 sitios de import de
> Next en total** — `next/navigation` (7), `next/server` (5, sólo dentro de las rutas API, que
> se quedan en `web/`), `next/headers` (3, sólo servidor), `next/link` (2), `next` (2,
> metadata), `next/image` (1) y `next/font` (1). B mantiene Next dentro del bundle móvil para
> exportarlo estático; con esas cifras eso es cargar su build sin recibir nada a cambio.
>
> **B y C resolvían las dos el problema, así que el criterio dejó de ser el problema.** El
> segundo criterio fue la condición que puso Alejandro: **conservar el tablero tal cual**. Son
> 7 componentes, **778 líneas y cero imports de Next**, así que en B y en C se copian sin
> tocar — empatan. Lo que desempata es que **la web baja a landing**: después del corte casi
> no queda código compartido, y mantener dos builds de Next para eso no se paga.
>
> **Descartadas, con su motivo, para que no vuelvan a proponerse:** **A** (Capacitor contra la
> URL de Vercel) por Apple 4.2 y por perder el offline; **D** (React Native/Expo) porque
> reescribe las 778 líneas del tablero, que es exactamente lo que la condición prohíbe;
> **Dactyl** (evaluado el 2026-08-24) porque genera SwiftUI desde un prompt: no migra un repo,
> lo reinterpreta, y deja tres bases de código en lenguajes que el equipo no domina.
>
> **Costo aceptado, escrito por delante:** `mobile/` y `web/` van a divergir en dependencias, y
> algún día una subida de versión en uno romperá al otro sin que nadie toque el código
> compartido. Se paga duplicando los dos archivos de tipos generados, no montando un workspace.

> ⚠️ **Trampa de medición (importante dado el orden decidido).** El port (Bloque E) va
> *antes* del reemplazo de pictogramas (Bloque F). Si se mide la latencia tap→voz con el
> set actual, se está midiendo **45 imágenes remotas desde un CDN de terceros**, que es el
> peor caso posible. Con el set propio empaquetado en la app esas imágenes son locales y el
> número cae mucho. Medir en el orden equivocado hace que el WebView parezca insuficiente y
> empuja hacia el camino **D** (React Native, 4–6 meses) por un problema que no es del
> WebView sino del origen de las imágenes. **Para decidir ~~B~~ C vs. D hay que medir con
> imágenes locales** — basta precargar un subconjunto de prueba en `public/pictos/`, no
> hace falta el set completo.
>
> *(Corregido el 2026-08-24: decía «B vs. D» y B dejó de ser el camino elegido. Se corrige
> porque está en **modo imperativo** — un dato caducado que manda hacer algo no se cita, se
> ejecuta. La instrucción en sí no cambia: sigue siendo medir con imágenes locales.)*

### 7.3 Decisiones ~~pendientes (bloquean el Bloque E)~~ — el Bloque E ya no está bloqueado

*(Título corregido el 2026-08-24: `DEC-1` era lo único que bloqueaba el bloque y quedó resuelta.)*

| ID | Decisión | Estado |
|---|---|---|
| `DEC-1` | Camino de empaquetado (A / B / C / D) — ~~recomendado **B**~~ | 🟢 **Resuelta 2026-08-24: camino C, Vite + Capacitor, en el mismo repo.** Motivo, alternativas descartadas y costo aceptado en §7.2 |
| `DEC-2` | ¿El público objetivo incluye menores de edad? (ver `P0-8`) | ⏳ Pendiente |
| `DEC-3` | Librería de pictogramas definitiva (ver `P0-1` y `REVISION-PENDIENTES.md`) | 🟢 **Resuelta 2026-07-27: set propio generado con IA.** ARASAAC queda como mockup provisional |
| `DEC-4` | ¿Se elimina o se implementa nativo el speech-to-text? | ⏳ Pendiente — se resuelve en la tanda `E.5` |
| `DEC-5` | ¿El Bloque A se cierra antes del port, o se corre expuesto durante el port? | 🟢 **Resuelta 2026-08-24: partido.** `SEC-1`, `SEC-2` y `P0-7` **antes** — son chicos y viven en `web/`, que se queda después del corte. `PERF-2` **después**, porque toca `lib/store/useChatStore.ts` y ese archivo se muda a `mobile/` en `E.1`: arreglarlo antes es arreglarlo dos veces. **Costo aceptado por delante:** `PERF-2` es egress facturado, así que la decisión tiene un precio que corre mientras dure el port |
| `DEC-6` | ¿Mac de segunda mano (~400–600 USD, una vez) o build en la nube (Codemagic, 500 min M1/mes gratis)? | ⏳ Pendiente — **no bloquea nada hasta `E.6`**, puede dormir. Lo que cambia: sin Mac no hay Safari Web Inspector y el WebView de iOS se depura a ciegas. ⚠ **No elegir Ionic Appflow: cierra el 2027-12-31** |
| `DEC-7` | ¿El repo sigue público o pasa a privado? | 🟢 **Resuelta 2026-08-24: sigue público.** Consecuencias asumidas: minutos de Actions gratis (así que E2E de Playwright en cada PR es viable, y esto desbloquea el «CI mínimo ← pendiente de decisión» del Bloque B), y a cambio **más superficie para el género de `SEC-16`** — un proyecto Capacitor suma `android/` e `ios/` con configuración de firma. Por eso la push protection entra como paso del día uno, no como higiene posterior |

### 7.4 Trabajo de empaquetado (cualquier camino)

- [ ] Iconos y splash para ambas plataformas
- [ ] `bundleId` (iOS) / `applicationId` (Android)
- [ ] Keystore de Android
- [ ] Perfiles de aprovisionamiento de iOS
- [ ] Esquema de versionado
- [ ] Deep links / Universal Links (tap en notificación → conversación correcta)
- [ ] Cuenta demo para el revisor de Apple
- [ ] Capturas por tamaño de dispositivo
- [ ] Target SDK de Android vigente
- [ ] Inicialización condicionada de analítica según formularios de privacidad

---

## 8. Checklist consolidado de requisitos de tienda

| Requisito | Guideline | ID | Bloque | Estado |
|---|---|---|---|---|
| Confirmación de email | — (seguridad) | `P0-7` | **A** | [ ] |
| Recuperar contraseña | — (UX) | `P0-7` | **A** | [ ] |
| Borrado de cuenta en la app | Apple 5.1.1(v) | `P0-3` + `SEC-12` | **D** | [ ] |
| Reportar contenido abusivo | Apple 1.2 | `P0-5` | **D** | [ ] |
| Bloquear usuario | Apple 1.2 | `P0-5` | **D** | [ ] |
| Accesibilidad — zoom y foco | Ambas — escrutinio extra en `medical` | `A11Y-1` | **D** | [ ] |
| Funcionalidad mínima (no wrapper web) | Apple 4.2 | `DEC-1` | **E** | [ ] |
| Accesibilidad — lector de pantalla en el tablero | Ambas | `A11Y-1` | **F.2** | [ ] |
| Licencia de contenido para uso comercial | Legal | `P0-1` | **F.3** | [ ] Decidido (set propio con IA); pendiente que ARASAAC salga del build |
| Política de privacidad (URL) | Ambas | `P0-4` | **F.4** | [ ] |
| Términos de uso (URL) | Ambas | `P0-4` | **F.4** | [ ] |
| Datos de contacto de soporte | Apple 1.2 | `P0-5` | **F.4** | [ ] |
| Formulario App Privacy (Apple) | Apple | `P0-8` | **F.4** | [ ] |
| Formulario Data Safety (Play) | Play | `P0-8` | **F.4** | [ ] |
| Compras vía IAP / Play Billing | Apple 3.1.1 / Play | `P0-6` | **F.5** | [ ] |

**Nota:** *Sign in with Apple* (Apple 4.8) **no aplica** por ahora — solo se exige si se
ofrece login de terceros (Google/Facebook). Hoy solo hay email+password. Si se añade
login social, pasa a ser obligatorio.

---

## 9. Roadmap (orden revisado)

> **Reordenado el 2026-07-27.** El roadmap original estaba ordenado por urgencia de tienda,
> asumiendo que `P0-1` era un bloqueador externo de meses. Con `DEC-3` resuelta y sin fecha
> límite del proyecto, el criterio pasa a ser:
>
> 1. **Primero lo que ya cuesta dinero o es explotable hoy.**
> 2. **Después la red de seguridad**, antes de los refactors grandes.
> 3. **Agrupar los cambios de esquema** en una sola migración en vez de cinco.
> 4. **Todo lo legal, comercial y de pictogramas al final, en un único bloque** — junto con
>    cualquier trabajo técnico que sea más barato hacer en ese mismo movimiento.
>
> Los bloques son secuenciales por dependencia, no por calendario. No hay estimaciones de
> semanas porque no hay fecha objetivo.

### Bloque A — Riesgo y costo activo (hacer primero, nada depende de nada)

Todo esto es explotable hoy o está facturando ahora mismo. Ningún ítem depende de otro.

- [x] `PERF-1` ~~Borrar `public/data/arasaac_catalog.jsonl`~~ **Hecho 2026-07-28** junto con
      `QA-3` (artefactos de build fuera del versionado), rama
      `chore/qa-3-perf-1-build-artifacts`.
- [ ] `SEC-1` Verificar propiedad del `publicId` en `/api/cloudinary/delete`. Hoy cualquier
      autenticado borra cualquier imagen de la cuenta.
- [ ] `SEC-2` Firmar las subidas a Cloudinary. Hoy el preset unsigned está en el bundle:
      subida arbitraria, sin límite de tamaño ni tipo, sin moderación.
- [ ] `P0-7` Habilitar confirmación de email + flujo de reset. Producción corre sin
      verificación → registro con correos de terceros y suplantación. Con datos de salud y
      posiblemente menores, es lo más grave del documento después de Cloudinary.
- [ ] `PERF-2` Sustituir el polling de 3 s / 5 s por reconexión con backoff. Es egress
      facturado que crece linealmente con los usuarios.
- [x] `SEC-14` ~~Subir `next` a 16.2.12 + `npm audit fix`~~ **Hecho el 2026-07-28**
      (`fix/sec-14-dependency-vulns`). `next`→16.2.12, `eslint-config-next`→^16.2.12,
      `@supabase/supabase-js`→^2.111.0. Advisories reales de 15 a 7; residual documentado
      en `SEC-15`. `verify:full` 27/27 tras cada uno de los tres pasos.
- [ ] `SEC-15` Residual aceptado de `SEC-14`: 6 advisories de build time + `sharp` <0.35.0.
      Sin acción posible aguas arriba. **Revisar cuando salga `next` 16.3 estable.**

### Bloque B — Red de seguridad (antes de tocar RLS y el tablero)

> **Rebanada mínima adelantada al Bloque A como «rama 0» (2026-07-27):** el roadmap ponía
> este bloque después del A, pero el Bloque A incluye `PERF-2` (reescritura del ciclo de
> vida de las suscripciones realtime), cuyo fallo típico —«a veces no llegan mensajes»— es
> el peor caso posible para verificación manual. Se adelantó el tooling para que cada rama
> del Bloque A tenga un gate ejecutable. Ver `QA-4`.

- [x] `QA-1` ESLint + Prettier + `typecheck` + Vitest (`chore/qa-1-tooling-base`)
- [x] `QA-1` CI mínimo en GitHub Actions ~~← pendiente de decisión~~ **Escrito 2026-08-28**
      (`chore/e0-andamiaje-y-contencion`). Pendiente de correr una vez para valer como gate
- [ ] `QA-1` Test de integridad estructural del layout AAC (que ninguna celda apunte a una
      carpeta inexistente). La parte de validación de assets se hace en el Bloque F, cuando
      exista el set definitivo.
- [ ] `QA-1` Tests de RLS contra Supabase local — se van a necesitar en el Bloque C.

> Va antes de los refactors, no después: sin red, tocar las políticas RLS y el tablero de
> 44 páginas es a ciegas.

### Bloque C — Una sola migración de esquema

Todos estos son cambios de esquema. Agruparlos evita cinco rondas de despliegue y
verificación, y varios se tocan entre sí.

- [ ] `P0-2` Blindar `plan_type` y `user_type` (trigger `BEFORE UPDATE` o tabla aparte)
- [ ] `SEC-3` Restringir `profiles_select` a contactos
- [ ] `SEC-5` Limitar las columnas de `messages_update_read` a `read`
- [ ] `SEC-4` + `SEC-10` Cerrar **ambos** oráculos de enumeración de correos a la vez
      (`get_user_id_by_email` y la resolución por email de las RPC de grupos) + rate limiting
- [ ] `SEC-11` `check` en `event_type`, límite de tamaño en `metadata`, rate limiting
- [ ] `SEC-13` + `SEC-8` Políticas `DELETE` en `messages`, `group_messages`, `profiles`, `groups`
- [ ] `PERF-7` Índice `group_members(user_id)`
- [ ] `PERF-8` Índices en las FKs sin cubrir (`contacts.contact_id`, `groups.created_by`,
      `group_messages.sender_id`, `messages.receiver_id` no parcial)
- [ ] `PERF-9` Envolver `auth.uid()` en `(select auth.uid())` en todas las políticas
- [ ] `PERF-10` Índices unidireccionales para la query de conversación (o `UNION ALL`)
- [ ] `BUG-6` `coalesce` en `description` y `avatar_url` de `update_group_with_members`
- [ ] **Resincronizar `web/supabase/schema.sql`** con prod y verificar los hallazgos
      `SEC-10`→`SEC-13` contra la BD real (requiere token del MCP renovado)

### Bloque D — Deuda técnica y cumplimiento no-legal

- [ ] `SEC-12` + `P0-3` Borrado de cuenta, incluida la decisión sobre grupos huérfanos
- [ ] `P0-5` Reportar y bloquear usuarios (tabla `blocks` + RLS + UI). Es requisito de
      Apple 1.2 pero es trabajo de código, no legal → va acá, no en el Bloque F.
- [ ] `BUG-1` Persistir los ajustes de TTS en la BD (ajuste de accesibilidad central en AAC)
- [ ] `A11Y-1` Desbloquear el zoom (`app/layout.tsx:42`) y gestión de foco. **Los roles y
      `aria-label` del tablero se diferen al Bloque F** — mismos componentes que el reemplazo
      de pictogramas.
- [x] ~~`PERF-5` `/admin/metrics` a vistas materializadas~~ · ~~`SEC-7` Revalidar auth en el
      Server Component~~ — **cerrados por eliminación del panel (2026-07-27)**
- [ ] `PERF-6` Paginación de mensajes y badges agregados en Postgres
- [ ] `SEC-6` Auth en `/api/health-check` · `SEC-9` Rate limiting general
- [ ] `QA-2` Eliminar código muerto · `QA-3` Limpiar artefactos versionados + `.gitignore`
- [ ] `BUG-2` Usar el SDK en lugar de `fetch()` crudo en el onboarding
- [ ] `BUG-3` Corregir el comentario de `app/page.tsx:7` (o implementar la protección
      server-side que afirma existir) · `BUG-4` Reescribir el `README.md` obsoleto

### Bloque E — Port móvil (~~camino B~~ **camino C: Vite + Capacitor**) — ~~bloqueado por `DEC-1`~~ desbloqueado el 2026-08-24

> **Plan de tandas:** [`docs/superpowers/plans/2026-08-24-bloque-e-port-movil.md`](docs/superpowers/plans/2026-08-24-bloque-e-port-movil.md).
> Siete tandas (`E.0`→`E.6`), **cortadas por forma del daño, no por tamaño**, un PR cada una.
> El orden que más importa y su argumento: **`E.2` va antes que `E.3` y `E.4` porque la
> medición de latencia puede invalidar el stack**, y construir auth por tokens y push nativo
> encima de un Capacitor que después se descarta es trabajo tirado entero.
>
> **Métrica que manda en todo el bloque: líneas reescritas de `components/board/` = 0 de 778.**

- [ ] Extraer la SPA (quitar SSR del bundle móvil). **El middleware ya no existe** — se
      borró con el panel admin el 2026-07-27, así que esa mitad está hecha. Tampoco queda
      ningún Server Component: la app es enteramente cliente + 5 route handlers. Esa premisa
      valía para **B**, y **medida el 2026-08-24 resultó valer todavía más para C**: con 0
      Server Components y 21 imports de Next en total, mantener Next en el bundle móvil es
      cargar su build sin recibir nada a cambio. Ver `DEC-1` en §7.2
- [ ] Auth por tokens con almacenamiento seguro nativo
- [ ] Push nativo APNs/FCM con tabla `device_tokens`
- [ ] TTS nativo · Orientación nativa · Deep links
- [ ] Builds firmados en ambas tiendas + §7.4 completo
- [ ] **Medir latencia tap→voz en el dispositivo más lento del piloto —
      con imágenes locales, no desde el CDN de ARASAAC** (ver la trampa de medición en §7.2)

### Bloque F — FINAL: pictogramas + legal + comercial (todo de una sola vez)

**Decisión del 2026-07-27: este bloque se hace entero al final, en un solo movimiento.**
Agrupa el reemplazo del set, todo lo legal, todo lo comercial, y el trabajo técnico que se
descartaría o se rehría si se hiciera antes.

**F.1 — Se puede adelantar sin tocar código** (producir imágenes no compite con nada):
- [ ] `P0-1` Guía de estilo del set definida y aprobada por el terapeuta
- [ ] `P0-1` Términos del generador verificados (uso comercial) y archivados con fecha
- [ ] `P0-1` Generación del set en lotes (1813 pictos) + revalidación clínica

**F.2 — El refactor del tablero (todo junto, mismos archivos):**
- [ ] `PERF-3` + `P0-1` Layout a JSON por página **con la capa de indirección de
      `pictogramId` en el mismo movimiento**. Son el mismo refactor: diseñar el JSON sin
      prever el cambio de proveedor obliga a rehacerlo.
- [ ] `PERF-4` Resolver la URL del pictograma de forma sincrónica en `AACButton`
      (elimina hasta 45 peticiones por página y un render extra por botón)
- [ ] `A11Y-1` Roles de grid y `aria-label` del tablero (mismos componentes)
- [ ] `P0-1` Constructor de URL unificado en un solo punto (hoy en 4 sitios)
- [ ] `P0-1` `usePhraseLogStore.ts:44-68` — 22 `arasaacId` hardcodeados
- [ ] `P0-1` `next.config.ts:50` — `remotePatterns` al host propio
- [ ] `P0-1` Reindexar la búsqueda NLP del HF Space con el set propio

**F.3 — Contenido AAC diferido** (todo se descartaría si se hiciera antes):
- [ ] `BUG-5` Pictos incorrectos: `dormir`→"hacer" y →"pañal", `algo`→"chocar contra algo"
      en 38 celdas, `está bien`→"ocho y cuarto"
- [ ] Los 5 diferidos de `REVISION-PENDIENTES.md`: `qué`, `dónde`, `más`, `algo`, `abrigar`
      (eran justo lo que ARASAAC no cubría — usarlos como casos de prueba de la guía de estilo)
- [ ] `PICTO_OVERRIDES` regenerados **sin derivar de ARASAAC** (las manchas de color actuales
      son recoloreados y heredan el `NC`)
- [ ] Sustituir los 3 assets de Global Symbols (sets 96/110, licencia nunca verificada)
- [ ] Decidir el destino del historial de mensajes con `arasaacId` (migrar con el mapa vs.
      degradar los mensajes viejos a solo-texto)
- [ ] **ARASAAC fuera del build desplegado** ← gate de todo lo comercial

**F.4 — Legal:**
- [ ] `P0-4` Páginas públicas de política de privacidad y términos, enlazadas desde
      onboarding y ajustes
- [ ] `P0-8` / `DEC-2` Decisión sobre menores de edad + analítica condicionada + COPPA/GDPR-K
- [ ] `P0-5` Datos de contacto de soporte publicados
- [ ] Pantalla de créditos con la atribución del set propio y del pipeline usado
- [ ] Formularios App Privacy (Apple) y Data Safety (Play)

**F.5 — Comercial (bloqueado por F.3):**
- [ ] Límites freemium server-side (`SECURITY DEFINER` o route handlers, nunca cliente)
- [ ] `P0-6` IAP con StoreKit y Play Billing
- [ ] Validación de recibos server-side + sincronización del estado de suscripción

> **Consecuencia aceptada de este orden:** la app no puede monetizar hasta que el Bloque F
> esté cerrado, porque ARASAAC es CC BY-NC-SA y no distingue entre uso provisional y
> definitivo. Con la restricción de "sin fecha límite" esto es aceptable — pero es la razón
> por la que **F.1 conviene arrancarlo en paralelo desde ya**: la producción de 1813 imágenes
> más revalidación clínica es la ruta crítica más larga del proyecto, y no toca código.

### Continuo — cobertura de tests
- [ ] Tests de RLS contra Supabase local (Bloque B/C)
- [ ] Integridad estructural del layout AAC (Bloque B) y de assets (Bloque F)
- [ ] Flujo envío/recepción de mensajes

---

## 10. Deuda de refactor (no bloqueante, oportunista)

- `AppShell.tsx` (318 L) acumula 5 responsabilidades: hydration gate, verificación de
  sesión, permiso de notificaciones, orientation lock y route guard. Separar cuando se
  toque para el port.
- `app/cuidador/page.tsx` (1373 L) y `app/chat/page.tsx` (1013 L) contienen 12 y 11
  componentes respectivamente en un solo archivo, con duplicación entre ambos (`Avatar`,
  `ThreadPanel`, colages de grupo). Extraer a `components/` compartidos reduciría el
  trabajo del port.
- No hay capa de servicio: los stores llaman a `supabase.from(...)` directamente. Una capa
  intermedia es prerequisito práctico para imponer límites freemium y para el cambio de
  auth por tokens.

---

## 11. Contenido AAC — pendientes del terapeuta

Registro detallado en **`web/data/REVISION-PENDIENTES.md`** (no duplicar aquí).
Resumen de lo diferido: `qué`, `dónde`, `más`, `algo`, `abrigar` — estaban bloqueados por
`DEC-3`, ahora **desbloqueados en cuanto exista el set propio**: eran precisamente los
conceptos que ARASAAC no cubría con el estilo "persona + ?" que pidió el terapeuta, y con
generación propia dejan de ser una limitación de catálogo. Añadirlos a la guía de estilo
de `P0-1` como casos de prueba. Bugs de pictograma confirmados: ver `BUG-5`.

> **Nota sobre `BUG-5` — decisión del 2026-07-27:** diferido al Bloque F junto con el
> reemplazo del set, porque corregir los IDs hoy es trabajo que se descarta al migrar.
> **Tradeoff asumido explícitamente:** el tablero se usa en el piloto con usuarios reales, y
> un pictograma incorrecto en una app AAC es un fallo de comunicación, no un detalle
> cosmético — un usuario que pulsa "dormir" y la app dice "hacer" no puede expresar lo que
> quería. Si el piloto crece o algún terapeuta lo reporta como fricción real, vale
> reconsiderar y corregir las celdas más usadas antes del Bloque F.

---

## 12. Registro de cambios

> Formato: `YYYY-MM-DD` · `ID` · qué se hizo · `commit`
> Añadir la entrada más reciente arriba.

| Fecha | ID | Cambio | Commit |
|---|---|---|---|
| 2026-08-30 | `E.0.2` | **`E.0.2` integrada en `develop`** (PR #2, merge `ea026f5`). **Verificado por efecto y no por el aviso de GitHub:** `.github/workflows/ci.yml` aparece en el árbol de `origin/develop` (`git ls-tree`, 1 coincidencia) y la rama `chore/e0-andamiaje-y-contencion` ya no existe en el remoto. **La consecuencia que estaba anotada como predicción entra en vigor:** las ramas `fix/*` tendrán gate en cuanto abran PR contra `develop`, porque el workflow vive ya en la base. **Medido contra el `develop` nuevo, sin heredar la medición anterior:** las dos ramas sin mergear conflictúan y **sólo en `ESTADO-DEL-PROYECTO.md`** — `git merge-tree` exit 1 en ambas, un único archivo, adiciones en las mismas zonas | `ea026f5` |
| 2026-08-29 | `E.0.2`, `SEC-16` | **El CI corrió por primera vez, salió rojo, y el rojo era del gate.** `SEC-16` **contenida**: los **cinco PAT** devuelven HTTP 401 contra la Management API — revocados, verificado por efecto y no por el panel. **El fallo del CI** (run `33292231084`, PR #2): `Typecheck` rojo con `components/onboarding/OnboardingFlow.tsx(11,21): error TS2307: Cannot find module '@/assets/favicon.png'`, con `Lint` en verde antes. **Causa raíz, reproducida y no deducida:** `next-env.d.ts` lo genera el build, `.gitignore:69` lo excluye, y el workflow **typechequea antes de construir** — así que en un checkout limpio no existe, y es él quien declara los módulos `*.png` vía `next/image-types/global`. En local pasaba porque el archivo estaba generado desde el 2026-07-30. Apartándolo a mano salió **el mismo error, misma columna, exit 2**; devolviéndolo, exit 0. **Fix en una línea**, en el script y no en el workflow, porque es el único punto por el que pasan los dos llamadores: `typecheck` = `next typegen && tsc --noEmit`. Medido: typegen **35 s en frío, 9 s en caliente**; `verify` exit 0 desde un árbol sin `.next` y sin `next-env.d.ts`. **Lo que esto corrige del método:** «borrar `.next` antes de verify» era insuficiente — `next-env.d.ts` vive fuera de `.next`, así que el gate local nunca reprodujo un checkout limpio. **Instrumento que mintió, anotado:** `git cat-file -e "rama/con/barra:ruta"` sale con **128** en el Git Bash de Windows porque MSYS2 reescribe el argumento a `ramaconarra;ruta`; con el `2>/dev/null` de rigor se lee como «el archivo no está» en ramas donde sí está. El rodeo es `git ls-tree -r refs/heads/<rama>`. **Medido de paso:** el workflow existe **sólo** en `chore/e0-andamiaje-y-contencion`, y `on: push` cubre sólo `develop` y `main` — empujar una rama `fix/*` no dispara nada, y sus PR no mostrarán checks hasta que el workflow esté en `develop`. **Desenlace, leído en el log y no en el tick:** run `33292830744` sobre `e64b743` en **verde**, 65 s, seis pasos ejecutados — `Typecheck` imprime «✓ Types generated successfully», lint **88 problems (0 errors)**, tests **13 passed + 1 todo (14)**, humo **27/27 comprobaciones OK**; ningún paso pasó sobre cero elementos. **Lo que el rojo-y-luego-verde NO prueba:** que el paso `Lint` sepa tumbar el job — en el run rojo cortó `Typecheck` y el lint había pasado antes. El control negativo queda pendiente con blanco preciso: el techo está en **88 exacto**, así que un único aviso nuevo debe poner el job en rojo **en el paso Lint**. **Hecho el mismo día y cumplido tal cual:** run `33293288058` sobre `test/e0-control-negativo` — `✖ 89 problems (0 errors, 89 warnings)`, exit 1, **rojo en `Lint`**, `Typecheck`/`Tests`/`Build`/`Humo` sin ejecutar, y el aviso atribuible a `web/lint-canario.ts:1:7`. Medido antes en local con ida y vuelta (88 exit 0 → 89 exit 1 → 88 exit 0) para no gastar un run a ciegas, y comprobado de paso que el BOM que mete `Out-File` no altera el resultado. **`E.0.2` queda cerrada** — el gate pasa cuando debe y corta cuando debe — **pero no integrada**: sigue en el PR #2 | — |
| 2026-08-28 | `E.0.2`, `QA-1` | **CI en GitHub Actions** (`chore/e0-andamiaje-y-contencion`, `.github/workflows/ci.yml`). Ocho pasos sobre `ubuntu-latest` en el orden que pide el plan — **lo rápido primero**: `npm ci` → lint → typecheck → tests → build → humo. Antes no existía `.github/` en absoluto. **Medición que decidió la forma del workflow:** apartando `.env.local` y corriendo el gate con el entorno vacío, **build exit 0 y humo 27/27**, así que el CI **no necesita secrets** — y eso lo hace válido también en PRs desde forks, que en un repo público es el caso normal. `concurrency` con `cancel-in-progress` para no gastar minutos en commits ya superados, y `permissions: contents: read`. **Dos afirmaciones caducadas corregidas de paso:** «CI ← pendiente de decisión del usuario» aparecía en dos sitios y `DEC-7` ya lo había resuelto el 2026-08-24. **Lo que esto NO es todavía:** el workflow **nunca ha corrido**. Se validó que el YAML parsea y que la estructura es la esperada (8 pasos, `working-directory: web`), pero **un workflow que no se ha ejecutado no es un gate, es un archivo**. El control negativo del plan — PR con error de lint a propósito → rojo — sigue pendiente, y hasta entonces `E.0.2` no está cerrada. **`E.0.1` (secret scanning + push protection) y `E.0.3` (Playwright) siguen abiertas**; medido de paso: **Playwright no está instalado**, así que `E.0.3` no es «activarlo» sino escribir la suite desde cero | — |
| 2026-08-24 | `SEC-16` | **Tres PAT de Supabase completos encontrados en el historial público de este repo.** Hallazgo lateral: se buscó tras un aviso sobre otro repo (`UPC-Inventario`, que tenía dos más — **cinco en total entre los dos**). `.claude/settings.local.json` versionado en `beb3b69` (2026-04-26, un token) y `d130b8e` (2026-04-29, dos más), ambos ancestros de `origin/main`. **Verificado por efecto:** la API pública de GitHub devuelve el archivo con **13 898 bytes** sin autenticar. Ya se había intentado arreglar en `5ef32cd` (2026-06-02, *«untrack local Claude settings with secrets»*) — **destrackear no borra el historial, y ese mismo commit lleva los tokens en su diff**. **Dos instrumentos que mintieron y quedan anotados:** (a) `git log --all -- <ruta>` devolvió **0 commits** para un archivo que sí estaba, porque la simplificación de historial lo poda y el borrado entró por un merge — `git show --name-status` sobre el commit sí lo mostraba; (b) `gh api .../secret-scanning/alerts` respondió **404 «disabled»** en los dos repos, o sea que **el aviso no salió de GitHub** y no había alerta que consultar. La verificación buena fue pedir el blob a la API pública y contar sus bytes. **No es hallazgo** el JWT del mismo archivo: decodificado es `"role":"anon"`, público por diseño | — |
| 2026-08-24 | `DEC-1`, `DEC-5`, `DEC-6`, `DEC-7` | **Stack móvil decidido y Bloque E desbloqueado.** `DEC-1` → **camino C (Vite + Capacitor), mismo repo**, revisando la recomendación de B que estaba escrita desde el 2026-07-26. Lo que la cambió fueron cifras medidas ese día sobre el árbol real: **0 Server Components, 0 `'use server'`, sin middleware, 35 de 58 archivos `'use client'`, 21 imports de Next en total, y el tablero en 778 líneas con cero imports de Next**. Se evaluó y descartó **Dactyl** (dactyl.dev, generador de SwiftUI por prompt): no migra un repo, lo reinterpreta — incompatible con la condición de conservar el tablero tal cual. **Aviso sobre esa evaluación: `dactyl.dev` devuelve 403 al lector automático, así que sus datos vienen de fragmentos de su propio marketing y no hay reseña independiente.** `DEC-5` → Bloque A partido (`SEC-1`, `SEC-2`, `P0-7` antes; `PERF-2` después, porque su archivo se muda en `E.1`). `DEC-7` → repo sigue público, lo que **desbloquea el «CI mínimo ← pendiente de decisión»** del Bloque B por minutos gratis de Actions. `DEC-6` (Mac vs. nube) queda abierta y no bloquea hasta `E.6`. Plan de tandas en `docs/superpowers/plans/2026-08-24-bloque-e-port-movil.md` | — |
| 2026-07-28 | `SEC-14`, `SEC-15` | **Vulnerabilidades de dependencias** (`fix/sec-14-dependency-vulns`). `next` 16.1.6→16.2.12 (cierra los 28 advisories), `eslint-config-next`→^16.2.12, `@supabase/supabase-js` 2.98→2.111 (elimina `ws`, **la única vulnerable que corría en producción**: el transporte del chat en vivo), `npm audit fix` para `@babel/*` y `fast-uri`. **Advisories reales de 15 a 7**; el residual queda documentado y aceptado en `SEC-15`. Tres pasos con `verify:full` entre cada uno — `27/27` las tres veces, y el techo de avisos **no** hubo que recalibrarlo (88, idéntico). **Dos lecciones registradas:** (a) el número que reporta `npm audit` no mide riesgo — tras el `audit fix` el total *subió* de 14 a 24 mientras los advisories reales *bajaban* de 15 a 7, porque npm cuenta igual un paquete con CVE propio que uno que solo arrastra a otro (el campo `via` los distingue: objetos = reales, strings = arrastre); (b) un «fix» que retrocede una versión mayor (`next@9.3.3`, `next-pwa@8.7.1`) significa «no hay solución aguas arriba», no «aceptá el downgrade». **Descartado y revertido a propósito:** subir `@supabase/ssr` 0.9→0.12, que se había colado sin ser necesario (el peer de 0.9.0 ya aceptaba supabase-js 2.111). Está en semver `0.x`, maneja las cookies de sesión, y **el gate no cubre flujos autenticados** — habría compilado, dado 200 en todas las rutas y 27/27 con el login roto. Queda pendiente de `QA-1`/Bloque B. | — |
| 2026-07-28 | `QA-1` | **Prueba de humo sobre la app en ejecución** (`tests/smoke/smoke.mjs`, `npm run test:smoke`, incorporada a `verify:full`). Motivo: hasta acá se había verificado con typecheck, lint, tests unitarios sobre un módulo puro y compilación — nada de eso ejecuta la aplicación, y sin embargo se habían borrado 22 MB y 511 líneas apoyándose en eso. 27 comprobaciones: 12 rutas con código esperado, 49 assets verificados uno por uno en 4 páginas, y aserciones sobre el `sw.js` servido. Confirmó en ejecución real que `/sw.js` responde 200 (o sea que `QA-3` no rompe la PWA al desversionar los artefactos) y que `/data/arasaac_catalog.jsonl` y `/admin/metrics` dan 404. Validada introduciendo la regresión a propósito. **Dos defectos propios encontrados y corregidos en el proceso**, ambos específicos de Windows: zombis por `shell: true` que hacían que la suite midiera un build viejo en verde, y el manifiesto de arranque de `public/` en Next. Ambos documentados en `QA-1`. | — |
| 2026-07-28 | `PERF-1`, `QA-3`, `QA-2` parcial, `QA-4` | **22 MB fuera y artefactos de build desversionados** (`chore/qa-3-perf-1-build-artifacts`). `PERF-1`: borrados `public/data/arasaac_catalog.jsonl` (21,61 MB) y su único lector muerto; verificado sobre el `sw.js` regenerado que el manifiesto pasó de 63 a 62 entradas y que la regla `CacheFirst` de imágenes sigue viva. `QA-3`: los artefactos de next-pwa salen del índice — `sw.js` embebe el build id de Next y ensuciaba el árbol en cada compilación, bloqueando el `checkout` (pasó 3 veces en una sesión). Descubierto de paso que **Tailwind 4 escanea todo lo que no esté en `.gitignore`**: `web/docs/` inyectaba en el CSS de producción clases de código ya borrado (`accent-orange-500` del panel admin). Ignoradas las carpetas locales → CSS de 56,87 a 55,13 KB. Techo de avisos 90 → 88. `verify:full` exit 0. | — |
| 2026-07-27 | `SEC-7`, `PERF-5`, `BUG-8`, `SEC-11`, `SEC-14`, `BUG-3`, `QA-4` | **Panel administrativo eliminado** (`chore/remove-admin-metrics-panel`). Decisión del usuario: `/admin/metrics` fue un prototipo para una presentación puntual y no forma parte del producto publicable. Borrados `app/admin/` (457 L), `lib/supabase/admin.ts` y `proxy.ts` — **511 líneas**. Cierra `SEC-7`, `PERF-5` y `BUG-8`; rebaja `SEC-14` (🔴→🟠, los bypass de middleware se quedan sin blanco) y `SEC-11` (🟠→🟡, ya no hay lector de métricas que falsificar); agrava el texto de `BUG-3` (ya no existe middleware alguno); baja el techo de `QA-4` de 98 a 90. **El build vuelve a pasar** (exit 0) y se añadió `npm run verify:full` (verify + build). Las seis agregaciones del panel se conservan como SQL en `web/supabase/queries/pilot-metrics.sql`, **las seis ejecutadas y verificadas contra la BD real** vía MCP. La recolección de analítica se mantiene (ver nota en `P0-8`). | — |
| 2026-07-27 | `BUG-8`, `PERF-5` | **`npm run build` falla en local** al prerenderizar `/admin/metrics`. Causa raíz doble: (a) `BUG-8`, la página trata `data: null` como `[]` con un default de desestructuración que solo cubre `undefined`, y descarta el `error`; (b) el `SUPABASE_SERVICE_ROLE_KEY` de `.env.local` es inválido (401 «Invalid API key», formato no reconocido — 43 caracteres, ni JWT legacy ni `sb_secret_*`). El fallo del entorno local es lo que **destapó** el bug, pero el bug es real e independiente. Medido de paso el volumen real de la BD para dimensionar `PERF-5`. | — |
| 2026-07-27 | `SEC-14` | **Hallazgo nuevo por `npm audit`**, posible gracias al tooling de la rama 0: 13 vulnerabilidades preexistentes, 8 altas. `next@16.1.6` acumula 28 advisories, entre ellos tres bypass de middleware en App Router — encadenables con `SEC-7` para alcanzar `/admin/metrics`, que corre con `service_role`. Fix sin cambio mayor en `next@16.2.12`. Añadido al Bloque A. | — |
| 2026-07-27 | `QA-1`, `QA-4`, `BUG-7` | **Rama 0 de tooling** (`chore/qa-1-tooling-base`). ESLint 9 flat config con `eslint-config-next@16` nativo (sin puente `FlatCompat`), Prettier, `tsc --noEmit` y Vitest con alias `@/`. Scripts nuevos: `typecheck`, `lint`, `lint:fix`, `lint:report`, `format`, `format:check`, `test`, `test:run` y `verify`. Primera suite: 13 tests sobre `lib/pictograms/catalog.ts`. Deuda de lint congelada en 98 avisos con `--max-warnings` (`QA-4`), tras revisar los 17 errores uno por uno. Los tres gates se probaron **fallando** con violaciones introducidas a propósito, no solo pasando. Hallazgo nuevo: `BUG-7`. | — |
| 2026-07-27 | — | **Token del MCP de Supabase renovado.** Acceso a prod restaurado (proyecto `xxbvzvoglnxrgcwhkktc`, 8 tablas, RLS activo en todas). Desbloquea la verificación pendiente de `SEC-10`→`SEC-13` contra la BD real y todo el Bloque C. | — |
| 2026-07-27 | — | **Roadmap reordenado en bloques A–F.** Criterio nuevo: riesgo/costo activo primero, red de seguridad antes de los refactors, cambios de esquema agrupados en una sola migración, y **todo lo legal, comercial y de pictogramas en un único Bloque F final** — incluido el trabajo técnico que se descartaría o rehría si se hiciera antes (`PERF-3`, `PERF-4`, roles del tablero de `A11Y-1`, `BUG-5`, diferidos de `REVISION-PENDIENTES.md`). Registrado que no hay fecha límite del proyecto. Añadida la trampa de medición de latencia en §7.2 (medir el port con imágenes locales, no desde el CDN de ARASAAC). | — (solo doc) |
| 2026-07-27 | `SEC-10`→`SEC-13`, `PERF-7`→`PERF-10`, `BUG-6` | **Auditoría del esquema de BD** sobre `web/supabase/schema.sql`. 9 hallazgos nuevos, el más grave `SEC-12` (borrar la cuenta de un cuidador destruye los grupos y su historial para el resto de miembros → amplía el alcance de `P0-3`). No verificado contra prod: el token del MCP de Supabase está revocado. | — (solo doc) |
| 2026-07-27 | `P0-1`, `DEC-3` | Decisión de producto: los pictogramas ARASAAC son un mockup provisional y se reemplazan por un set propio generado con IA. `DEC-3` cerrada. `P0-1` reformulado de bloqueador legal externo (🔴) a producción + migración interna (🟠), con alcance técnico medido y condiciones para que la licencia realmente deje de aplicar (no derivar de ARASAAC, verificar términos del generador). Añadida dependencia explícita `P0-6` → `P0-1`. | — (solo doc) |
| 2026-07-26 | — | Auditoría inicial de arquitectura. Documento creado. | `057a1ed` (base) |
