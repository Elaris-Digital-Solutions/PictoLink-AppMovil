# Bloque E — Port móvil a Capacitor + Vite

**Fecha:** 2026-08-24
**Estado:** propuesta, pendiente de aprobación
**Fuente de verdad:** este documento **no** lo es. Lo es
[`ESTADO-DEL-PROYECTO.md`](../../../ESTADO-DEL-PROYECTO.md). Si los dos discrepan, manda el ESTADO,
y este plan se corrige.

> **Numeración por continuidad.** El Bloque E ya existe en el roadmap del ESTADO (§9) y estaba
> bloqueado por `DEC-1`. Esto **no abre una fase nueva**: desglosa el bloque que ya estaba escrito.
> Si el trabajo termina mereciendo fase propia, se renombra entonces.

---

## 1. Qué desbloqueó este plan

| Decisión | Estado antes | Resuelta el |
|---|---|---|
| `DEC-1` Camino de empaquetado | ⏳ Pendiente (recomendado **B**) | **2026-08-24 → camino C: Vite + Capacitor**, mismo repo |
| `DEC-5` ¿Bloque A antes o durante el port? | Sin formular | **2026-08-24 → partido** (ver §2) |
| `DEC-7` ¿Repo público o privado? | Sin registrar | **2026-08-24 → sigue público** |

Las tres de la tabla están registradas con su motivo en `ESTADO-DEL-PROYECTO.md` §7.2 y §7.3.
**`DEC-6` (Mac vs. nube) sigue abierta y no bloquea nada hasta `E.6`.**

**Por qué C y no B (el recomendado en su momento):** medido el 2026-08-24 sobre el árbol real —
**0 Server Components, 0 `'use server'`, sin middleware, 35 de 58 archivos `'use client'`, y 21
sitios de import de Next en total**. Mantener Next dentro del bundle móvil significa cargar su
build sin recibir nada a cambio. Los 21 imports se reparten en `next/navigation` (7),
`next/server` (5, sólo dentro de las rutas API, que se quedan en `web/`), `next/headers` (3, sólo
servidor), `next/link` (2), `next` (2, metadata), `next/image` (1) y `next/font` (1).

**La condición que manda sobre todo lo demás:** el tablero se conserva **tal cual**. Son 7
componentes, **778 líneas**, y **cero imports de Next**. La métrica de éxito del Bloque E es que
esas 778 líneas terminen con **0 líneas reescritas**.

---

## 2. `DEC-5` — qué se cierra antes del port, y por qué

> ✅ **`DEC-5` — resuelta el 2026-08-24: partido.** `SEC-1`, `SEC-2` y `P0-7` **antes** del port;
> `PERF-2` **después**. El razonamiento que llevó ahí queda abajo, porque el porqué es lo que se
> cita cuando alguien quiera revocarla.

El roadmap del ESTADO (§9) tiene como principio número 1: *«primero lo que ya cuesta dinero o es
explotable hoy»*. El Bloque A tiene **cuatro ítems abiertos** que cumplen esa descripción:

| ID | Qué está abierto hoy |
|---|---|
| `SEC-1` | Cualquier autenticado borra cualquier imagen de la cuenta de Cloudinary |
| `SEC-2` | Preset unsigned en el bundle: subida arbitraria, sin límite de tamaño ni tipo |
| `P0-7` | Producción sin verificación de email → registro con correos de terceros |
| `PERF-2` | Polling de 3 s / 5 s: egress facturado que crece con los usuarios |

**Ninguno bloquea el port técnicamente.** Ninguno toca el build ni el tablero. Pero el port no es
un trabajo de días, y hacerlo primero significa dejar esos cuatro abiertos todo ese tiempo.

**Hay un argumento a favor de portar primero, y es real:** `PERF-2` toca
`lib/store/useChatStore.ts`, que en el port se muda a `mobile/`. Arreglarlo antes significa
arreglarlo en `web/` y después moverlo; arreglarlo después significa que aterriza una sola vez, en
su destino final.

**Resuelto así:** `SEC-1`, `SEC-2` y `P0-7` **antes** — son pequeños, están en `web/`, y siguen
ahí después del port porque las rutas API se quedan. `PERF-2` **después**, con el store ya mudado.

**Costo aceptado, escrito por delante:** `PERF-2` es egress facturado que crece con los usuarios,
así que esta decisión **tiene un precio que corre mientras dure el port**. Se aceptó igual porque
la alternativa es hacer el mismo trabajo dos veces sobre un archivo que se está mudando.

