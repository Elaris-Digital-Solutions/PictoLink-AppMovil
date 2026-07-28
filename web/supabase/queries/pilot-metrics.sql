-- ═══════════════════════════════════════════════════════════════════════════════
-- pilot-metrics.sql — métricas de uso del piloto
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Reemplaza al panel `/admin/metrics`, borrado el 2026-07-27. El panel era un
-- Server Component con `service_role` construido para una presentación puntual;
-- no forma parte del producto que se publica. Estas consultas conservan sus cinco
-- agregaciones sin desplegar código ni exponer una ruta privilegiada.
--
-- Cómo ejecutarlas:
--   · MCP de Supabase → `execute_sql` (una consulta por vez)
--   · Dashboard de Supabase → SQL Editor
--   · psql contra la cadena de conexión del proyecto
--
-- Todas son de solo lectura. Ninguna necesita `service_role` desde la app: se
-- ejecutan con las credenciales del panel de Supabase, que ya son privilegiadas.
--
-- Definición de "usuario activo" (la misma que usaba el panel): tiene al menos un
-- mensaje directo, un mensaje de grupo o un evento de analítica registrado.
--
-- ═══════════════════════════════════════════════════════════════════════════════


-- ── Q1 · Resumen general ──────────────────────────────────────────────────────
-- Equivale al bloque "Resumen general" (8 tarjetas) del panel.

with activos as (
    select sender_id as user_id from public.messages
    union
    select sender_id from public.group_messages
    union
    select user_id from public.analytics_events
),
perfiles_activos as (
    select p.mode
    from public.profiles p
    join activos a on a.user_id = p.id
),
sesiones as (
    -- El panel exigía que duration_s fuese numérico; `metadata` es jsonb sin
    -- `check`, así que puede traer cualquier cosa (ver SEC-11).
    select (metadata ->> 'duration_s')::numeric as duration_s
    from public.analytics_events
    where event_type = 'session_end'
      and jsonb_typeof(metadata -> 'duration_s') = 'number'
)
select
    (select count(*) from perfiles_activos)                            as usuarios_activos,
    (select count(*) from perfiles_activos where mode = 'caregiver')   as cuidadores,
    (select count(*) from perfiles_activos where mode = 'communicator') as comunicadores,
    (select count(*) from public.messages
      where jsonb_typeof(pictograms) = 'array'
        and jsonb_array_length(pictograms) > 0)                        as mensajes_pictograma,
    (select count(*) from public.messages
      where jsonb_typeof(pictograms) is distinct from 'array'
         or jsonb_array_length(pictograms) = 0)                        as mensajes_texto,
    (select count(*) from public.group_messages)                       as mensajes_grupales,
    (select count(*) from sesiones)                                    as sesiones_registradas,
    (select round(avg(duration_s)) from sesiones)                      as duracion_sesion_prom_s;


-- ── Q2 · Usuarios activos por día ─────────────────────────────────────────────
-- Equivale al gráfico de barras "Usuarios activos por día".

select
    fecha,
    count(distinct user_id) as usuarios_activos
from (
    select sender_id as user_id, created_at::date as fecha from public.messages
    union all
    select sender_id, created_at::date from public.group_messages
    union all
    select user_id, created_at::date from public.analytics_events
) t
group by fecha
order by fecha;


-- ── Q3 · Uso de features ──────────────────────────────────────────────────────
-- Equivale al bloque "Uso de features". El porcentaje es sobre usuarios activos,
-- no sobre el total de perfiles — igual que en el panel.

