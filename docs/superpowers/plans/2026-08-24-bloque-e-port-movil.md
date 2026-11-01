# Bloque E — Port móvil a Capacitor + Vite

**Fecha:** 2026-08-24
**Estado:** propuesta, pendiente de aprobación
**Fuente de verdad:** este documento **no** lo es. Lo es
[`ESTADO-DEL-PROYECTO.md`](../../../ESTADO-DEL-PROYECTO.md). Si los dos discrepan, manda el ESTADO,
y este plan se corrige.

> ### Correcciones al plan — 2026-10-31, antes de ejecutar `E.1`
>
> Las dos afectan a pasos **todavía no ejecutados**, así que se corrigen en su sitio y aquí queda
> lo que decían.
>
> 1. **Los comandos de rama de `E.1`→`E.5` no seguían gitflow.** Decían
>    `git checkout main; git pull; git checkout -b feat/eN-...`: salían de **`main`**, con prefijo
>    **`feat/`**, y con tres comandos encadenados por `;` en un mismo bloque. En gitflow las ramas
>    de trabajo salen de **`develop`** con prefijo **`feature/`**, y encadenar con `;` ya provocó
>    un pegado duplicado que borró mal una rama. Ahora hay **un solo procedimiento** en §4,
>    un comando por bloque, y cada tanda sólo nombra su rama. El de `E.0` se deja como estaba
>    porque ya se ejecutó así.
> 2. **`E.4` sustituía el transporte del push pero no quién lo dispara.** Hoy lo dispara el
>    teléfono del emisor con un `fetch` que, si falla, se traga en silencio (`BUG-9`), y eso choca
>    con el requisito de producto «se notifica todo mensaje, en todo momento». `E.4.3` pasa a ser
>    **push disparado por la base**.
>
> ### Correcciones al plan — 2026-10-31, al ejecutar `E.1.1`
>
> 3. **`E.1.3` mandaba mover `lib/` entero a `mobile/`, y eso rompe `web/`.** Medido: **5 de los 7
>    route handlers** importan de `lib/` (`lib/supabase/server` los cinco, más `lib/auth-confirm`,
>    `lib/cloudinary` y `lib/ai/picto-nlp`), y `lib/supabase/server.ts` importa `next/headers`, así
>    que moverlo haría fallar la verificación de `E.1.4` («0 imports de `next/` en `mobile/`»).
>    Además, 2 de los 3 archivos de test prueban código de servidor (`auth-confirm`, `cloudinary`).
>    **`lib/` se reparte por quién lo importa**: lo que usan las rutas se queda en `web/`.
> 4. **«Las 5 rutas API» eran 7 route handlers:** 6 en `app/api/` y `app/auth/confirm`. El número
>    se escribió antes de `SEC-1`/`SEC-2` y `P0-7`.
> 5. **`E.1.4` no contaba `process.env`:** 10 lecturas en 6 archivos de `lib/` y `components/`.
>    Vite no define `process`, y `lib/api.ts` lo lee **al importarse**, así que el tablero no arranca
>    sin cambiarlo por `import.meta.env`.
> 6. **`next/font` → `@font-face` no hace falta: Inter se carga y no se usa.** Medido en el
>    navegador: el `body` de producción se renderiza con la pila de sistema de Tailwind
>    (`ui-sans-serif, system-ui, …`), porque nada conecta `--font-inter` con `font-sans`. Por
>    equivalencia, `E.1` **la quita**; aplicar Inter sería un cambio visual y no le toca a esta tanda.

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

**Cómo se abre cada tanda (gitflow).** Las ramas salen de `develop`, nunca de `main`, y el PR va
contra `develop`. Un comando por bloque; `<rama>` es la que nombra cada tanda.

Ir a `develop`:

```powershell
git checkout develop
```

Traer lo último del remoto a la rama local (`git fetch` solo no la mueve):

```powershell
git pull
```

Crear la rama de la tanda:

```powershell
git checkout -b <rama>
```

---

### E.A — `SEC-1`, `SEC-2` y `P0-7` (Bloque A ejecutándose primero)

