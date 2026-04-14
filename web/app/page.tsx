'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { createClient } from '@/lib/supabase/client';

// Root → redirect based on onboarding status and user profile.
//
// AppShell (parent) blocks render until Zustand has hydrated from localStorage,
// so by the time this page runs isOnboarded and profile are already correct.
//
// Fast path  — store says logged in → redirect immediately (no network call).
// Slow path  — store says not onboarded → verify with Supabase in case the
//              cookie session is still valid but the store was cleared.
export default function RootPage() {
  const router = useRouter();
  const isOnboarded = useProfileStore((s) => s.isOnboarded);
  const profile = useProfileStore((s) => s.profile);

  useEffect(() => {
    // Fast path: store is already hydrated with a valid profile → go immediately.
    if (isOnboarded && profile) {
      const dest = profile.mode === 'caregiver' ? '/cuidador' : '/chat';
      router.replace(dest);
      return;
    }

    // Slow path: store has no profile — check if a Supabase session exists
    // (e.g. localStorage was cleared but the cookie is still valid).
    async function checkSession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/onboarding');
      }
      // If session exists but no profile in store, send to onboarding to rebuild profile.
      else {
        router.replace('/onboarding');
      }
    }

    checkSession();
  }, [isOnboarded, profile, router]);

  return (
    <div className="flex h-dvh items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-[#FF8844] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
