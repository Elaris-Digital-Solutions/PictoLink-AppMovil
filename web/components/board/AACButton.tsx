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

    return (
        <button
            onClick={() => onClick(cell)}
            className={cn(
                "relative flex flex-col items-center justify-between p-1 rounded-xl border-t-4 border-b-2 border-r-2 border-l-2 shadow-sm transition-all active:scale-95 active:shadow-inner hover:brightness-95 h-full w-full overflow-hidden",
                colorClass,
                className
            )}
            style={{ aspectRatio: '4/3' }} // Maintain aspect ratio if possible, or fill grid
        >
            {/* Folder Tab Effect if folder */}
            {cell.type === 'folder' && (
                <div className="absolute top-0 left-0 w-8 h-4 bg-inherit border-b border-black/10 rounded-br-lg" />
            )}

            {/* Label */}
            <span className={cn(
                "text-sm font-bold uppercase tracking-tight text-center leading-tight w-full px-1 pt-1 z-10",
                cell.type === 'pronoun' || cell.type === 'verb' ? "text-black" : "text-black"
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
                    // Fallback icons for specific types if image not found
                    cell.type === 'folder' ? <Folder className="w-1/2 h-1/2 text-gray-400 opacity-50" /> :
                        cell.type === 'navigation' ? <MoreHorizontal className="w-1/2 h-1/2 text-gray-400" /> :
                            null
                )}

                {/* Folder indicator if folder type */}
                {cell.type === 'folder' && imageUrl && (
                    <div className="absolute top-1 right-1">
                        <Folder className="w-4 h-4 text-black/20" />
                    </div>
                )}
            </div>

            {/* Empty footer space for visual balance if needed */}
            {/* <div className="h-1" /> */}
        </button>
    );
}
