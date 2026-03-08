'use client';

/**
 * FolderRow — bottom category navigation strip.
 *
 * Mirrors the bottom row in Proloquo2Go:
 * [ 🏠 Home ]  [ People ]  [ Food ]  [ Actions ]  [ Feelings ]  …
 *
 * Clicking a tab sets the board grid to that folder's content.
 * A "Home" synthetic tab always resets to root.
 */

import { memo } from 'react';
import { Home } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { getRootCategories, getPictoImageUrl } from '@/lib/pictograms/catalog';
import { cn } from '@/lib/utils';

export const FolderRow = memo(function FolderRow() {
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const enterFolder = useBoardStore((s) => s.enterFolder);

    const rootCats = getRootCategories();
    const activeFolderId = categoryPath[0] ?? null;
    const isHome = categoryPath.length === 0;

    return (
        <div
            className="flex-shrink-0 flex items-stretch"
            style={{ height: 88, backgroundColor: '#1C1C1E' }}
        >
            {/* ── Scrollable folder tabs ── */}
            <div className="flex items-stretch gap-0 overflow-x-auto scrollbar-hide w-full">

                {/* Home tab */}
                <button
                    onClick={navigateHome}
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 min-w-[72px] transition-all press-anim"
                    style={isHome
                        ? { backgroundColor: '#3B82F6', color: 'white' }
                        : { color: 'rgba(255,255,255,0.55)' }
                    }
                    aria-label="Inicio"
                    aria-pressed={isHome}
                >
                    <Home size={22} />
                    <span className="text-[10px] font-bold whitespace-nowrap">Inicio</span>
                </button>

                {/* Category tabs */}
                {rootCats.map((cat) => {
                    const isActive = cat.id === activeFolderId;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => {
                                if (isActive) {
                                    navigateHome();
                                } else {
                                    navigateHome();
                                    enterFolder(cat.id);
                                }
                            }}
                            className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-3 min-w-[78px] transition-all press-anim"
                            style={isActive
                                ? { backgroundColor: cat.color ?? '#3B82F6', color: 'white' }
                                : { color: 'rgba(255,255,255,0.6)' }
                            }
                            aria-pressed={isActive}
                            aria-label={cat.label}
                        >
                            {/* Tab image */}
                            <div className="w-10 h-10 flex items-center justify-center">
                                {cat.arasaacId ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={getPictoImageUrl(cat.arasaacId, 300)}
                                        alt={cat.label}
                                        className="w-8 h-8 object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl leading-none">{cat.icon ?? '📁'}</span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold whitespace-nowrap max-w-[72px] truncate text-center leading-tight">
                                {cat.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