> ### Cierre de `E.A` — 2026-08-30 · **cerrada e integrada** en `develop` (PR #6 y #7)
>
> **Alcance cumplido.** Las **3 tareas** (`SEC-1`, `SEC-2`, `P0-7`), en **2 PR** y **8 commits**
> integrados: 2 de código, 2 merges de `develop` en las ramas, 2 merges de PR y 2 de documentos.
>
> **Trazas.** `dc178b0` (Cloudinary) y `e7255a7` (auth); merges `6552d30` y `beec03b`. Gate en
> verde **leído en el log**, no por el tick, en los dos PR.
>
> **Correcciones al plan — 1, y es de orden.**
>
> 1. **`E.A` se escribió antes que `E.0` pero se integró después, y a propósito.** El plan la
>    ponía primera y el código se escribió primero (`dc178b0` el 24, `e7255a7` el 28 a las 13:05,
>    contra `9dd154b` de las 14:04), pero se integró **detrás** de `E.0` para que estas dos ramas
>    pasaran por el gate en vez de entrar sin él. Invertir ese orden costó **dos resoluciones de
>    conflicto** en `ESTADO-DEL-PROYECTO.md`, previstas con `git merge-tree` antes de abrir los PR
>    y resueltas **intercalando por hora de commit**, no por fecha.
>
> **Métricas, antes → después.**
>
> | | Antes | Después |
> |---|---|---|
> | Tests unitarios | 13 + 1 todo, **1 archivo** | **27 + 1 todo, 3 archivos** |
> | Avisos de lint | 88 | **88**, y el techo es exacto: sin margen |
> | Rutas API nuevas | — | **2** (`/auth/confirm`, `/api/cloudinary/sign`) |
> | Humo | 27/27 | 27/27 — **sin cambio: no cubre nada autenticado** |
>
> **Lo que deja sin hacer.**
>
> - **`P0-7` está integrado, no desplegado**, y el orden es obligatorio: desplegar y **después**
>   el panel de Supabase. Activar «Confirm email» antes rompe todo registro nuevo.
> - **`P0-7` no se ha probado de verdad:** nunca se envió un correo y `verifyOtp` no ha corrido
>   nunca contra Supabase. El gate no ejerce flujos autenticados — se midió que build y humo
>   pasan con el entorno vacío, y ése es el lado incómodo de esa misma medición.
> - **`SEC-2` se verificó sobre el bundle compilado en local**, con control positivo. Nadie ha
>   subido todavía un avatar real contra lo desplegado en Vercel.
> - **Pregunta abierta y sin responder:** en `OnboardingFlow.tsx`, dentro de `mensajeDeAuth`,
>   `invalid_credentials` y `email_not_confirmed` devuelven el mismo texto **a propósito**, para
>   no abrir un segundo oráculo de enumeración junto al de `SEC-4`. Separarlos mejora la UX del
>   usuario legítimo. Son 2 líneas en cualquier dirección y **la decisión es de Alejandro**.
> - `PERF-2` sigue fuera por `DEC-5`: su archivo se muda en `E.1`.
>
> **Lo que el plan previó y se cumplió:** la partición de `DEC-5` — `SEC-1`, `SEC-2` y `P0-7`
> antes del port, `PERF-2` después. **Lo que no previó y salió de ejecutar:** que **el verde del
> gate no cierra `P0-7`**, porque ningún check del proyecto ejerce un flujo autenticado; eso
> convierte «desplegar y probar con un correo real» en trabajo pendiente y no en trámite.
>
> **Siguiente:** `E.1` — la SPA fuera de Next.

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

**Rama:** `feature/e1-spa-fuera-de-next` (se abre como dice §4).

| # | Tarea | Verificación |
|---|---|---|
| **E.1.1** | 🔴 **Tarea de riesgo, va primera.** Levantar el tablero con Vite en una carpeta de prueba, **sin mover nada todavía**: sólo comprobar que las 778 líneas renderizan idénticas fuera de Next | Grid 9×5, 45 celdas, colores Fitzgerald correctos. **Si Tailwind v4 o la fuente rompen el grid, cambia la tanda entera** — y sale barato saberlo antes de mover 9 346 líneas |
| E.1.2 | Crear `mobile/` con Vite + React + TypeScript, alias `@/` igual que hoy | `npm run build` en `mobile/` |
| E.1.3 | Mover `components/`, `lib/`, `data/`, `types/`, `hooks/` a `mobile/` | Los 13 tests de `catalog` siguen verdes |
| E.1.4 | Sustituir los imports de Next: `next/navigation` (7) y `next/link` (2) → router; `next/font` (1) → `@font-face`; `next/image` (1) → `<img>` | **0 imports de `next/` en `mobile/`** |
| E.1.5 | `web/` queda con landing + las 5 rutas API. Sigue en Next, sigue en Vercel | Las 5 rutas responden igual que antes |
| E.1.6 | Reemplazar el service worker de `next-pwa` por el equivalente en Vite, o quitarlo si Capacitor lo cubre | Decisión registrada con su motivo |
| E.1.7 | *(Añadida el 2026-10-31, decisión de Alejandro. **Corregida al ejecutarla, 2026-11-01: Roboto, no Inter** — ver el resultado de `E.1.7` y `DEC-12`.)* ~~**Aplicar Inter empaquetada en la app**, no pedida a Google: que el texto se vea igual en todo dispositivo y funcione sin red. **Va la última y en commit propio**, después de medir la equivalencia: aplicada antes, la comparación no distinguiría el efecto de la fuente del de la mudanza~~ | ~~Las 45 celdas renderizan con Inter (fuente calculada) y **ninguna etiqueta se corta** (`scrollWidth ≤ clientWidth`) en 844×390~~ — imposible con cualquier fuente: ver el resultado |

