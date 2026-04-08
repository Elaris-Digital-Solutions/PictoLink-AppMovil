import { useState, useEffect } from 'react';
import { GridCell, CATEGORY_COLORS } from '@/data/aac-grid-layout';
import { searchPictograms } from '@/lib/pictograms';
import { cn } from '@/lib/utils';
import { Folder, MoreHorizontal } from 'lucide-react';

interface AACButtonProps {
    cell: GridCell;
    onClick: (cell: GridCell) => void;
    className?: string;
}

export function AACButton({ cell, onClick, className }: AACButtonProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            if (cell.pictogramId) {
                setImageUrl(`https://static.arasaac.org/pictograms/${cell.pictogramId}/${cell.pictogramId}_500.png`);
                return;
            }

            // Fallback: Search for pictogram by label
            try {
                // If it's a special term or folder, we might need specific logic
                // For now, simple search
                const results = await searchPictograms(cell.label);
                if (isMounted && results.length > 0) {
                    // Just take the first result as strict matching is complex without keyword field
                    const best = results[0];
                    setImageUrl(best.image_urls.png_color);
                }
            } catch (err) {
                console.warn(`Failed to find pictogram for ${cell.label}`, err);
            }
        };

        fetchImage();
        return () => { isMounted = false; };
    }, [cell.label, cell.pictogramId]);

    // Color logic
    const colorClass = CATEGORY_COLORS[cell.type] || "bg-gray-100 border-gray-300";
    const isFolder = cell.type === 'folder';

    return (
        <div className={cn("relative h-full w-full", isFolder ? "pt-2.5 pb-0.5 px-0.5" : "", className)}>
            {/* Folder Tab Detail */}
            {isFolder && (
                <div className="absolute top-0.5 left-0.5 w-[45%] h-5 bg-white border-t-2 border-x-2 border-gray-800 rounded-t-lg z-0" />
            )}

            <button
                onClick={() => onClick(cell)}
                className={cn(
                    "relative flex flex-col items-center justify-between p-1 transition-all active:scale-[0.97] active:shadow-none hover:brightness-[0.98] h-full w-full overflow-hidden",
                    isFolder 
                        ? "bg-white border-2 border-gray-800 rounded-lg rounded-tl-none shadow-[0_4px_0_0_rgba(0,0,0,0.1)] z-10" 
                        : cn("rounded-xl border-t-4 border-b-2 border-r-2 border-l-2 shadow-sm", colorClass)
                )}
            >
                {/* Label */}
                <span className={cn(
                    "text-[10px] md:text-xs font-black uppercase tracking-tight text-center leading-tight w-full px-1 min-h-[1.2rem] flex items-center justify-center",
                    isFolder ? "text-gray-800 pt-0.5" : "text-black pt-1"
                )}>
                    {cell.label}
                </span>

                {/* Image/Icon */}
                <div className="flex-1 w-full flex items-center justify-center p-1 min-h-0 relative">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={cell.label}
                            className="max-h-full max-w-full object-contain pointer-events-none select-none"
                        />
                    ) : (
                        cell.type === 'folder' ? <Folder className="w-1/2 h-1/2 text-gray-300" /> :
                        cell.type === 'navigation' ? <MoreHorizontal className="w-1/2 h-1/2 text-gray-400" /> :
                        null
                    )}
                </div>

                {/* Folder indicator hidden for now to maintain Proloquo look */}
            </button>
        </div>
    );
}
