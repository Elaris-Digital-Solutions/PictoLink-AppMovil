'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, MessageSquare, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/lib/store/useProfileStore';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Home', icon: Zap },
    { href: '/board', label: 'Board', icon: LayoutGrid },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
];

// ─── Top bar (mobile header) ─────────────────────────────────────────────────

export function TopBar() {
    const pathname = usePathname();
    const profile = useProfileStore((s) => s.profile);

    const pageTitle = NAV_ITEMS.find((n) => pathname.startsWith(n.href))?.label ?? 'PictoLink';

    return (
        <>
            {/* Mobile header */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <LayoutGrid size={14} className="text-white" />
                    </div>
                    <h1 className="text-base font-bold text-gray-900">{pageTitle}</h1>
                </div>
                {profile && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                        {profile.avatar_emoji}
                    </div>
                )}
            </header>

            {/* Mobile bottom navigation */}
            <nav className="md:hidden flex items-center bg-white border-t border-gray-200 flex-shrink-0 safe-area-pb">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors',
                                active ? 'text-blue-600' : 'text-gray-400'
                            )}
                        >
                            <Icon size={22} />
                            <span className="text-[10px] font-semibold">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
