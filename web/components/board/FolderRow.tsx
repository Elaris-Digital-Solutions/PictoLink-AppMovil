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

export const FolderRow = memo(function FolderRow() {
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const enterFolder = useBoardStore((s) => s.enterFolder);

    const rootCats = getRootCategories();
    const activeFolderId = categoryPath[0] ?? null;
    const isHome = categoryPath.length === 0;

    return (
        <div
            className="flex-shrink-0 flex items-stretch border-t border-black/25"
            style={{ height: 92, backgroundColor: '#DCDCDC' }}
        >
            {/* ── Scrollable folder tabs ── */}
            <div className="flex items-stretch gap-1 overflow-x-auto scrollbar-hide w-full px-1.5 py-1">

                {/* Home tab */}
                <button
                    onClick={navigateHome}
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-3 min-w-[78px] rounded-lg border transition-all press-anim"
                    style={isHome
                        ? { backgroundColor: '#111111', color: '#FFFFFF', borderColor: '#111111' }
                        : { backgroundColor: '#FFFFFF', color: '#505050', borderColor: 'rgba(0,0,0,0.2)' }
                    }
                    aria-label="Inicio"
                    aria-pressed={isHome}
                >
                    <Home size={20} />
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
                            className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-2.5 min-w-[82px] rounded-lg border transition-all press-anim"
                            style={isActive
                                ? {
                                    backgroundColor: '#FFFFFF',
                                    color: '#111111',
                                    borderColor: cat.color ?? '#3B82F6',
                                    boxShadow: `inset 0 0 0 2px ${cat.color ?? '#3B82F6'}`,
                                }
                                : {
                                    backgroundColor: '#F8F8F8',
                                    color: '#505050',
                                    borderColor: 'rgba(0,0,0,0.15)',
                                }
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
                                        className="w-7 h-7 object-contain"
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
