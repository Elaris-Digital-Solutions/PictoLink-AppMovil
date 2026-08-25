# Eliminar la service-role key y trasladar la autorización a Postgres

**Fecha:** 2026-07-29
**Rama:** `sec/push-sin-service-role`, a crear desde `main`. La rama actual
(`fix/sec-14-dependency-vulns`) tiene otro propósito y su trabajo —los
`overrides` de npm— pertenece a la Tanda 2.
**Estado:** propuesta, pendiente de aprobación

---

## 1. Contexto

`/api/push/send` devolvía `500 Invalid API key`. La causa raíz es que
`web/.env.local:22` contiene el texto de plantilla
`REEMPLAZAR_CON_SERVICE_ROLE_KEY_DE_SUPABASE` en vez de una clave real.

La solución inmediata sería pegar la clave. Se descarta: una clave que salta RLS
por completo es desproporcionada para leer endpoints de notificación, que es
funcionalidad accesoria.

El objetivo declarado del proyecto es migrar a apps nativas Android/iOS; el PWA
actual es banco de pruebas. La ruta nativa concreta (Capacitor, React
Native/Flutter, o nativo puro) ~~**aún no está decidida**~~, así que este diseño
asume el mínimo común denominador: **no existe ningún backend propio donde
alojar lógica de autorización**. Todo lo que proteja datos vive en Postgres.

> ⚠ **Corregido el 2026-08-24.** La frase era cierta al escribirse el 2026-07-29 y caducó:
> `DEC-1` se resolvió el 2026-08-24 → **Capacitor + Vite**. Se anota acá y no se reescribe el
> diseño porque **la premisa aguantó, y por un motivo mejor del que la sostenía**: no es que
> la ruta siguiera sin decidirse, es que la ruta elegida **tampoco aporta backend propio** —
> las 5 rutas de `web/` se quedan en Vercel y la app móvil las consume como cliente. La
> conclusión —«todo lo que proteja datos vive en Postgres»— sigue en pie.
>
> **Lo que sí cambia** y hay que releer antes de ejecutar la tanda `E.4`: este documento
> diseña sobre **Web Push (VAPID)**, que **no existe en WKWebView**. El transporte pasa a
> APNs/FCM con tabla `device_tokens`. La parte de autorización se conserva; la de transporte,
> no.

## 2. Objetivos

1. Eliminar `SUPABASE_SERVICE_ROLE_KEY` del proyecto.
2. Cerrar la enumeración de usuarios sin autenticar (ver 3.1).
3. Cerrar el canal de spam de push a usuarios arbitrarios (ver 3.2).
4. Que la autorización sobreviva íntegra a la migración a nativo.
5. Reconciliar `schema.sql` con la base real y volver a migraciones versionadas.

**No objetivo:** mejorar el PWA más allá de lo estrictamente necesario. Todo
código de Service Worker o específico de Web Push es desechable.

## 3. Hallazgos

Verificados contra la base real vía MCP de Supabase, no contra `schema.sql`
(que está desactualizado: la base tiene 9 funciones `SECURITY DEFINER` y el
archivo documenta tres; `list_migrations` devuelve una sola migración,
`20260603053137_add_analytics_events`, así que el schema se aplicó casi entero
fuera del sistema de migraciones).

### 3.1 Enumeración de usuarios sin autenticar — el más grave

Las 9 funciones `SECURITY DEFINER` son ejecutables por el rol `anon` vía
`/rest/v1/rpc/<nombre>`. Ocho no son explotables (autorizan con `auth.uid()`,
que es `NULL` para anon, o son funciones de trigger). Una sí:

```sql
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(lookup_email text)
 RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER
 SET search_path TO 'auth', 'public'
AS $function$
    SELECT id FROM auth.users WHERE email = lower(trim(lookup_email)) LIMIT 1;
$function$
```

No comprueba `auth.uid()`. Cualquiera con la anon key —pública por diseño, va en
el bundle JS— puede confirmar si un email tiene cuenta y obtener su UUID, el
mismo que se usa como `recipientId` y `contact_id`. En una app AAC el padrón
correlaciona con personas con discapacidad comunicativa, muchas menores: saber
que alguien está registrado ya es un dato sensible por asociación.