**Alternativa descartada, con su motivo:** cerrar el Bloque A entero antes de empezar. Se
descartó porque `PERF-2` es una reescritura del ciclo de vida de las suscripciones realtime cuyo
fallo típico —*«a veces no llegan mensajes»*— es el peor caso posible para verificación manual, y
verificarlo dos veces (antes y después de mudarlo) no compra nada.

> **Esto añade una tanda `E.A` antes de `E.0`**, con `SEC-1`, `SEC-2` y `P0-7`. Se numera con
> letra porque **no pertenece al Bloque E**: es Bloque A ejecutándose primero, no una tanda del
> port. Si termina mereciendo tratamiento propio, se renombra entonces.

---

## 3. El corte: por riesgo, no por tamaño

Cada tanda responde a **qué puede destruir**, porque eso decide **cómo se verifica**. Tres formas
de daño distintas piden tres verificaciones distintas, y no caben en el mismo PR.

| Tanda | Qué puede destruir | Cómo se verifica |
|---|---|---|
| **E.0** Andamiaje y contención | Nada. Es el gate con el que se verifica el resto | Control negativo: el gate tiene que **fallar** a propósito |
| **E.1** La SPA fuera de Next | Nada de datos. Sólo mueve archivos y cambia el build | Equivalencia: el tablero se ve y se comporta igual |
| **E.2** Cáscara Android + medición | Nada. Produce **un número** | El número, en el dispositivo más lento del piloto |
| **E.3** Auth por tokens | **Deja a usuarios reales fuera de su cuenta** | Test de flujo autenticado (hoy **no existe**) |
| **E.4** Push nativo | Introduce el **primer secreto de servidor** del port + cambia el esquema | Verificación de esquema + control negativo de permisos |
| **E.5** TTS, orientación, deep links | Degrada la UX, no rompe datos | Manual en dispositivo |
| **E.6** iOS | Nada nuevo; repite E.2 en otra plataforma | Igual que E.2 |

### Por qué este orden, con argumento y no con «es más lógico»

- **E.0 va primero** porque hoy **no existe `.github/workflows/`**: cero gates automáticos. Un
  movimiento estructural de 9 346 líneas sin red se verifica a mano, igual que antes del `QA-1`.
  Y porque la decisión que lo bloqueaba —*«CI mínimo ← pendiente de decisión»*— **acaba de
  resolverse**: repo público, minutos de Actions gratis.
- **E.1 va antes que E.2** porque separa dos fallos que juntos no se distinguen: *«no compila
  fuera de Next»* y *«no corre en un dispositivo»*. Si van en el mismo PR, un tablero roto no dice
  cuál de los dos fue.
- **E.2 va antes que E.3 y E.4** porque **la medición puede invalidar el stack**. Construir auth
  por tokens y push nativo encima de un Capacitor que después se descarta es trabajo tirado
  entero. Esta es la razón fuerte del orden.
- **E.3 va antes que E.4** porque el push nativo necesita asociar un dispositivo a un usuario
  autenticado, y con el modelo de cookies eso no existe en `capacitor://`.

### Umbral de partición, escrito por adelantado

> **Si al desglosar una tanda su lista pasa de 15 tareas, se parte en dos.** El número dispara la
> conversación; **el riesgo decide dónde cae el corte**, no la mitad exacta.

Hoy la candidata clara es **E.1**, que si crece se parte en **E.1a (mover sin cambiar)** y
**E.1b (routing y arranque)**.

---

## 4. Las tandas

Cada tanda es **un PR**. Cada tanda trae **sus pruebas dentro**: lo que no se puede verificar
dentro de la tanda no está terminado.

**Y antes de cada tarea se relee lo que la ejecución ya desmintió** — no al cerrar la tanda. Una
corrección anterior puede haber dejado muerto un paso que todavía no se ejecutó.

---

### E.0 — Andamiaje y contención

**Forma del daño: ninguna.** Pero sin esto, todo lo demás se verifica a mano.

> **Un pendiente que ya se pagó una vez pasa a ser un paso del día uno.** El repo es público y su
> historial tiene **3 PAT de Supabase completos** (`beb3b69` 2026-04-26, `d130b8e` 2026-04-29),
> verificados descargables desde la API pública de GitHub. Destrackear no borró nada. Esto no es
> higiene para más adelante: ya costó una vez.

**Primer paso, y es un comando:**

```powershell
git checkout main; git pull; git checkout -b chore/e0-andamiaje-y-contencion
```

