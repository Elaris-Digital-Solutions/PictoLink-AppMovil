# Revisión del terapeuta — Pendientes y decisiones diferidas

> Avance parcial del tablero AAC (`aac-grid-layout.ts`), revisión del 3-jun. Alcance: Inicio → Comida.
> Este archivo lista lo que quedó **pendiente** o **diferido para el final**, para no bloquear el avance.

## Diferido para el final — decisión de librería de pictogramas

El terapeuta pidió interrogativos con estilo **"persona + ?"** (tipo SymbolStix/Proloquo). **ARASAAC** (librería actual de la app) **no tiene** ese estilo para todas:

| Palabra | Estado | Nota |
|---|---|---|
| quién | ✅ resuelto | ARASAAC `9853` ya en uso, coincide con el estilo pedido |
| qué | ⏸️ pendiente | ARASAAC solo tiene "?" abstracto o contextual. No hay versión persona+? |
| dónde | ⏸️ pendiente | Igual que qué. Actual `7764` ("?" tachado) está mal y debe cambiarse |
| más | ⏸️ pendiente | Actual `3220` es signo "+". Mejor opción ARASAAC `32753` ("quiero más") quedó sin aprobar |
| algo | ⏸️ pendiente | Pronombre abstracto, sin imagen ARASAAC clara. Actual `38768` = **"chocar contra algo"** (mal), 1 celda usa `2413` = "grapadora" (mal). 38 celdas en total. |
| abrigar | ⏸️ pendiente | Verbo sin match ARASAAC ("abrigarse" 404). La única opción ("calentarse"/fuego 18446) no convenció. Actual `29977` (tienda de ropa). ropa rop-35. |

**✅ DECIDIDO (2026-07-27):** se encarga un **set propio generado con IA**. ARASAAC queda como mockup provisional hasta que el set propio esté listo. Ver `P0-1` en `ESTADO-DEL-PROYECTO.md`.

Consecuencia para esta tabla: los 5 diferidos (`qué`, `dónde`, `más`, `algo`, `abrigar`) dejan de ser un problema de catálogo — eran justo lo que ARASAAC no cubría. **Pasan a ser casos de prueba de la guía de estilo del set propio**, incluido el estilo "persona + ?" que pidió el terapeuta. Mientras tanto las celdas siguen SIN tocar (mantienen su picto actual aunque sea incorrecto).

### Mecanismo de imágenes locales (nuevo)

Para conceptos que ARASAAC no cubre, hay un mapa `PICTO_OVERRIDES` en `aac-grid-layout.ts` (etiqueta → ruta local) que `AACButton` usa con prioridad sobre `pictogramId`. Las imágenes van en `web/public/pictos/`. Sirve para aplicar imágenes propias/externas sin tocar cada celda.

**Resueltos con imagen local (jun 2026):**
- anaranjado → `/pictos/anaranjado.png` (mancha naranja generada recoloreando la mancha roja de ARASAAC).
- celeste → `/pictos/celeste.png` (ídem, celeste).
- dedo del pie → `/pictos/dedo-del-pie.png` (Global Symbols set 110, clipart pie+flecha).
- uña del pie → `/pictos/una-del-pie.png` (ídem).
- manos sucias → `/pictos/manos-sucias.png` (Global Symbols set 96, mano con suciedad).
- *Atribución/licencia pendiente de revisar:* manchas = derivado de ARASAAC (CC BY-NC-SA); dedo/uña/manos sucias = Global Symbols sets 110/96 (verificar licencia antes de publicar).
  - **⚠️ 2026-07-27:** ya no hace falta verificar la licencia de Global Symbols — esos 3 se regeneran con el set propio. Pero **las manchas de color hay que regenerarlas desde cero, no recolorear**: recolorear un picto ARASAAC produce obra derivada que hereda el `NC`, y eso reintroduce en el set propio el problema que se pretende eliminar. La misma regla aplica a todo el pipeline de IA: generar desde prompt de texto, nunca `img2img` ni fine-tune sobre el catálogo ARASAAC.

## Avance aplicado — Sprint D (Cuidado personal) ✅

- Pictogramas corregidos (ARASAAC): crema de afeitar→2750, rasuradora eléctrica→4941, corte de cabello→27696, secadora→2560 (secador de pelo), cabello corto→28683, enredado→16293, maquillaje→34745, rubor→3017 (colorete), pañal limpio→22017 (diferenciado de mojado), rosado(maquillaje)→2807.
- Renames: estuche→neceser, broche para cabello→gancho, liga para el cabello→liga, coletas→cola, fijador de cabello→gel (picto 3335), brocha de maquillaje→brocha.
- Eliminados + compactado: bragapañal, espejo de mano, frenos, jabón para manos, navaja, paladar móvil, plancha, tenazas, esponja, cola de caballo, peineta, cabello rizado, base, polvo suelto.
- "manos sucias" → imagen local (PICTO_OVERRIDES). "desodorante" ya existía. "cabello lacio" no existía.
- Verificado: 0 residuales, tsc OK.

