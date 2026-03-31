'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { createClient } from '@/lib/supabase/client';

// Root → redirect based on onboarding status and user profile after store hydration.
// - Not onboarded          → /onboarding
// - communicator           → /board  (AAC picto interface)
// - caregiver / companion  → /cuidador  (support network interface)
export default function RootPage() {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const isOnboarded = useProfileStore((s) => s.isOnboarded);
  const profile = useProfileStore((s) => s.profile);

  useEffect(() => {
    useProfileStore.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    async function checkAuthAndRoute() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !isOnboarded) {
        router.replace('/onboarding');
        return;
      }

      // Route by profile mode so the browser back button never crosses interfaces
      const dest = profile?.mode === 'caregiver' ? '/cuidador' : '/board';
      router.replace(dest);
    }

    checkAuthAndRoute();
  }, [ready, isOnboarded, profile?.mode, router]);

  return (
    <div className="flex h-dvh items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-[#FF8844] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
