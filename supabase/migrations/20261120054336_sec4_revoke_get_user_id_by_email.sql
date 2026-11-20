-- SEC-4: get_user_id_by_email (SECURITY DEFINER, lee auth.users) la podía llamar cualquiera con la
-- clave anónima, sin sesión: un oráculo de correos abierto. Desde ahora sólo service_role, que es
-- como la llama /api/contacts/search después de exigir sesión. Así la única puerta es la ruta, y
-- ahí se le puede poner límite de frecuencia.
--
-- No cierra SEC-10: create_group_with_members y update_group_with_members siguen resolviendo
-- correos contra auth.users para cualquier autenticado.
--
-- Idempotente: REVOKE de un permiso que no está no falla. No se aplica sola al mergear: se aplica
-- a propósito a la base remota, después de pasar por el Supabase local.

REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(text) FROM PUBLIC, anon, authenticated;