## Resueltos

- **"ya terminé"** (núcleo) → **`28429`** ("terminar", brazos cruzados). ✅ Aplicado en 77 páginas.

## Bugs de pictograma confirmados (apuntan a algo no relacionado)

- "dormir" en Acciones (`acc-14`) → `11749` = **"hacer"**. Mal.
- "dormir" en Ayuda (`ayu-23`) → `2863` = **"pañal"**. Mal.
- "está bien" en Cuerpo (`bod-16`) → `39393` = **"ocho y cuarto"** (reloj). Mal. (Sprint C)

## Avance aplicado

- **Sprint B — Empleos** ✅ (aplicado al archivo de datos):
  - Renombres: custodio→**acompañante** (picto 7163→38378), guardia→**guardián**, mesero→**mozo** (fusiona camarero), plomero→**gasfitero**.
  - Pictograma: **niñera** 6281→**26300** ("pasear al bebé").
  - Eliminados + compactado: camarero, vaquero, agente (pág. 1); caballero, luchador, mago, princesa, rey (pág. 2). Profesiones recompactadas sin huecos; núcleo y Más/Atrás intactos.
  - **Personajes:** eliminados Genie, Grug ("gruge"), Rayo McQueen, Aayla ("Ayala"), troll, Bart Simpson. Compactado; "vampiro" subido desde la antigua página 2; **`personajes_2` eliminada** (solo tenía vampiro) y su botón "Más" reemplazado por "Atrás".
  - **Noticias:** eliminado Barack Obama.
  - **Duplicado en Personas:** "joven" estaba dos veces (mismo picto 26146) → se dejó una. (Nota: queda un slot vacío en pos 22 de la página `personas`, sin compactar para no mover los accesos a subcarpetas.)
  - Verificado: 0 referencias rotas, `tsc --noEmit` OK.

- **Sprint C — Cuerpo + Ropa** ✅ (aplicado):
  - Pictogramas: está bien 39393→**5397** (pulgar); rosado(colores_ropa) 27131→**2807** (mancha rosa); "pie derecho"+"pie izquierdo" **unificados en "pies"** (37227) — ARASAAC no distingue izq/der.
  - Renombres: trasero→**poto**; piyama→**pijama**; polera→**polo** (y eliminado el "polo" duplicado de ropa_2); abrir cremallera→**abrir cierre**.
  - Eliminados + compactado: "parte del cuerpo" (cuerpo_2), "zapatos de Tap" (calzado), "corbata de moño" y "sombrero de copa" (ropa), "manoplas" (fusionada en guantes).
  - Agregados: **saco** (3296) y **bufanda** (2290) en ropa. (El terapeuta pidió "chalina" pero el usuario decidió nombrarlo "bufanda".)
  - Verificado: 0 etiquetas eliminadas residuales, tsc OK.
  - PENDIENTE en este sprint (ver tabla arriba): anaranjado, celeste, dedo del pie, uña del pie, abrigar.

---
## Avance aplicado — Sprint E (Muebles + Animales) ✅

- **Muebles:** pictogramas librero→37937, hamaca→24563 (colgante), banca→3255 (de parque), silla de playa→4764 (la tumbona reusada), sillón reclinable→25475. Renombre: espejo→espejo de baño. Eliminados+compactado: reloj, ropero (se deja armario), archivo, barra de cocina, buró, mueble para tv, alfombra (duplicada), mesa de centro (redundante con "mesa"). tsc OK.
- **Animales:** creadas 5 subcarpetas (`animales_domesticos`, `animales_granja`, `animales_salvajes`, `animales_insectos`, `animales_acuaticos`), cada una con verbo **acariciar** (27407) + núcleo reducido + animales (IDs ARASAAC). Botones agregados a la página `animales`. **BORRADOR para validación del terapeuta** (selección de animales e imágenes a revisar). "chancho" usa picto de cerdo (2327, término Perú). Descartados por no estar en catálogo: cuy, oruga.

---
*Última actualización: Sprint E COMPLETO. Diferidos: qué, dónde, más, algo, abrigar. Próximo: Sprint F (Ayuda → subcarpeta "algo anda mal" con partes del cuerpo / escala de dolor / médico / síntomas — estructura nueva).*
