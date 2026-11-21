-- Esquema base: volcado de produccion con `supabase db dump --linked` (solo lectura), 2026-11-11.
-- Lleva la version de la unica migracion registrada en produccion (add_analytics_events),
-- porque el resto del esquema se creo a mano fuera de migraciones y este volcado lo contiene todo.
-- Asi `db push` no ve historial divergente. No se edita: los cambios van en migraciones nuevas.




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."auto_create_reverse_contact"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$ BEGIN INSERT INTO public.contacts (user_id, contact_id, custom_name, role) SELECT NEW.receiver_id, NEW.sender_id, COALESCE(p.display_name, 'Nuevo contacto'), 'usuario' FROM public.profiles p WHERE p.id = NEW.sender_id ON CONFLICT (user_id, contact_id) DO NOTHING; RETURN NEW; END; $$;


ALTER FUNCTION "public"."auto_create_reverse_contact"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_group_with_members"("p_name" "text", "p_member_ids" "uuid"[] DEFAULT NULL::"uuid"[], "p_member_emails" "text"[] DEFAULT NULL::"text"[]) RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$ DECLARE v_group_id uuid; v_group json; v_resolved_ids uuid[]; BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF; SELECT array_agg(DISTINCT id) INTO v_resolved_ids FROM (SELECT u.id FROM unnest(COALESCE(p_member_emails, ARRAY[]::text[])) AS m_email JOIN auth.users u ON u.email = lower(trim(m_email)) WHERE u.id != auth.uid() UNION SELECT uid FROM unnest(COALESCE(p_member_ids, ARRAY[]::uuid[])) AS uid WHERE uid != auth.uid()) t; INSERT INTO public.groups (name, created_by) VALUES (p_name, auth.uid()) RETURNING id INTO v_group_id; INSERT INTO public.group_members (group_id, user_id) SELECT v_group_id, uid FROM unnest(array_cat(ARRAY[auth.uid()], COALESCE(v_resolved_ids, ARRAY[]::uuid[]))) AS t(uid) ON CONFLICT DO NOTHING; SELECT row_to_json(g.*) INTO v_group FROM public.groups g WHERE g.id = v_group_id; RETURN v_group; END; $$;


ALTER FUNCTION "public"."create_group_with_members"("p_name" "text", "p_member_ids" "uuid"[], "p_member_emails" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_group"("p_group_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    v_uid UUID := auth.uid();
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM groups WHERE id = p_group_id AND created_by = v_uid
    ) THEN
        RAISE EXCEPTION 'Only the group creator can delete the group';
    END IF;
    DELETE FROM group_messages WHERE group_id = p_group_id;
    DELETE FROM group_members  WHERE group_id = p_group_id;
    DELETE FROM groups         WHERE id = p_group_id;
END;
$$;


