'use client';

import { useRef, useEffect, memo } from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { getRootCategories, getNodeByPath } from '@/lib/pictograms/catalog';

// ─── Category tab ─────────────────────────────────────────────────────────────

function CategoryTab({
    label,
    icon,
    color,
    isActive,
    onClick,
}: {
    label: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
        transition-all duration-150 whitespace-nowrap
        ${isActive
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }
      `}
            style={isActive ? { backgroundColor: color ?? '#6B7280' } : undefined}
        >
            {icon && <span className="text-base leading-none">{icon}</span>}
            {label}
        </button>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CategoryNav = memo(function CategoryNav() {
    const { categoryPath, navigateTo, navigateBack, navigateHome } = useBoardStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    const rootCategories = getRootCategories();
    const isAtRoot = categoryPath.length === 0;

    // Current folder's children (for sub-nav)
    const currentNode = categoryPath.length > 0 ? getNodeByPath(categoryPath) : null;
    const subFolders = currentNode?.children ?? [];

    // Auto-scroll to active tab
    useEffect(() => {
        const active = scrollRef.current?.querySelector('[data-active="true"]') as HTMLElement;
        active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [categoryPath]);

    return (
        <div className="bg-gray-50 border-b border-gray-200 px-2 py-2 space-y-1.5">
            {/* Row 1: Back + Home + Root categories */}
            <div ref={scrollRef} className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {/* Back */}
                {!isAtRoot && (
                    <button
                        onClick={navigateBack}
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                )}

                {/* Home */}
                <button
                    onClick={navigateHome}
                    className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border transition-colors
            ${isAtRoot ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    aria-label="Home"
                >
                    <Home size={16} />
                </button>

                {/* Root category tabs */}
                {rootCategories.map((cat) => {
                    const isActive = categoryPath[0] === cat.id;
                    return (
                        <CategoryTab
                            key={cat.id}
                            label={cat.label}
                            icon={cat.icon}
                            color={cat.color}
                            isActive={isActive}
                            onClick={() => {
                                if (!isActive) {
                                    navigateHome();
                                    navigateTo(cat.id);
                                }
                            }}
                            data-active={isActive}
                        />
                    );
                })}
            </div>

            {/* Row 2: Sub-folder tabs (only when a folder with children is open) */}
            {subFolders.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pl-10">
                    {subFolders.map((sub) => {
                        const isActive = categoryPath[categoryPath.length - 1] === sub.id;
                        return (
                            <CategoryTab
                                key={sub.id}
                                label={sub.label}
                                icon={sub.icon}
                                color={sub.color}
                                isActive={isActive}
                                onClick={() => {
                                    if (!isActive) {
                                        // Trim path to parent, then push sub
                                        const parentPath = categoryPath.slice(0, 1);
                                        useBoardStore.setState({ categoryPath: [...parentPath, sub.id] });
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
});
