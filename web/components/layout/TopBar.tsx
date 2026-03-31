'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, MessageCircle, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatNavStore } from '@/lib/store/useChatNavStore';

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
    const router = useRouter();
    const clearSelectedContact = useChatNavStore((s) => s.clearSelectedContact);

    return (
        <nav
            className="flex-shrink-0 flex items-stretch bg-white safe-area-pb border-t border-[#FFD5BF]"
            style={{ height: 64 }}
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');

                // The Mensajes tab needs special handling: if already in /chat
                // and a contact is open, tapping it goes back to the contact list.
                if (href === '/chat') {
                    return (
                        <button
                            key={href}
                            onClick={() => {
                                clearSelectedContact();
                                if (!active) router.push('/chat');
                            }}
                            className={cn(
                                'flex-1 flex flex-col items-center justify-center gap-0.5 relative press-anim border-r border-[#FFE2D0] last:border-r-0 transition-colors',
                                active ? 'bg-[#FF8844] text-white' : 'bg-white text-slate-700'
                            )}
                        >
                            <Icon
                                size={21}
                                strokeWidth={active ? 2.8 : 2.2}
                                className={cn(
                                    'transition-colors duration-150',
                                    active ? 'text-white' : 'text-[#C85F27]'
                                )}
                            />
                            <span className={cn(
                                'text-[10px] font-semibold leading-none transition-colors duration-150',
                                active ? 'text-white' : 'text-slate-600'
                            )}>
                                {label}
                            </span>
                        </button>
                    );
                }

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex-1 flex flex-col items-center justify-center gap-0.5 relative press-anim border-r border-[#FFE2D0] last:border-r-0 transition-colors',
                            active ? 'bg-[#FF8844] text-white' : 'bg-white text-slate-700'
                        )}
                    >
                        <Icon
                            size={21}
                            strokeWidth={active ? 2.8 : 2.2}
                            className={cn(
                                'transition-colors duration-150',
                                active ? 'text-white' : 'text-[#C85F27]'
                            )}
                        />

                        <span className={cn(
                            'text-[10px] font-semibold leading-none transition-colors duration-150',
                            active ? 'text-white' : 'text-slate-600'
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