**Métrica que manda en esta tanda: líneas reescritas de `components/board/` = 0.**

> **`E.1.1` — hecha el 2026-10-31, pasa. El grid no se rompe fuera de Next.** Un mismo arnés
> (`SentenceBar` + `AACBoard`, con la disposición de `app/chat/page.tsx:848-856`) renderizado por
> Next 16 y por Vite 8, importando `web/` sin mover nada, en un viewport de 844×390. Se extrajo de
> cada uno la geometría y nueve propiedades calculadas (fondo, bordes, radio, fuente, tamaño, peso)
> de las **45 celdas**, más la URL de cada imagen: **0 diferencias**. El comparador tiene **control
> negativo**: un cambio de 1 px y uno de color en una copia dan 2 diferencias. **Comportamiento:**
> tocar «yo» y luego «personas» da en los dos la misma barra de frase, el título «Personas» y las
> mismas 45 celdas. El arnés no se commitea.
>
> **Lo que la prueba destapó y no estaba en el plan** (correcciones 3 a 6 de la cabecera):
> - **Tailwind v4 escanea las clases desde el directorio de trabajo**, no desde el CSS: la prueba
>   pasó porque Vite corrió desde `web/`. En `mobile/` hay que verificar que el CSS generado
>   contiene las clases del tablero, o declarar `@source`.
> - **4 de los 7 archivos de `components/board/` no los importa nadie** (`BoardHeader`,
>   `CategoryNav`, `FolderRow`, `PredictionBar`: **368 de las 778 líneas**). Se mudan igual —
>   borrarlos sería reescribir el tablero—, y queda anotado para `§10` del ESTADO.
> - **Qué no prueba:** se midió en Chromium de escritorio, no en un dispositivo; no cubre
>   `SentenceBar` con el TTS hablando ni el envío de mensajes, que necesitan sesión.

> **`E.1.2` — hecha el 2026-10-31.** `mobile/` con Vite 8.3.5, React **19.2.3 exacto** (el mismo
> que `web/`, para que la equivalencia compare el mismo React), TypeScript 5 y alias `@/` → raíz de
> `mobile/`, igual que `web/tsconfig.json`. `npm ci` + `npm run build` → exit 0. **Con control
> negativo:** un error de tipos en un archivo importado por `@/` hace fallar el build (exit 2,
> `TS2322`); corregido, pasa y el bundle contiene el valor importado — así que el alias resuelve y
> el typecheck corta. **Nuevo job `mobile` en `ci.yml`** (install + build): sin él, nada verificaba
> `mobile/` en los PR. El lockfile, generado en Windows, trae el binario de Linux de rolldown
> (`@rolldown/binding-linux-x64-gnu`); que `npm ci` funcione en `ubuntu-latest` se ve en el primer
> run del PR. **Tailwind no se instala todavía:** llega en `E.1.3` con `globals.css`.