with activos as (
    select sender_id as user_id from public.messages
    union
    select sender_id from public.group_messages
    union
    select user_id from public.analytics_events
),
total as (
    select count(*)::numeric as n
    from public.profiles p
    join activos a on a.user_id = p.id
),
features as (
    select 'AACBoard (tablero de pictogramas)' as feature,
           count(distinct user_id) as usuarios
      from public.analytics_events
     where event_type = 'aacboard_opened'
    union all
    select 'Sintesis de voz (TTS)',
           count(distinct user_id)
      from public.analytics_events
     where event_type = 'voice_tts_used'
    union all
    select 'Mensajes con pictogramas',
           count(distinct sender_id)
      from public.messages
     where jsonb_typeof(pictograms) = 'array'
       and jsonb_array_length(pictograms) > 0
    union all
    select 'Grupos de conversacion',
           count(distinct user_id)
      from public.group_members
)
select
    f.feature,
    f.usuarios,
    case when t.n > 0 then round(100.0 * f.usuarios / t.n) else 0 end as pct_de_activos
from features f
cross join total t
order by f.usuarios desc;


-- ── Q4 · Simulador de límites freemium — contactos ────────────────────────────
-- Equivale al slider de contactos: para cada límite candidato, cuántos usuarios
-- lo superarían (= cuántos necesitarían plan pago). El panel lo hacía moviendo
-- un input range; acá se ve la curva entera de una vez.

with contactos_por_usuario as (
    select p.id, count(c.id) as n
    from public.profiles p
    left join public.contacts c on c.user_id = p.id
    group by p.id
),
limites as (
    select generate_series(1, greatest((select max(n) from contactos_por_usuario), 10)::int) as limite
)
select
    l.limite,
    count(*) filter (where c.n > l.limite)                                 as usuarios_que_superan,
    round(100.0 * count(*) filter (where c.n > l.limite) / nullif(count(*), 0)) as pct_de_usuarios
from limites l
cross join contactos_por_usuario c
group by l.limite
order by l.limite;


-- ── Q5 · Simulador de límites freemium — grupos ───────────────────────────────

with grupos_por_usuario as (
    select p.id, count(g.id) as n
    from public.profiles p
    left join public.group_members g on g.user_id = p.id
    group by p.id
),
limites as (
    select generate_series(1, greatest((select max(n) from grupos_por_usuario), 5)::int) as limite
)
select
    l.limite,
    count(*) filter (where g.n > l.limite)                                 as usuarios_que_superan,
    round(100.0 * count(*) filter (where g.n > l.limite) / nullif(count(*), 0)) as pct_de_usuarios
from limites l
cross join grupos_por_usuario g
group by l.limite
order by l.limite;


-- ── Q6 · Detalle por usuario ──────────────────────────────────────────────────
-- Equivale a la tabla ordenable "Detalle por usuario".

select
    p.id,
    coalesce(nullif(p.display_name, ''), '(sin nombre)') as nombre,
    p.mode,
    (select count(*) from public.messages m where m.sender_id = p.id)
      + (select count(*) from public.group_messages gm where gm.sender_id = p.id) as mensajes_enviados,
    exists (
        select 1 from public.analytics_events e
         where e.user_id = p.id and e.event_type = 'aacboard_opened'
    ) as uso_tablero,
    exists (
        select 1 from public.analytics_events e
         where e.user_id = p.id and e.event_type = 'voice_tts_used'
    ) as uso_tts,
    (select count(*) from public.contacts c where c.user_id = p.id)       as contactos,
    (select count(*) from public.group_members g where g.user_id = p.id)  as grupos,
    -- greatest() ignora los nulls, así que sirve aunque el usuario solo tenga
    -- actividad en una de las dos fuentes.
    greatest(
        (select max(created_at) from public.messages m where m.sender_id = p.id),
        (select max(created_at) from public.analytics_events e where e.user_id = p.id)
    ) as ultima_actividad,
    (
        select count(distinct d) from (
            select created_at::date as d from public.messages          where sender_id = p.id
            union
            select created_at::date from public.group_messages         where sender_id = p.id
            union
            select created_at::date from public.analytics_events       where user_id  = p.id
        ) dias
    ) as dias_activo
from public.profiles p
order by mensajes_enviados desc, nombre;
