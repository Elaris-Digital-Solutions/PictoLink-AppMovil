'use client';

import { memo } from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { getRootCategories, getPathNodes } from '@/lib/pictograms/catalog';

// ─── CategoryNav — breadcrumb style ──────────────────────────────────────────
// Shows:  🏠 Home  >  Food  >  Fruits
// Each segment is tappable to navigate to that level.
// Root categories appear as a horizontal scroll row below the crumb.

export const CategoryNav = memo(function CategoryNav() {
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const navigateTo = useBoardStore((s) => s.navigateTo);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const navigateToPath = useBoardStore((s) => s.navigateToPath);

    const rootCategories = getRootCategories();

    // O(1) per segment: resolve ids → nodes using the index map
    const pathNodes = getPathNodes(categoryPath);
    const crumbs = pathNodes.map((node, idx) => ({
        id: node.id,
        label: node.label,
        pathSlice: categoryPath.slice(0, idx + 1),
    }));


    return (
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
            {/* ── Breadcrumb row ── */}
            <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto scrollbar-hide">
                {/* Home button */}
                <button
                    onClick={navigateHome}
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg
                     hover:bg-gray-100 active:bg-gray-200 transition-colors text-blue-600"
                    aria-label="Inicio"
                >
                    <Home size={18} />
                </button>

                {/* Crumb segments */}
                {crumbs.map((crumb) => (
                    <span key={crumb.id} className="flex items-center gap-1 flex-shrink-0">
                        <ChevronRight size={14} className="text-gray-400" />
                        <button
                            onClick={() => navigateToPath(crumb.pathSlice)}
                            className="text-sm font-semibold text-gray-700 hover:text-blue-600
                         px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors
                         whitespace-nowrap"
                        >
                            {crumb.label}
                        </button>
                    </span>
                ))}
            </div>

            {/* ── Root category tab row (only at root level) ── */}
            <div className="flex items-center gap-1.5 px-3 pb-1.5 overflow-x-auto scrollbar-hide">
                {rootCategories.map((cat) => {
                    const isActive = categoryPath[0] === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => {
                                navigateHome();
                                if (!isActive) navigateTo(cat.id);
                            }}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          text-sm font-bold transition-all whitespace-nowrap
                          ${isActive
                                    ? 'text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            style={isActive ? { backgroundColor: cat.color ?? '#6B7280' } : undefined}
                        >
                            {cat.icon && <span className="text-base leading-none">{cat.icon}</span>}
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