| # | Tarea | Verificación |
|---|---|---|
| **E.0.1** | 🔴 **Tarea de riesgo.** Activar secret scanning + **push protection** en el repo | **Control negativo:** push de un secreto de juguete a una rama de descarte tiene que ser **bloqueado**. Si no bloquea, la premisa de contención es falsa y cambia la tanda |
| E.0.2 | CI en `ubuntu-latest`: `lint` → `typecheck` → `test:run` → `build`, en ese orden | El gate se prueba **fallando**: PR con un error de lint introducido a propósito tiene que salir rojo |
| E.0.3 | E2E de Playwright en cada PR (repo público, minutos gratis) | Un test que falla a propósito pone el PR en rojo |
| E.0.4 | Registrar `DEC-1`, `DEC-5` y el repo público en el ESTADO | El ESTADO refleja el estado real |

**Lo rápido va primero** para que el lint corte antes de gastar los minutos del build.

> ### Cierre de `E.0.1` — 2026-08-30 · cerrada. **No deja nada en el repositorio: su traza es la configuración**
>
> **Alcance cumplido.** Secret scanning y push protection activados, y **probado que el bloqueo es real**,
> que era la condición del plan. Con `E.0.2` ya integrada van **3 de las 4 tareas** de `E.0` (`E.0.4` se
> había cumplido el 2026-08-24 al registrar `DEC-1`, `DEC-5` y `DEC-7`).
>
> **Trazas.** Ninguna en git: el cambio vive en la configuración del repo, y la rama de descarte
> `test/e0-1-push-protection` se borra. Lo medible queda en el registro del ESTADO del 2026-08-30.
>
> **El experimento, con sus tres piezas.**
>
> | | |
> |---|---|
> | Antes | `secret_scanning` y `secret_scanning_push_protection` en **disabled**, leídos por API |
> | Control positivo | push **sin** secreto va y **pasa** (rama en el remoto en `0c3443f`) |
> | Control negativo | push **con** secreto: `GH013`, *push declined*, patrón nombrado **`Supabase Personal Access Token`**, `juguete.env:1` |
> | Efecto | el commit `646a8b7` **no está en ninguna rama remota**: el secreto no llegó |
>
> Lo único que cambia entre el push que pasa y el que no es el secreto, así que el rechazo es
> atribuible a push protection y no al canal, al permiso ni a la rama.
>
> **Lo que deja sin hacer.**
>
> - `secret_scanning_non_provider_patterns` y `validity_checks` quedan **disabled a propósito**: el plan
>   no los pedía y los patrones no-proveedor generan ruido. Se activan si aparece un caso que lo pida.
> - **Medido de paso y fuera de alcance:** `dependabot_security_updates` también está **disabled**.
> - **Push protection protege lo que se vaya a publicar, no lo ya publicado.** Los 5 PAT siguen en los
>   historiales públicos; lo que los vuelve inertes es la revocación, no esto.
> - Sólo se probó el patrón `Supabase Personal Access Token`. Nada dice de los demás.
>
> **Lo que el plan previó y se cumplió:** el control negativo, tal cual estaba escrito — push de un
> secreto de juguete a una rama de descarte, bloqueado. **Lo que no previó y salió de ejecutar:**
> (a) la **tarea de riesgo se ejecutó segunda, no primera** — salió bien, pero el orden del plan no se
> respetó; (b) hacía falta un **control positivo previo**, o un rechazo no habría distinguido push
> protection de un fallo de permiso; (c) había que **comprobar en la documentación de GitHub que
> `sbp_` está cubierto** antes de correr el experimento: sin eso, un no-bloqueo habría sido ambiguo
> entre que la protección no funciona y que ese patrón no está en la lista.
>
> **Siguiente:** `E.0.3` (Playwright). **No está instalado**, así que no es activarlo sino escribir la
> suite desde cero, y el `test:smoke` de 27 comprobaciones ya cubre parte. **Si entra ahora o se
> pospone es decisión de Alejandro.**