ALTER FUNCTION "public"."delete_group"("p_group_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_group_members_for_user"() RETURNS TABLE("group_id" "uuid", "user_id" "uuid")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT gm.group_id, gm.user_id
    FROM public.group_members gm
    WHERE gm.group_id IN (
        SELECT gm2.group_id
        FROM public.group_members gm2
        WHERE gm2.user_id = auth.uid()
    );
$$;


ALTER FUNCTION "public"."get_group_members_for_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_group_ids"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT group_id FROM public.group_members WHERE user_id = auth.uid();
$$;


ALTER FUNCTION "public"."get_my_group_ids"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("lookup_email" "text") RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'auth', 'public'
    AS $$
    SELECT id FROM auth.users WHERE email = lower(trim(lookup_email)) LIMIT 1;
$$;


ALTER FUNCTION "public"."get_user_id_by_email"("lookup_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_group_member"("p_group_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.group_members
        WHERE group_id = p_group_id
          AND user_id = auth.uid()
    );
$$;


ALTER FUNCTION "public"."is_group_member"("p_group_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."leave_group"("p_group_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    v_uid        UUID := auth.uid();
    v_created_by UUID;
BEGIN
    SELECT created_by INTO v_created_by FROM groups WHERE id = p_group_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Group not found'; END IF;
    IF v_created_by = v_uid THEN
        RAISE EXCEPTION 'Group creator cannot leave. Delete the group instead.';
    END IF;
    DELETE FROM group_members WHERE group_id = p_group_id AND user_id = v_uid;
END;
$$;


ALTER FUNCTION "public"."leave_group"("p_group_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_group_with_members"("p_group_id" "uuid", "p_name" "text", "p_description" "text" DEFAULT NULL::"text", "p_avatar_url" "text" DEFAULT NULL::"text", "p_add_ids" "uuid"[] DEFAULT NULL::"uuid"[], "p_add_emails" "text"[] DEFAULT NULL::"text"[], "p_remove_ids" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$ DECLARE v_uid uuid := auth.uid(); v_group groups%ROWTYPE; v_resolved_add_ids uuid[]; BEGIN SELECT * INTO v_group FROM public.groups WHERE id = p_group_id; IF NOT FOUND THEN RAISE EXCEPTION 'Group not found'; END IF; IF v_group.created_by != v_uid THEN RAISE EXCEPTION 'Only the group creator can edit the group'; END IF; UPDATE public.groups SET name = COALESCE(NULLIF(TRIM(p_name), ''), name), description = p_description, avatar_url = p_avatar_url WHERE id = p_group_id; IF p_remove_ids IS NOT NULL AND array_length(p_remove_ids, 1) > 0 THEN DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = ANY(p_remove_ids) AND user_id != v_uid; END IF; SELECT array_agg(DISTINCT id) INTO v_resolved_add_ids FROM (SELECT u.id FROM unnest(COALESCE(p_add_emails, ARRAY[]::text[])) AS m_email JOIN auth.users u ON u.email = lower(trim(m_email)) WHERE u.id != v_uid UNION SELECT uid FROM unnest(COALESCE(p_add_ids, ARRAY[]::uuid[])) AS uid WHERE uid != v_uid) t; IF v_resolved_add_ids IS NOT NULL AND array_length(v_resolved_add_ids, 1) > 0 THEN INSERT INTO public.group_members (group_id, user_id) SELECT p_group_id, uid FROM unnest(v_resolved_add_ids) AS uid WHERE NOT EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = p_group_id AND gm.user_id = uid); END IF; RETURN (SELECT row_to_json(g) FROM public.groups g WHERE g.id = p_group_id); END; $$;


ALTER FUNCTION "public"."update_group_with_members"("p_group_id" "uuid", "p_name" "text", "p_description" "text", "p_avatar_url" "text", "p_add_ids" "uuid"[], "p_add_emails" "text"[], "p_remove_ids" "uuid"[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."analytics_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_type" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."analytics_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "contact_id" "uuid" NOT NULL,
    "custom_name" "text" DEFAULT ''::"text" NOT NULL,
    "role" "text" DEFAULT 'Familia'::"text" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."contacts" REPLICA IDENTITY FULL;


ALTER TABLE "public"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."group_members" REPLICA IDENTITY FULL;


ALTER TABLE "public"."group_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text" DEFAULT ''::"text" NOT NULL,
    "pictograms" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."group_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "description" "text"
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "receiver_id" "uuid" NOT NULL,
    "content" "text" DEFAULT ''::"text" NOT NULL,
    "pictograms" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text" DEFAULT ''::"text" NOT NULL,
    "name" "text",
    "avatar_url" "text",
    "mode" "text" DEFAULT 'communicator'::"text" NOT NULL,
    "color_theme" "text" DEFAULT 'blue'::"text" NOT NULL,
    "grid_columns" integer DEFAULT 4 NOT NULL,
    "tts_enabled" boolean DEFAULT true NOT NULL,
    "tts_rate" numeric DEFAULT 1.0 NOT NULL,
    "tts_voice" "text",
    "user_type" "text",
    "plan_type" "text" DEFAULT 'free'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."push_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "endpoint" "text" NOT NULL,
    "subscription" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."push_subscriptions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_user_id_contact_id_key" UNIQUE ("user_id", "contact_id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_user_id_key" UNIQUE ("group_id", "user_id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_user_id_endpoint_key" UNIQUE ("user_id", "endpoint");



CREATE INDEX "idx_analytics_events_type_time" ON "public"."analytics_events" USING "btree" ("event_type", "created_at" DESC);



CREATE INDEX "idx_analytics_events_user_time" ON "public"."analytics_events" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_group_messages_group_time" ON "public"."group_messages" USING "btree" ("group_id", "created_at" DESC);



CREATE INDEX "idx_messages_conversation" ON "public"."messages" USING "btree" ("sender_id", "receiver_id", "created_at" DESC);



CREATE INDEX "idx_messages_receiver_read" ON "public"."messages" USING "btree" ("receiver_id", "read") WHERE ("read" = false);



CREATE OR REPLACE TRIGGER "on_message_auto_contact" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."auto_create_reverse_contact"();



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."push_subscriptions"
    ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."analytics_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "analytics_insert" ON "public"."analytics_events" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "contacts_delete" ON "public"."contacts" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "contacts_insert" ON "public"."contacts" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "contacts_select" ON "public"."contacts" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "creators can update groups" ON "public"."groups" FOR UPDATE USING (("created_by" = "auth"."uid"()));



ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "members can send messages" ON "public"."group_messages" FOR INSERT WITH CHECK ((("group_id" IN ( SELECT "group_members"."group_id"
   FROM "public"."group_members"
  WHERE ("group_members"."user_id" = "auth"."uid"()))) AND ("sender_id" = "auth"."uid"())));



CREATE POLICY "members can view groups" ON "public"."groups" FOR SELECT USING (("id" IN ( SELECT "group_members"."group_id"
   FROM "public"."group_members"
  WHERE ("group_members"."user_id" = "auth"."uid"()))));



CREATE POLICY "members can view messages" ON "public"."group_messages" FOR SELECT USING (("group_id" IN ( SELECT "group_members"."group_id"
   FROM "public"."group_members"
  WHERE ("group_members"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_insert" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (("sender_id" = "auth"."uid"()));



CREATE POLICY "messages_select" ON "public"."messages" FOR SELECT TO "authenticated" USING ((("sender_id" = "auth"."uid"()) OR ("receiver_id" = "auth"."uid"())));



CREATE POLICY "messages_update_read" ON "public"."messages" FOR UPDATE USING (("receiver_id" = "auth"."uid"())) WITH CHECK (("receiver_id" = "auth"."uid"()));



CREATE POLICY "own memberships" ON "public"."group_members" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_insert" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles_select" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "profiles_update" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "push_delete" ON "public"."push_subscriptions" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "push_insert" ON "public"."push_subscriptions" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "push_select" ON "public"."push_subscriptions" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."push_subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "push_update" ON "public"."push_subscriptions" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."contacts";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."group_members";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."group_messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."auto_create_reverse_contact"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_create_reverse_contact"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_create_reverse_contact"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_group_with_members"("p_name" "text", "p_member_ids" "uuid"[], "p_member_emails" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_group_with_members"("p_name" "text", "p_member_ids" "uuid"[], "p_member_emails" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_group_with_members"("p_name" "text", "p_member_ids" "uuid"[], "p_member_emails" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_group"("p_group_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_group"("p_group_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_group"("p_group_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_group_members_for_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_group_members_for_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_group_members_for_user"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_my_group_ids"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_my_group_ids"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_group_ids"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_group_ids"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("lookup_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("lookup_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("lookup_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_group_member"("p_group_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_group_member"("p_group_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_group_member"("p_group_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."leave_group"("p_group_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."leave_group"("p_group_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."leave_group"("p_group_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_group_with_members"("p_group_id" "uuid", "p_name" "text", "p_description" "text", "p_avatar_url" "text", "p_add_ids" "uuid"[], "p_add_emails" "text"[], "p_remove_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."update_group_with_members"("p_group_id" "uuid", "p_name" "text", "p_description" "text", "p_avatar_url" "text", "p_add_ids" "uuid"[], "p_add_emails" "text"[], "p_remove_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_group_with_members"("p_group_id" "uuid", "p_name" "text", "p_description" "text", "p_avatar_url" "text", "p_add_ids" "uuid"[], "p_add_emails" "text"[], "p_remove_ids" "uuid"[]) TO "service_role";


















GRANT ALL ON TABLE "public"."analytics_events" TO "anon";
GRANT ALL ON TABLE "public"."analytics_events" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_events" TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON TABLE "public"."group_messages" TO "anon";
GRANT ALL ON TABLE "public"."group_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."group_messages" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."push_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."push_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."push_subscriptions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