La función es necesaria (agregar contacto y crear grupo por email). El arreglo
es revocar `EXECUTE` de `anon`/`PUBLIC`, no eliminarla.

### 3.2 Spam de push a usuarios arbitrarios

`app/api/push/send/route.ts:70-79` valida que el **emisor** pertenezca al grupo,
nunca que el **destinatario** pertenezca:

```js
if (groupId) {
    const { data: membership } = await supabase.from('group_members')
        .select('user_id').eq('group_id', groupId).eq('user_id', user.id);
```

Con un `groupId` propio se puede enviar una push a cualquier UUID del sistema.

### 3.3 Un uso del service client es innecesario

La lectura de `profiles.mode` (línea 105) usa el cliente service-role, pero la
política `profiles_select` es `using (true)`: cualquier autenticado lee
cualquier perfil. Pasa al cliente normal sin más.

### 3.4 Los fallos de push son invisibles desde el cliente

`useChatStore.ts:254` y `useGroupStore.ts:348` hacen
`fetch(...).catch(() => {})`. `fetch` no rechaza ante un status HTTP de error,
así que el `.catch()` nunca ve un 500. El efecto deseado (no romper el chat) se
cumple, pero por omisión y no por diseño: ningún fallo de push es observable.
Por eso el 500 pasó semanas desapercibido.

### 3.5 Dos funciones muertas

`is_group_member` y `get_my_group_ids` no se invocan desde el código, ni desde
políticas RLS (`pg_policies` no las referencia), ni desde otras funciones
(verificado con `pg_get_functiondef`). Son restos de una versión anterior.

## 4. Decisiones de diseño

### 4.1 La autorización vive en la función, no en el route handler

El handler es solo una de las puertas: la RPC es invocable directamente vía
`/rest/v1/rpc/`. Al mover la comprobación dentro de la función `SECURITY
DEFINER`, la puerta es única. La validación duplicada del handler (líneas 70-90)
se elimina para que no puedan divergir.

Esto es además prerrequisito de la migración: en nativo no existe el route
handler donde poner la comprobación.

### 4.2 El prune de endpoints expirados se elimina sin reemplazo

Se evaluaron cuatro opciones:

| Opción | Veredicto |
|---|---|
| `prune_push_endpoints` (`SECURITY DEFINER`) | **Descartada.** Expone borrado sobre datos ajenos: un usuario autenticado podría desactivar las notificaciones de un contacto sin dejar rastro. |
| Columna `last_seen_at` + borrado a los 60 días | **Descartada.** Heurística temporal: borra suscripciones válidas de dispositivos poco usados (tablet de aula en vacaciones). Falsos positivos reales. |
| Listener `pushsubscriptionchange` en el SW | **Descartada por el objetivo nativo.** Técnicamente la mejor para un PWA de producción —el dueño actualiza su propia fila vía `push_update`, sin borrar nada ni exponer nada— pero es código de Service Worker que se tira en la migración. |
| **Eliminar el bloque sin reemplazo** | **Elegida.** |

Coste aceptado: los endpoints muertos se acumulan (pocos por persona) y cada uno
genera un intento HTTP fallido por mensaje, que `Promise.allSettled` ya absorbe
sin afectar a los demás envíos. Si llega a molestar, se resuelve después con una
columna `failure_count` que borre tras N respuestas 410 reales —señal cierta— en
lugar de una suposición basada en el calendario.

### 4.3 La firma de la función es neutral respecto a la plataforma

`get_push_targets`, no `get_web_push_subscriptions`. `push_subscriptions` con
`endpoint` + `subscription jsonb` es un esquema web-first (Web Push/VAPID);
FCM y APNs usan device tokens. El nombre y la firma aguantan tokens nativos
añadiendo una columna `platform` más adelante.

## 5. Cambios en la base de datos

Se aplican como migraciones vía MCP (`apply_migration`), no por SQL Editor.

### Migración 1 — `revoke_public_execute_on_definer_functions`