> **`E.1.3` — hecha el 2026-10-31.** Commit `87e58f0`, **51 renombres al 100 %** (contenido
> intacto: `git diff -M` no marca ningún cambio). Se mudaron `components/`, `data/`, `hooks/`,
> `lib/` salvo lo de servidor, **las 8 páginas de la interfaz** (`app/chat`, `cuidador`,
> `cuidador/settings`, `dashboard`, `offline`, `onboarding`, `settings`, `settings/aac`),
> `app/globals.css`, `public/pictos/` y el test de catálogo. **Verificación: 13 passed + 1 todo
> desde `mobile/`**; en `web/` quedan 2 archivos con 14 passed — 13 + 14 = los 27 de antes.
>
> - **El reparto de `lib/` (corrección 3), medido por quién importa cada archivo:** sólo `web/`
>   → `supabase/server.ts`, `supabase/types.ts`, `auth-confirm.ts`. **Los dos**, copiados →
>   `cloudinary.ts` (mixto: la UI sube y borra, las rutas usan `userFolder`/`ownsPublicId` de
>   `SEC-2`), `ai/picto-nlp.ts` + `ai/hf-client.ts` (`cuidador` y `health-check`) y `types/index.ts`
>   (lo importa `supabase/types.ts`). **Deuda:** las copias pueden divergir; en `E.1.5` cada lado
>   se queda con lo que usa.
> - **Corrección 7: el plan no movía las páginas**, y sin ellas `E.1.4` no tiene dónde sustituir
>   `next/navigation`. Se mudaron con la misma estructura de carpetas para que el renombre sea puro.
> - **`web/` queda en rojo hasta `E.1.5`**, a propósito y sólo en local: el typecheck da 4 errores,
>   todos en `app/layout.tsx` (importa `AppShell`, `StoreHydrator`, `PWARegistry`,
>   `SessionTracker`). El PR no se abre hasta que las dos apps estén en verde.
> - **`hooks/useSpeech.ts` no lo importa nadie** (todos usan `lib/hooks/useSpeech.ts`, que es otra
>   versión: 185 contra 108 líneas). Se mudó igual; a `§10` del ESTADO.
> - **Rodeo de entorno, medido aislado:** `npm install` de vitest 4.1.10 (y 5.0.5) junto a Vite
>   8.3.5 revienta en npm 10.9.2 (`Cannot read properties of null (reading 'edgesOut')`, en
>   `#loadPeerSet`); con **npm 11.19.1** instala, y el `npm ci` de npm 10 acepta ese lockfile. **En
>   `mobile/`, agregar dependencias se hace con `npx npm@11 install`**; la CI no cambia.
> - **El job `mobile` corre ahora los tests** antes del build.

> **`E.1.4` — hecha el 2026-10-31. Router: wouter 3.13.0** (decisión de Alejandro, entre wouter,
> React Router y TanStack Router: la app usa 15 `replace`, 1 `push`, 1 `back`, 2 `usePathname` y
> 2 `<Link>`, sin parámetros dinámicos). **0 imports de `next/` en `mobile/`**; build y 13 tests
> en verde. **Métrica de la tanda: 0 líneas cambiadas en `components/board/`** respecto de
> `develop` (7 renombres puros).
>
> - **Cómo se sustituyó:** `lib/navigation.ts` (25 líneas) da `useRouter()` y `usePathname()` con
>   la forma de Next sobre wouter, así que en 6 archivos cambió **sólo la línea del import**;
>   `<Link>` de wouter acepta `href` igual. Total en páginas y componentes: 11 líneas. `next/image`
>   → `<img>` con `color: transparent`, que es lo que ponía Next. `App.tsx` hace lo de
>   `app/layout.tsx`: mismo orden de montaje, `app/error.tsx` como error boundary, StrictMode como
>   el App Router. **Fuera a propósito:** `PWARegistry` (no hacía nada) y Analytics/SpeedInsights
>   de Vercel (esta app no se sirve desde Vercel).
> - **Corrección 5 resuelta sin tocar código:** `process.env.NEXT_PUBLIC_*` se sustituye en el build
>   con `define`, leyendo **sólo** las `NEXT_PUBLIC_` de `web/.env.local`. **Verificado en el
>   bundle, no en la config:** las 4 públicas con valor aparecen y los 5 secretos no. Una alarma
>   (`HF_API_URL`) resultó tener el mismo valor que la pública y que la URL escrita en el código.
> - **Corrección 8, no estaba en el plan: la UI llama a la API con rutas relativas** (6 llamadas a
>   `/api/...`, todas con sesión por cookie). En el navegador lo resuelve un proxy de Vite hacia el
>   Next de `web/`; **en el teléfono no funciona y es exactamente `E.3`**. Y una omisión de `E.1.3`:
>   `assets/favicon.png` (el logo del onboarding) se mudó aquí.
> - **Equivalencia medida contra el original**, con un worktree de `develop` (`1e281aa`) corriendo
>   Next: **tablero dentro de la app real, 0 diferencias** en las 45 celdas, incluido el tamaño de
>   cada imagen cargada, y el mismo comportamiento («yo» → barra; «personas» → título y 45 celdas).
>   **Onboarding, página entera:** 16 elementos, la única diferencia es el logo, 60×60.72 contra
>   60×60.94 — Next lo sirve reescalado a 64×65 y redondea la proporción; Vite usa el original
>   (332×336). **El route guard funciona:** `/chat` sin sesión redirige a `/onboarding`.
> - **Error de medición, corregido en el momento:** la primera medida del logo en Next se tomó antes
>   de que cargara (daba 60×60, el tamaño de los atributos). Las medidas esperan ahora a que todas
>   las imágenes estén completas.
> - **Qué no prueba:** ningún flujo con sesión (chat, cuidador, ajustes) se ejerció; el bundle es un
>   único JS de 978 kB (Next partía por ruta) — no afecta a la equivalencia, sí al arranque en E.2.

