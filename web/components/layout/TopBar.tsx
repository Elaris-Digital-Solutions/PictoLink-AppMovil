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
            className="flex-shrink-0 flex items-stretch bg-white safe-area-pb border-t border-black/20"
            style={{ height: 64 }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex-1 flex flex-col items-center justify-center gap-0.5 relative press-anim border-r border-black/10 last:border-r-0 transition-colors',
                            active ? 'bg-black text-white' : 'bg-white text-black'
                        )}
                    >
                        <Icon
                            size={21}
                            strokeWidth={active ? 2.8 : 2.2}
                            className={cn(
                                'transition-colors duration-150',
                                active ? 'text-white' : 'text-black'
                            )}
                        />

                        <span className={cn(
                            'text-[10px] font-semibold leading-none transition-colors duration-150',
                            active ? 'text-white' : 'text-black/85'
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
