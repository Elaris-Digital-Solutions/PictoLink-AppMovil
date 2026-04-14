/**
 * lib/supabase/types.ts
 *
 * Minimal Database type definition for Supabase client typing.
 * Replace with the generated types from `supabase gen types typescript`
 * once the project is linked.
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
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'> & {
                    id?: string;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
            };
            conversations: {
                Row: {
                    id: string;
                    participants: string[];
                    title: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    sender_id: string;
                    pictograms: PictoNode[];
                    text: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'> & {
                    id?: string;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['messages']['Insert']>;
            };
        };
    };
}

// Convenience row types
export type DbMessage = Database['public']['Tables']['messages']['Row'];
export type DbConversation = Database['public']['Tables']['conversations']['Row'];
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
