import { getSupabase } from '@/lib/supabase/client';
import { useProfileStore } from '@/lib/store/useProfileStore';

// Fire-and-forget: never awaited, never throws. Safe to call anywhere client-side.
export function trackEvent(
  eventType: string,
  metadata: Record<string, unknown> = {}
) {
  const userId = useProfileStore.getState().profile?.id;
  if (!userId) return;

  void (async () => {
    await getSupabase()
      .from('analytics_events')
      .insert({ user_id: userId, event_type: eventType, metadata });
  })().catch(() => {});
}