> ### Cierre de `E.0.2` — 2026-08-29 · **cerrada e integrada** en `develop` el 2026-08-30 (PR #2, merge `ea026f5`)
>
> **Alcance cumplido.** 1 de las 4 tareas de `E.0`. Gate de PR en GitHub Actions de punta a punta:
> **pasa cuando debe y corta cuando debe, y las dos mitades están medidas.**
>
> **Trazas.** Rama `chore/e0-andamiaje-y-contencion`, **3 commits** (`9dd154b`, `e64b743`,
> `fbed158`), PR #2. **4 runs:** rojo `33292231084` (fallo real), verdes `33292830744` y
> `33293200060`, rojo deliberado `33293288058` en `test/e0-control-negativo`.
>
> **Correcciones al plan — 2, y las dos viven en el registro del ESTADO del 2026-08-29.**
>
> 1. **El orden que este plan prescribe no era ejecutable tal cual.** `lint → typecheck → build`
>    deja el typecheck antes del build, pero `next-env.d.ts` —quien declara los módulos `*.png`—
>    lo genera el build y `.gitignore` lo excluye: en un checkout limpio no existe. Primer run rojo
>    con `TS2307`. Resuelto **sin reordenar**: `typecheck` = `next typegen && tsc --noEmit`, que
>    arregla el gate local y el de CI a la vez porque es el único punto por el que pasan los dos.
> 2. **`on: push` no cubre las ramas de trabajo**, sólo `develop` y `main`. Empujar una rama `fix/*`
>    no dispara nada, y sus PR no mostrarán checks hasta que el workflow esté **en `develop`**.
>
> **Métricas, antes → después.**
>
> | | Antes | Después |
> |---|---|---|
> | Gate en CI | no existía | 6 pasos, **65 s**, verde leído en el log y no en el tick |
> | Runs ejecutados | 0 | 4 |
> | `verify` local | — | **+9 s** por el typegen en caliente (35 s en frío) |
> | Lint · tests · humo | 88 · 13+1 todo · 27/27 en local | **idénticos en `ubuntu-latest`** |
>
> **Lo que deja sin hacer.**
>
> - ~~`E.0.1` (push protection) y `E.0.3` siguen abiertas.~~ **`E.0.1` se cerró el 2026-08-30**;
>   sigue abierta sólo `E.0.3` — **Playwright no está instalado**, así que es escribir la suite
>   desde cero.
> - **El gate no ejerce nada autenticado.** Se midió que build y humo pasan con el entorno vacío;
>   el lado incómodo de esa misma medición es que `P0-7` sigue sin probarse contra Supabase.
> - ~~Mientras el workflow viva sólo en esta rama, las otras dos ramas sin mergear no tienen gate.~~
>   **Caducó el 2026-08-30 al integrarse:** el workflow ya está en `develop`, así que las dos ramas
>   `fix/*` tendrán gate en cuanto abran PR. Lo que sigue en pie es el conflicto: las dos chocan con
>   `develop` y **sólo en `ESTADO-DEL-PROYECTO.md`** (`git merge-tree` exit 1 en ambas, un archivo).
>
> **Lo que el plan previó y se cumplió:** el control negativo del lint, tal cual estaba escrito —
> 89 avisos contra un techo de 88, rojo **en el paso `Lint`**, con los cuatro pasos siguientes sin
> ejecutar y el aviso atribuible al archivo canario. **Lo que no previó y salió de ejecutar:** las
> dos correcciones de arriba, y que **un rojo real no sustituye al control negativo** — el del
> `TS2307` cortó en `Typecheck`, con `Lint` en verde antes, así que no probaba nada sobre el lint.
>
> **Siguiente:** `E.0.1`, la tarea de riesgo de la tanda, con su propio control negativo.

---

### E.1 — La SPA fuera de Next

**Forma del daño: ninguna sobre datos.** No toca la base, ni auth, ni las rutas API. Sólo mueve
archivos y cambia quién los compila. Por eso se puede verificar por **equivalencia** y no hace
falta entorno de riesgo.

```powershell
git checkout main; git pull; git checkout -b feat/e1-spa-fuera-de-next
```

| # | Tarea | Verificación |
|---|---|---|
| **E.1.1** | 🔴 **Tarea de riesgo, va primera.** Levantar el tablero con Vite en una carpeta de prueba, **sin mover nada todavía**: sólo comprobar que las 778 líneas renderizan idénticas fuera de Next | Grid 9×5, 45 celdas, colores Fitzgerald correctos. **Si Tailwind v4 o la fuente rompen el grid, cambia la tanda entera** — y sale barato saberlo antes de mover 9 346 líneas |
| E.1.2 | Crear `mobile/` con Vite + React + TypeScript, alias `@/` igual que hoy | `npm run build` en `mobile/` |
| E.1.3 | Mover `components/`, `lib/`, `data/`, `types/`, `hooks/` a `mobile/` | Los 13 tests de `catalog` siguen verdes |
| E.1.4 | Sustituir los imports de Next: `next/navigation` (7) y `next/link` (2) → router; `next/font` (1) → `@font-face`; `next/image` (1) → `<img>` | **0 imports de `next/` en `mobile/`** |
| E.1.5 | `web/` queda con landing + las 5 rutas API. Sigue en Next, sigue en Vercel | Las 5 rutas responden igual que antes |
| E.1.6 | Reemplazar el service worker de `next-pwa` por el equivalente en Vite, o quitarlo si Capacitor lo cubre | Decisión registrada con su motivo |

