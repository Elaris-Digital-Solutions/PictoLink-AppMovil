/**
 * lib/supabase/types.ts
 *
 * Hand-maintained Database type definitions for the Supabase client.
 * Kept in sync with the actual schema defined in supabase/schema.sql.
 */

import type { PictoNode } from '@/types';

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string;
                    avatar_url: string | null;
                    mode: string;
                    color_theme: string;
                    grid_columns: number;
                    tts_enabled: boolean;
                    tts_rate: number;
                    tts_voice: string | null;
                    plan_type: string;
                    created_at: string;
                };
                Insert: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>> & {
                    id?: string;
                    display_name: string;
                    mode: string;
                };
                Update: Partial<Database['public']['Tables']['profiles']['Row']>;
            };
            contacts: {
                Row: {
                    id: string;
                    user_id: string;
                    contact_id: string;
                    custom_name: string | null;
                    role: string | null;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    contact_id: string;
                    custom_name?: string | null;
                    role?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
            };
            messages: {
                Row: {
                    id: string;
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    pictograms: PictoNode[];
                    read: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    pictograms?: PictoNode[];
                    read?: boolean;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['messages']['Insert']>;
            };
            push_subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    endpoint: string;
                    subscription: Record<string, unknown>;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    endpoint: string;
                    subscription: Record<string, unknown>;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['push_subscriptions']['Insert']>;
            };
            groups: {
                Row: {
                    id: string;
                    name: string;
                    created_by: string;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    created_by: string;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['groups']['Insert']>;
            };
            group_members: {
                Row: {
                    id: string;
                    group_id: string;
                    user_id: string;
                    joined_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    user_id: string;
                    joined_at?: string;
                };
                Update: Partial<Database['public']['Tables']['group_members']['Insert']>;
            };
            group_messages: {
                Row: {
                    id: string;
                    group_id: string;
                    sender_id: string;
                    content: string;
                    pictograms: PictoNode[];
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    sender_id: string;
                    content: string;
                    pictograms?: PictoNode[];
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['group_messages']['Insert']>;
            };
        };
        Functions: {
            get_user_id_by_email: {
                Args: { lookup_email: string };
                Returns: string | null;
            };
        };
    };
}

// Convenience row types
export type DbProfile       = Database['public']['Tables']['profiles']['Row'];
export type DbMessage       = Database['public']['Tables']['messages']['Row'];
export type DbContact       = Database['public']['Tables']['contacts']['Row'];
export type DbGroup         = Database['public']['Tables']['groups']['Row'];
export type DbGroupMember   = Database['public']['Tables']['group_members']['Row'];
export type DbGroupMessage  = Database['public']['Tables']['group_messages']['Row'];