> **`E.1.5` — hecha el 2026-10-31. `web/` es landing + las 7 rutas.** La landing es mínima
> (decisión de Alejandro): logo y una línea; tiendas y legal (`P0-4`) cuando existan. **Verificación
> del plan, medida antes y después:** las 7 rutas, sin sesión y por HTTP, contra `develop` y contra
> la rama → **respuestas idénticas** en código, tipo, claves del JSON y destino de redirección
> (`health-check` 200; `cloudinary/sign`, `cloudinary/delete`, `push/subscribe`, `push/send` 401;
> `contacts/search` 400 — valida el cuerpo antes que la sesión; `/auth/confirm` 307). **Gate completo
> de `web/` en verde:** 3 avisos, 14 tests, **smoke 21/21**.
>
> - **El smoke cambió de expectativas, a propósito:** las 6 pantallas, el manifest y `sw.js` pasan a
>   esperar **404** — la prueba en ejecución de que salieron de `web/` — y entran las 5 rutas de API
>   sin sesión con su código medido (un 200 ahí sería una ruta que dejó de pedir sesión). Las dos
>   comprobaciones del service worker (no precachear el catálogo, CacheFirst de ARASAAC) **se van con
>   él**: vuelven en `E.1.6` si la app conserva service worker.
> - **`web/` pierde la PWA:** sin `next-pwa`, sin `app/manifest.ts`, sin cabeceras de `sw.js` en
>   `vercel.json`. `worker/index.ts` (push y clic en la notificación) **se mudó a `mobile/worker/`**
>   como insumo de `E.1.6`. Dependencias sin un solo import, quitadas: `@ducanh2912/next-pwa`, `clsx`,
>   `tailwind-merge`, `zustand`.
> - **Techo de lint de `web/`: de 88 a 3.** Los 85 avisos restantes se fueron con el código; dejar
>   88 habría admitido 85 avisos nuevos sin rojo. **Con control negativo:** `--max-warnings=2` sale
>   con 1. **`mobile/` todavía no tiene lint** — va antes de abrir el PR.
> - **Copias compartidas (deuda de `E.1.3`), resuelto distinto de lo previsto:** en vez de recortar
>   cada copia a lo que usa su lado, se quedan **idénticas y la CI falla si divergen** (`cmp`, primer
>   paso del job `mobile`). Recortar habría dejado el test de `SEC-2` de `web/` probando un
>   `extractPublicId` distinto del que corre en `mobile/`. **Con control negativo:** un byte de más en
>   una copia da exit 1.
> - **Consecuencia para `P0-7`, escrita en el ESTADO:** `/auth/confirm` redirige a `/onboarding`, que
>   ya no existe en `web/`; el paso 6 pasa a depender del *deep link* de `E.5`.
> - **Consecuencia de producto, aceptada por Alejandro:** cuando `E.1` llegue a `main`,
>   `picto-link-app-movil.vercel.app` sirve la landing y deja de servir la app. Producción no tiene
>   usuarios (última actividad en la base: 2026-07-29).
> - **Efecto colateral mío, sin daño:** el worktree de referencia comparte `node_modules` con `web/`
>   por un junction; al quitar `next-pwa` ya no puede volver a arrancar. Se midió antes de quitarlo.