**Métrica que manda en esta tanda: líneas reescritas de `components/board/` = 0.**

---

### E.2 — Cáscara Android y la medición que decide

**Esta tanda existe para producir un número.** Todo lo que no haga falta para medir, no entra.

```powershell
git checkout main; git pull; git checkout -b feat/e2-capacitor-android
```

| # | Tarea | Verificación |
|---|---|---|
| E.2.1 | `@capacitor/core` + `@capacitor/cli` + `@capacitor/android`, `cap sync` | La app abre en el emulador |
| E.2.2 | **Precargar un subconjunto de pictogramas locales** en la app | Las celdas cargan sin red |
| **E.2.3** | 🔴 **Tarea de riesgo del bloque entero.** Medir latencia **tap→voz** en el dispositivo más lento del piloto, **con imágenes locales** | El número. Si supera ~150 ms, se reabre `DEC-1` |

> ⚠️ **Trampa de medición, del ESTADO §7.2 y sigue vigente.** Si se mide con el set actual, se
> están midiendo **45 imágenes remotas de un CDN de terceros** — el peor caso posible. Ese número
> no describe el WebView, describe el origen de las imágenes, y empuja hacia React Native (4–6
> meses) por un problema que no es del WebView. **La medición sin E.2.2 hecha no vale y no se
> registra.**

**Predicción escrita antes de medir** (se compara al cerrar, y se cuenta el acierto):

| Predicción | Valor |
|---|---|
| Latencia tap→voz con imágenes locales | **< 150 ms** |
| Líneas del tablero reescritas para llegar aquí | **0** |
| Imports de `next/` en `mobile/` | **0** |

---

### E.3 — Auth por tokens

**Forma del daño: deja a usuarios reales fuera de su cuenta.** Superficie pequeña, consecuencia
grave. Verificación completamente distinta a E.1, por eso no comparten PR.

```powershell
git checkout main; git pull; git checkout -b feat/e3-auth-por-tokens
```

| # | Tarea | Verificación |
|---|---|---|
| **E.3.1** | 🔴 **Tarea de riesgo, va primera.** Escribir el test de flujo autenticado que **hoy no existe** | El test tiene que **fallar** con el login roto a propósito |
| E.3.2 | `@supabase/ssr` con cookies → tokens + almacenamiento seguro nativo | Sesión sobrevive al cierre de la app |
| E.3.3 | Las 5 rutas API aceptan `Authorization: Bearer` | Las 5 responden con token y **rechazan sin él** |

> **Esta dependencia está medida, no supuesta.** El registro del ESTADO (2026-07-28) dice, sobre
> `@supabase/ssr`: *«el gate no cubre flujos autenticados — habría compilado, dado 200 en todas
> las rutas y 27/27 con el login roto»*. Sin E.3.1, E.3.2 se verifica a ciegas.

---

### E.4 — Push nativo APNs/FCM

**Forma del daño: introduce el primer secreto de servidor del port** y cambia el esquema. Dos
motivos independientes para ir en su propio PR.

```powershell
git checkout main; git pull; git checkout -b feat/e4-push-nativo
```

| # | Tarea | Verificación |
|---|---|---|
| **E.4.1** | 🔴 Releer `docs/superpowers/specs/2026-07-29-push-sin-service-role-design.md` **antes de escribir nada** | El diseño asumía que el camino nativo no estaba decidido. Ahora sí lo está: confirmar qué sigue en pie |
| E.4.2 | Tabla `device_tokens` + RLS, en Supabase **local en Docker** primero | Migración contra un Postgres limpio |
| E.4.3 | Sender a APNs/FCM, sustituyendo `web-push` | Notificación recibida en dispositivo real |
| E.4.4 | Retirar `push_subscriptions` y el worker de Web Push | Control negativo: nada quedó llamando al endpoint viejo |

> **Ninguna migración toca la base remota sin haber pasado por el Supabase local en Docker, y no
> se aplica sola al mergear: se aplica a propósito.**

