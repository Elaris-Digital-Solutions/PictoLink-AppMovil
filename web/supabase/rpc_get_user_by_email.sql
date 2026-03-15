-- ─── RPC: Buscar usuario por email ──────────────────────────────────────────
-- SECURITY DEFINER permite que la función vea auth.users aunque el cliente
-- no tenga acceso directo a esa tabla. Solo devuelve el id del perfil.
-- Ejecuta esto en el SQL Editor de Supabase antes de añadir contactos.

create or replace function public.get_user_id_by_email(lookup_email text)
returns uuid
language sql
security definer
stable
as $$
  select id 
  from auth.users 
  where lower(email) = lower(lookup_email)
  limit 1;
$$;

-- Permite que cualquier usuario autenticado llame a la función
grant execute on function public.get_user_id_by_email(text) to authenticated;