```sql
-- Funciones invocadas desde el cliente autenticado: solo authenticated.
revoke execute on function public.get_user_id_by_email(text) from anon, public;
grant  execute on function public.get_user_id_by_email(text) to authenticated;

revoke execute on function public.get_group_members_for_user() from anon, public;
grant  execute on function public.get_group_members_for_user() to authenticated;

revoke execute on function public.create_group_with_members(text, uuid[], text[]) from anon, public;
grant  execute on function public.create_group_with_members(text, uuid[], text[]) to authenticated;

revoke execute on function public.update_group_with_members(uuid, text, text, text, uuid[], text[], uuid[]) from anon, public;
grant  execute on function public.update_group_with_members(uuid, text, text, text, uuid[], text[], uuid[]) to authenticated;

revoke execute on function public.delete_group(uuid) from anon, public;
grant  execute on function public.delete_group(uuid) to authenticated;

revoke execute on function public.leave_group(uuid) from anon, public;
grant  execute on function public.leave_group(uuid) to authenticated;

-- Función de trigger: corre como owner, nadie necesita EXECUTE.
revoke execute on function public.auto_create_reverse_contact() from anon, authenticated, public;

-- Funciones muertas (ver 3.5): se revocan; su eliminación va aparte.
revoke execute on function public.is_group_member(uuid) from anon, authenticated, public;
revoke execute on function public.get_my_group_ids() from anon, authenticated, public;
```

Seguridad del cambio verificada: las 6 llamadas RPC del código
(`app/api/contacts/search/route.ts:23`, `app/cuidador/page.tsx:525,556,571,897`,
`lib/store/useGroupStore.ts:164`) salen de contextos autenticados, y ninguna
política RLS invoca estas funciones.

### Migración 2 — `add_get_push_targets`

```sql
create or replace function public.get_push_targets(
    p_recipient uuid,
    p_group_id  uuid default null
)
returns table (endpoint text, subscription jsonb)
language plpgsql
stable
security definer
set search_path = 'public'
as $$
declare
    v_uid uuid := auth.uid();
begin
    if v_uid is null then
        raise exception 'Not authenticated';
    end if;

    if p_group_id is not null then
        -- Ambos lados deben pertenecer al grupo. Validar solo al emisor
        -- permitiría enviar push a cualquier UUID (ver 3.2).
        if not exists (
            select 1 from group_members
            where group_id = p_group_id and user_id = v_uid
        ) or not exists (
            select 1 from group_members
            where group_id = p_group_id and user_id = p_recipient
        ) then
            raise exception 'Not authorized for this group';
        end if;
    else
        if not exists (
            select 1 from contacts
            where user_id = v_uid and contact_id = p_recipient
        ) then
            raise exception 'Recipient is not a contact';
        end if;
    end if;

    return query
        select ps.endpoint, ps.subscription
        from push_subscriptions ps
        where ps.user_id = p_recipient;
end;
$$;

revoke execute on function public.get_push_targets(uuid, uuid) from anon, public;
grant  execute on function public.get_push_targets(uuid, uuid) to authenticated;
```

`set search_path = 'public'` es obligatorio: sin él, un atacante podría anteponer
un schema propio con una tabla `push_subscriptions` falsa y secuestrar la
consulta. Sigue el patrón ya usado por el resto de funciones del proyecto.

## 6. Cambios en el código

| Archivo | Cambio |
|---|---|
| `app/api/push/send/route.ts` | Eliminar `getServiceClient()` y el import de `createClient`. `profiles.mode` pasa al cliente normal (3.3). Las suscripciones vienen de `.rpc('get_push_targets', { p_recipient, p_group_id })`. Eliminar la autorización duplicada (70-90) y el bloque de prune (154-171). |
| `web/.env.local` | Eliminar la línea `SUPABASE_SERVICE_ROLE_KEY`. |
| Vercel | Eliminar la variable si estuviera configurada. |

`app/api/push/subscribe/route.ts` no se toca.

## 7. Manejo de errores

