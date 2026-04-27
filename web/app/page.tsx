'use client';

/**
 * Root page — /
 *
 * Routing is handled in two layers:
 *  1. middleware.ts  (server-side, Edge): redirects unauthenticated users to
 *     /onboarding before React loads, so they never see this spinner.
 *  2. AppShell route guard (client-side): once Zustand hydrates and the
 *     session is verified, it redirects to /cuidador (caregiver) or /chat (AAC).
 *
 * This page only renders briefly while the AppShell gate clears.
 */
export default function RootPage() {
  return (
    <div className="flex h-dvh items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-[#FF8844] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