---

### E.5 — TTS nativo, orientación y deep links

**Agrupadas porque fallan igual:** las tres son «el plugin nativo no está disponible → degradar al
equivalente web». Mismo modo de fallo, misma verificación.

```powershell
git checkout main; git pull; git checkout -b feat/e5-plugins-nativos
```

| # | Tarea |
|---|---|
| E.5.1 | TTS nativo sustituyendo `lib/hooks/useSpeech.ts` (108 líneas), con fallback a `speechSynthesis` |
| E.5.2 | Orientación nativa sustituyendo `AppShell.tsx:181-190` |
| E.5.3 | Deep links |
| E.5.4 | `DEC-4`: decidir si el STT se elimina o se implementa nativo. **Hoy es código muerto** (`QA-2`) |

---

### E.6 — iOS

**Bloqueada por una decisión de gasto, no técnica.**

> **`DEC-6` — ¿Mac de segunda mano (~400–600 USD, una vez) o build en la nube (Codemagic: 500 min
> M1/mes gratis)?** Pendiente.
>
> Lo que cambia: sin Mac **no hay Safari Web Inspector**, así que el WebView de iOS se depura a
> ciegas y cada vuelta es push → build → instalar, minutos en vez de segundos.
>
> ⚠️ **No elegir Ionic Appflow:** cierra el **31 de diciembre de 2027**.

---

## 5. Lo que este bloque NO incluye, dicho y no disimulado

**Todo lo obligatorio para publicar va al Bloque F, por decisión tuya del 2026-08-24.** Queda
explícito para que nadie lo lea como un olvido:

- Compras in-app (StoreKit 2 / Play Billing), validación de recibos en servidor, tabla de
  entitlements. **Hoy hay 0 líneas de cobro**: sólo `types/index.ts:23` declara
  `Plan = 'free' | 'basic' | 'premium'`, y dos consultas SQL **simulan** límites sobre datos del
  piloto.
- Iconos, splash, metadatos de tienda, políticas de privacidad.
- `A11Y-1` (zoom bloqueado en `app/layout.tsx`), que las dos tiendas escrutan en apps declaradas
  `medical`/`education`.
- El reemplazo del set de pictogramas (Bloque F).

**Consecuencia aceptada:** al terminar el Bloque E hay una app que corre en Android y no se puede
publicar todavía. Es a propósito.

---

## 6. Métricas del bloque — las mismas en cada cierre

Se reportan **antes → después** en cada tanda, para que la serie se lea de un vistazo.

| Métrica | Hoy (2026-08-24) |
|---|---|
| Líneas reescritas de `components/board/` | 0 de 778 — **es la métrica que manda** |
| Imports de `next/` en el bundle móvil | 21 |
| Líneas de código de aplicación | 9 346 (57 archivos) |
| Tests verdes | 27/27 |
| Techo de avisos de lint | 88 |
| Workflows de CI | **0** |
| Latencia tap→voz | **sin medir** |
| PAT filtrados en el historial público | **3** |

**Los recuentos se cuentan al final, no durante.** Un recuento hecho a mitad de tanda nace cierto
y caduca el mismo día.

---

## 7. Plantilla de cierre de tanda

Todos los cierres responden a las mismas preguntas, que es lo que permite leerlos en serie.

| Sección | Qué lleva |
|---|---|
| Encabezado | Nombre, **fecha**, y si está integrada o sólo cerrada |
| Alcance cumplido | Las tareas, en número, y qué queda funcionando de punta a punta |
| Trazas | Commits, rama, PR y el color de la verificación |
| **Correcciones al plan** | El número **y dónde viven** |
| Decisiones nuevas | Por rango (`DEC-5`→`DEC-7`), no una a una |
| Métricas | Las de §6, antes → después |
| **Lo que deja sin hacer** | En dos listas: **lo que el plan previó** y **lo que no previó y salió de ejecutar**. La segunda es la que enseña a planificar la siguiente |
| Siguiente | — |

**Dos avisos que salen de haber leído siete cierres seguidos:**

1. **La línea «Siguiente:» es la que más caduca.** Apunta al futuro desde un documento que nadie
   relee. **Su sitio natural es el ESTADO**, que sí se mantiene — no el cierre.
2. **Las cifras del cierre se predicen por escrito antes de medirlas**, y se cuenta cuántas
   acertaron. En un cierre medido falló una de nueve: **la única que se había estimado**.