> **`E.1.6` — hecha el 2026-10-31: la app no conserva service worker (`DEC-11` en el ESTADO, con
> motivo, alternativa descartada y costo).** Borrados `mobile/worker/index.ts` y la página
> `/offline`, que sólo existía como respaldo del service worker. El push lo sustituye `E.4`; los
> pictogramas sin red, el set propio empaquetado de `P0-1`. **Costo nuevo leído en el código:**
> `notifyNewMessage` espera `navigator.serviceWorker.ready` sin límite de tiempo y, sin service
> worker, deja de notificar en el navegador — queda para `E.4`.
>
> **Hallazgo de paso que no es de esta tanda: `SEC-17`.** Al medir si los avisos de workbox se
> habían ido con `next-pwa` (sí), `npm audit` mostró que **`next` 16.2.12 —la versión de
> producción— tiene 6 avisos críticos de ejecución remota de código**, con corrección en 16.4.3.
> Va por `hotfix/` desde `main`, no dentro de `E.1`. **Hecho el mismo día:** `hotfix/sec-17-next`
> (`c52327b`), y la misma subida en esta rama para que la integración con `develop` no choque en el
> lockfile.
>
> - **El smoke nuevo atrapó un service worker sobrante de verdad:** después de compilar `main` para
>   el hotfix, `next-pwa` dejó `web/public/sw.js` y compañía (ignorados por git) y al volver a esta
>   rama `/sw.js` respondía 200 → 20/21. Borrados, 21/21. En la CI, con checkout limpio, no pasa.
> - **Costo conocido, no implementado:** los navegadores que ya instalaron el service worker de
>   producción lo conservan aunque `/sw.js` pase a dar 404 — una actualización fallida no lo
>   desinstala. El remedio estándar es servir un `sw.js` que se desregistre. Producción no tiene
>   visitas desde 2026-07-29, así que se anota y no se hace.

> **Lint de `mobile/` — añadido el 2026-11-01, no estaba en el plan.** Sin él, los avisos que se
> mudaron con el código quedaban sin ningún control. **Mismas reglas que `web/`**, armadas a mano:
> `eslint-config-next` carga al importarse el parser de Babel del paquete `next`, y aquí no hay Next;
> se instalaron sus mismas piezas **en las mismas versiones que `web/`** (`typescript-eslint` hubo que
> fijarlo: npm traía 8.72.1 y `web/` usa 8.65.0). El plugin `@next/next` se carga porque el código
> trae `eslint-disable … @next/next/no-img-element`.
>
> - **Predicción escrita antes de medir: 85** (88 − los 3 que se quedaron en las rutas de `web/`).
>   **Medido: 86.** Comparado archivo por archivo y regla por regla contra el log de `develop`, la
>   única diferencia real es **+1 `@next/next/no-img-element` en `OnboardingFlow.tsx`: el `<img>` de
>   `E.1.4`**, que la predicción no contó. Techo **86**, con el motivo en `ci.yml`. **Control
>   negativo:** `--max-warnings=85` sale con 1.
> - El patrón de archivos suma `cjs` respecto de `eslint-config-next`: sin él, `postcss.config.cjs`
>   rompía el lint (la política de avisos citaba un plugin no cargado para ese archivo).
> - **Paso `Lint` en el job `mobile`**, antes de los tests: lo rápido primero.

> **`E.1.7` — hecha el 2026-11-01, y con otra fuente que la planeada: Roboto empaquetada.**
> **Medición, no impresión:** un recorrido automático de las **95 páginas** del tablero (2 939
> celdas con texto) marca cada etiqueta cuya palabra no cabe en el ancho de la celda o cuyo texto se
> sale del botón, en dos tamaños:
>
> | Fuente | 844×390 | 740×360 |
> |---|---|---|
> | Segoe UI (sistema, Windows — la línea base medible aquí) | 93 | 69 |
> | Inter empaquetada (lo planeado) | **112** | **82** |
> | Roboto (sistema en Android) | 51 | 30 |
> | **Roboto empaquetada (lo aplicado)** | **51** | **30** |
>
> - **El criterio del plan era imposible:** antes de tocar nada ya había 93 cortadas. Se cambió a
>   «no cortar más que la fuente del sistema»; Inter no lo cumplía (+20 nuevas, −1 en 844×390).
>   Alejandro eligió Roboto empaquetada: mismo aspecto en todo dispositivo (el objetivo de
>   `DEC-12`) y la que menos corta. Todas las cortadas lo son por ancho, ninguna por líneas.
> - **Verificado por el efecto:** la fuente calculada es `"Roboto Variable"`, `document.fonts`
>   la da por cargada, y la única petición de fuente es el `woff2` latino **local** (43 kB) — nada
>   a Google. El paquete lleva 9 subconjuntos, 231 kB; el navegador sólo baja el que necesita.
> - **Guionado automático (`hyphens: auto`, `lang="es"`): no concluyente.** Se aplicó (estilo
>   calculado `auto`) y no cambió nada; lo probable es que el Chromium de escritorio de Playwright
>   no traiga diccionarios de guionado. Queda como opción para `BUG-10`, a medir en Android.
> - **`BUG-10`** registra las 51 que siguen cortadas: problema previo al port, que se arregla con
>   los terapeutas y no aquí. Quitado también el `--font-inter` que `globals.css` definía y nada usaba.

#### Cierre de `E.1` — 2026-11-01, cerrada; se integra con su PR a `develop`

