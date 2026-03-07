'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, MessageCircle, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { href: '/board',     label: 'Tablero',  icon: LayoutGrid },
    { href: '/chat',      label: 'Mensajes', icon: MessageCircle },
    { href: '/dashboard', label: 'Inicio',   icon: Home },
    { href: '/settings',  label: 'Ajustes',  icon: Settings },
] as const;

// ─── BottomNav ────────────────────────────────────────────────────────────────
// Universal bottom navigation — visible on every screen.

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="flex-shrink-0 flex items-stretch bg-white border-t-2 border-gray-100 safe-area-pb"
            style={{ height: 60 }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex-1 flex flex-col items-center justify-center gap-1 transition-colors',
                            active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                        )}
                    >
                        <Icon
                            size={24}
                            strokeWidth={active ? 2.5 : 1.8}
                            className={active ? 'text-blue-600' : 'text-gray-400'}
                        />
                        <span className={cn(
                            'text-[10px] font-bold leading-none',
                            active ? 'text-blue-600' : 'text-gray-400'
                        )}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

/** @deprecated Use BottomNav instead */
export function TopBar() { return null; }
