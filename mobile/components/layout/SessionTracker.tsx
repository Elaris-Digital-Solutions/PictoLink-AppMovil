'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { trackEvent } from '@/lib/analytics';

export function SessionTracker() {
  const profileId = useProfileStore((s) => s.profile?.id);

  useEffect(() => {
    if (!profileId) return;

    trackEvent('session_start');
    const startTime = Date.now();

    function endSession() {
      const duration_s = Math.round((Date.now() - startTime) / 1000);
      trackEvent('session_end', { duration_s });
    }

    window.addEventListener('beforeunload', endSession);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') endSession();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', endSession);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [profileId]);

  return null;
}
