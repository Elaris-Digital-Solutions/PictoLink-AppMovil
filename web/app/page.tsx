'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/store/useProfileStore';

// Root → redirect based on onboarding status after store hydration
export default function RootPage() {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const isOnboarded = useProfileStore((s) => s.isOnboarded);

  useEffect(() => {
    useProfileStore.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    router.replace(isOnboarded ? '/board' : '/onboarding');
  }, [ready, isOnboarded, router]);

  return (
    <div className="flex h-dvh items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-[#FF8844] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