**Alcance cumplido: 7 tareas de 7** (`E.1.1`→`E.1.7`; la 7 añadida en ejecución) **más 1 no
planeada** (lint de `mobile/`). Queda funcionando de punta a punta: `mobile/` es una SPA de Vite que
arranca, enruta con wouter, aplica el route guard y renderiza el tablero **idéntico al de Next**
(medido contra un worktree de `develop`); `web/` es landing + las 7 rutas, que **responden idéntico**
sin sesión. Las dos apps tienen gate en la CI.

**Trazas:** rama `feature/e1-spa-fuera-de-next`, desde `develop` `1e281aa`. Commits `a079959`
(E.1.1), `ceba6d6` (E.1.2), `87e58f0` + `e62e078` (E.1.3), `a2cabb3` (E.1.4), `ead6d19` (E.1.5),
`22993e7` (E.1.6), `216e37f` + `eecf45d` (`SEC-17` y merge de `develop` con el hotfix), `52d6ed9`
(cierre de `SEC-17`), `27ad827` (lint), `a81dbf6` (E.1.7). Verificación final en limpio: `web/`
`verify:full` exit 0 (3 avisos, 14 tests, humo 21/21, Next 16.4.3); `mobile/` `npm ci`, lint (86),
tests (13 + 1 todo) y build, exit 0 los cuatro.

**Correcciones al plan: 10**, todas en este archivo. **6 numeradas:** 3→6 en la cabecera, la 7
(mudar también las páginas) en el resultado de `E.1.3` y la 8 (la API con rutas relativas) en el de
`E.1.4`. **4 sin número**, en los resultados: copias compartidas idénticas con `cmp` en vez de
recortadas (`E.1.5`), el criterio imposible de `E.1.7`, Roboto en lugar de Inter (`E.1.7`) y el lint
de `mobile/` como tarea nueva. (Las 1–2 de la cabecera son anteriores a `E.1`.)

**Decisiones nuevas:** `DEC-11`→`DEC-12` en el ESTADO (sin service worker; tipografía, revisada a
Roboto). En el plan: wouter como router. **Hallazgos nuevos en el ESTADO:** `SEC-17` (cerrada en el
día por hotfix) y `BUG-10`.

**Métricas (§6), antes → después.** Predichas por escrito antes de medir: **5 de 5 acertadas**; la
de líneas de código no se predijo.

| Métrica | Antes (`develop` `1e281aa`) | Después |
|---|---|---|
| Líneas reescritas de `components/board/` | 0 de 778 | **0 de 778** — 7 renombres al 100 % |
| Imports de `next/` en el bundle móvil | 21 *(cifra del 2026-08-24)* | **0** |
| Líneas de código de aplicación (`.ts`/`.tsx` sin tests ni config, `wc -l`) | `web/` 15 913 en 62 archivos | `web/` 1 429 en 17 + `mobile/` 14 969 en 51 = 16 398 en 68 |
| Tests verdes | 27 + 1 todo | 27 + 1 todo (`web/` 14, `mobile/` 13 + 1) |
| Techo de avisos de lint | 88 | `web/` **3** + `mobile/` **86** |
| Workflows de CI | 1 (1 job) | 1 (**2 jobs**) |
| Latencia tap→voz | sin medir | sin medir — es `E.2` |
| PAT filtrados en el historial público | 3 | no medido en esta tanda |

*El 9 346 de §6 se contó con un método que no quedó escrito; por eso la fila de líneas se re-midió
en `develop` con el mismo método que el «después», en vez de compararse con él.*

**Lo que deja sin hacer.**

*Lo que el plan previó y se cumplió:* equivalencia del tablero, 0 imports de Next, `web/` reducida
con las rutas intactas, decisión registrada sobre el service worker.

*Lo que no previó y salió de ejecutar* — la lista que enseña a planificar `E.2`:
- **La UI llama a la API con rutas relativas y sesión por cookie:** en el navegador lo cubre un
  proxy de Vite; en el teléfono no funciona hasta `E.3`. **`E.2` va a correr la app en Android sin
  poder iniciar sesión**: la medición tap→voz tiene que hacerse sin sesión (el tablero no la
  necesita para hablar).
- **`P0-7` paso 6 queda atado al *deep link* de `E.5`**: `/auth/confirm` redirige a una pantalla
  que ya no está en `web/`.
- **Notificaciones:** sin service worker, `notifyNewMessage` deja de notificar en el navegador
  (espera sin límite); lo sustituye `E.4`.