| Situación | Respuesta |
|---|---|
| Sin sesión | `401 {error:'Unauthorized'}` |
| La función rechaza la autorización | `403 {error:'Forbidden'}` |
| Faltan las claves VAPID | `200 {ok:true, sent:0, reason:'push-not-configured'}` + log |
| Sin suscripciones | `200 {ok:true, sent:0}` |
| Envío normal | `200 {ok:true, sent, failed}` |

Ya no existe ningún 500 por configuración, porque no queda clave que pueda
faltar. Las VAPID degradan en vez de fallar: la push es accesoria y no debe
teñir de error un mensaje que sí se entregó.

El punto 3.4 (fallos invisibles en el cliente) queda **fuera de alcance** de esta
tanda y se documenta como deuda conocida.

## 8. Verificación

**Restricción conocida:** el proyecto no tiene infraestructura de tests de
integración contra Supabase. `npm run verify` cubre typecheck, lint y tests
unitarios sobre módulos puros; `test:smoke` interroga el build por HTTP. Ninguno
puede ejercitar una función de Postgres con una identidad concreta. Montar esa
infraestructura es un proyecto en sí mismo y queda fuera de esta tanda.

En su lugar, verificación mediante SQL directo vía MCP, simulando cada
identidad dentro de una transacción que se revierte:

```sql
begin;
set local role authenticated;
set local request.jwt.claims = '{"sub":"<uuid-del-emisor>"}';
select * from public.get_push_targets('<uuid-destinatario>', null);
rollback;
```

Un caso por rama de autorización:

1. Contacto válido → devuelve las suscripciones del destinatario
2. No-contacto → excepción
3. Miembro de grupo con destinatario miembro → devuelve suscripciones
4. Miembro de grupo con destinatario **fuera** del grupo → excepción (regresión de 3.2)
5. `set local role anon` → excepción por falta de `EXECUTE`

Comprobación de permisos: reejecutar `get_advisors(security)` tras aplicar y
confirmar que desaparecen los 18 avisos
`anon_security_definer_function_executable` /
`authenticated_security_definer_function_executable`.

Verificación funcional manual: enviar un mensaje P2P y uno de grupo con el
servidor de desarrollo, confirmar `200` en el log y que la notificación llega.

Extender `tests/smoke` para verificar que `/api/push/send` no responde 500 sin
la variable `SUPABASE_SERVICE_ROLE_KEY` presente — esto sí entra en la
infraestructura existente.

## 9. Fuera de alcance

- Los N `fetch` por miembro de grupo (`useGroupStore.ts:339`): un POST por
  destinatario. Ineficiencia real, ajena a este objetivo.
- `analytics_events`: perdió su lector al borrarse el panel admin.
- Hacer observables los fallos de push en el cliente (3.4).
- `DROP` de las dos funciones muertas (3.5): se revocan ahora, se eliminan aparte.
- Habilitar leaked password protection (aviso de `get_advisors`).
- Tanda 2: `.env.example` + excepción en `.gitignore`, corregir
  `ESTADO-DEL-PROYECTO.md:401`, `overrides` de npm.

## 10. Riesgos

| Riesgo | Mitigación |
|---|---|
| El `REVOKE` rompe un flujo no detectado | Verificadas las 6 llamadas RPC del código, las políticas RLS y las dependencias entre funciones. Revertir es un `GRANT`. |
| `schema.sql` sigue divergiendo | La reconciliación es el punto 4 de la tanda; a partir de ahí, migraciones vía MCP. |
| El esquema `push_subscriptions` no sirve para FCM/APNs | Asumido. La firma de `get_push_targets` es neutral (4.3); se amplía con `platform` cuando toque. |

## 11. Orden de ejecución

1. Migración 1 (`REVOKE`) y verificar con `get_advisors`
2. Migración 2 (`get_push_targets`) + tests de autorización
3. Refactor de `app/api/push/send/route.ts`
4. Eliminar la variable de `.env.local` y de Vercel
5. Verificación funcional: enviar mensaje P2P y de grupo, confirmar `200` y que
   la notificación llega
6. Reconciliar `schema.sql` con la base real
