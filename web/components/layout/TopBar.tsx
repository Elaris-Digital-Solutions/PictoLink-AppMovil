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
            className="flex-shrink-0 flex items-stretch bg-white/95 backdrop-blur-md safe-area-pb nav-shadow"
            style={{ height: 64 }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 relative press-anim"
                    >
                        {/* Top active bar */}
                        <div className={cn(
                            'absolute top-0 rounded-b-full transition-all duration-300',
                            active ? 'w-8 h-1 bg-blue-500' : 'w-0 h-1 bg-transparent'
                        )} />

                        {/* Icon with pill bg when active */}
                        <div className={cn(
                            'w-14 h-8 rounded-2xl flex items-center justify-center transition-all duration-200',
                            active ? 'bg-blue-50' : 'bg-transparent'
                        )}>
                            <Icon
                                size={22}
                                strokeWidth={active ? 2.5 : 1.8}
                                className={cn(
                                    'transition-colors duration-200',
                                    active ? 'text-blue-600' : 'text-gray-400'
                                )}
                            />
                        </div>

                        <span className={cn(
                            'text-[10px] font-semibold leading-none transition-colors duration-200',
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