- **`BUG-10`:** 51 etiquetas cortadas con la mejor fuente; con terapeutas.
- **El bundle de `mobile/` es un único JS de 978 kB.** No afecta a la equivalencia, sí al arranque
  que mide `E.2`.
- **Deuda anotada:** 4 copias compartidas entre `web/` y `mobile/` (las sostiene el `cmp` de la CI);
  `eslint-disable … @next/next` en un proyecto sin Next; `hooks/useSpeech.ts` muerto; 4 de los 7
  archivos del tablero sin importar (368 líneas); el `sw.js` instalado en navegadores viejos no se
  desregistra; `vite.config.ts` lee el `.env` de `web/`.
- **Entorno:** en `mobile/`, agregar dependencias exige `npx npm@11 install` (bug de npm 10.9.2 con
  Vite 8); el `npm ci` de la CI no cambia.

> **Corrección después del cierre, 2026-11-01 — el primer CI del PR falló en `gate`.** Las 4
> comprobaciones nuevas de «API sin sesión» de `E.1.5` daban **500 en vez de 401**: la CI corre sin
> variables de entorno, el cliente de Supabase no se construye y la ruta revienta antes de mirar la
> sesión. En local daban 401 porque `next start` carga `web/.env.local` — **la medición «antes y
> después» se hizo con mi entorno, no con el de la CI**. Reproducido apartando `.env.local` (17/21,
> los mismos 4 × 500) y corregido con una URL y una clave **de relleno** a nivel del job `gate`
> (21/21): sin sesión, `getUser()` no llama a la red. A nivel de job porque Next incrusta
> `NEXT_PUBLIC_*` al compilar. **El job `mobile` pasó a la primera**: el lockfile de npm 11 instala
> con el `npm ci` de npm 10 en Linux.

---

### E.2 — Cáscara Android y la medición que decide

**Esta tanda existe para producir un número.** Todo lo que no haga falta para medir, no entra.

**Rama:** `feature/e2-capacitor-android` (se abre como dice §4).

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

**Rama:** `feature/e3-auth-por-tokens` (se abre como dice §4).

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

**Rama:** `feature/e4-push-nativo` (se abre como dice §4).

**Por qué hacen falta dos canales, y no uno siempre abierto.** Con la app en primer plano, el
mensaje llega por Supabase Realtime (WebSocket), como hoy. Con la app en segundo plano o cerrada,
iOS y Android suspenden la app y su socket: **el canal permanente lo mantiene el sistema
operativo**, y se llama APNs (Apple) y FCM (Google). Esta tanda construye ese segundo canal.

| # | Tarea | Verificación |
|---|---|---|
| **E.4.1** | 🔴 Releer `docs/superpowers/specs/2026-07-29-push-sin-service-role-design.md` **antes de escribir nada** | El diseño asumía que el camino nativo no estaba decidido. Ahora sí lo está: confirmar qué sigue en pie |
| E.4.2 | Tabla `device_tokens` + RLS, en Supabase **local en Docker** primero. **Supabase local no está montado** (medido el 2026-10-31: no existen `web/supabase/config.toml` ni `migrations/`), así que el primer paso es `supabase init` y pasar el esquema a migraciones | Migración contra un Postgres limpio |
| E.4.3 | ~~Sender a APNs/FCM, sustituyendo `web-push`~~ **El push lo dispara la base** *(corregido el 2026-10-31, `BUG-9`)*: trigger `AFTER INSERT` en `messages` y `group_messages` → Edge Function → FCM, que entrega también en iOS a través de APNs. Sustituye a `web-push` **y** a la llamada desde el cliente. El secreto de FCM vive en los secretos de la Edge Function. La autorización que hoy hace `/api/push/send` (contacto o membresía) ya la impuso RLS al aceptar el insert | **Control que distingue «lo dispara la base» de «lo dispara el cliente»:** insertar un mensaje **por SQL, sin ningún cliente emisor**, y que la notificación llegue al dispositivo real |
| E.4.4 | Retirar `push_subscriptions`, el worker de Web Push, `/api/push/send` y los dos `fetch` de los stores (`useChatStore.ts:250`, `useGroupStore.ts:340`) | Control negativo: nada quedó llamando al endpoint viejo |

> **Ninguna migración toca la base remota sin haber pasado por el Supabase local en Docker, y no
> se aplica sola al mergear: se aplica a propósito.**

---

### E.5 — TTS nativo, orientación y deep links

**Agrupadas porque fallan igual:** las tres son «el plugin nativo no está disponible → degradar al
equivalente web». Mismo modo de fallo, misma verificación.

**Rama:** `feature/e5-plugins-nativos` (se abre como dice §4).

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
