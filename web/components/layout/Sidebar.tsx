'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, MessageSquare, Star, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: Zap },
    { href: '/board', label: 'Board', icon: LayoutGrid },
    { href: '/chat', label: 'Messages', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-200 py-4 flex-shrink-0">
            {/* Logo */}
            <div className="px-5 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <LayoutGrid size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">Picto<span className="text-blue-600">Link</span></span>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                                active
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon size={18} className={active ? 'text-blue-600' : 'text-gray-400'} />
                            {label}
                            {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Subscription CTA */}
            <div className="mx-3 mt-4 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                <Star size={16} className="mb-1.5" />
                <p className="text-xs font-bold">Upgrade to Pro</p>
                <p className="text-[10px] opacity-80 mt-0.5">Unlock 1,500+ pictograms</p>
                <Link
                    href="/subscription"
                    className="mt-2 block text-center text-xs font-bold bg-white/20 hover:bg-white/30 py-1.5 rounded-lg transition-colors"
                >
                    View Plans
                </Link>
            </div>
        </aside>
    );
}
