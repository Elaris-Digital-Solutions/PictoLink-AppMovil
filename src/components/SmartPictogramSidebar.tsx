import { useState, useEffect } from 'react';
import { Search, X, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchPictograms, getPictogramsByCategory, getPictogramCategories, CATEGORY_ICONS, type Pictogram } from '@/lib/pictograms';
import { getAutocompleteSuggestions } from '@/lib/api';
import { usePictogramPreferences } from '@/hooks/usePictogramPreferences';

interface Suggestion {
    label: string;
    type: 'category' | 'search';
    value: string;
}

interface SmartPictogramSidebarProps {
    onSelectPictogram: (pictogram: Pictogram) => void;
    // selectedPictograms is used for highlighting
    selectedPictograms: Pictogram[];
    suggestions: Suggestion[];
}

export function SmartPictogramSidebar({ onSelectPictogram, selectedPictograms, suggestions }: SmartPictogramSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Pictogram[]>([]);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categoryPictograms, setCategoryPictograms] = useState<Pictogram[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const { recentPictograms, favoritePictograms, addRecent, toggleFavorite, isFavorite } = usePictogramPreferences();
    const categories = getPictogramCategories();

    // Auto-switch based on suggestions if one is very strong? 
    // For now, we just display the Smart Suggestions tab or modify the UI to show them.
    // Ideally, if we have suggestions, we might want to prioritize them.

    // Effect: If suggestions change, maybe clear category?
    // Or we keep manual control.

    // Suggestion Handling
    const handleSuggestionClick = (suggestion: Suggestion) => {
        if (suggestion.type === 'category') {
            // Map backend category value to frontend category key if needed
            // Assuming values match or we do a best effort match
            const categoryKey = suggestion.value.toLowerCase();

            // Check if it's a valid category
            const validCategory = categories.find(c => c.includes(categoryKey) || categoryKey.includes(c));
            if (validCategory) {
                setSelectedCategory(validCategory);
            } else {
                // If not a standard category, maybe treat as search?
                setSearchQuery(suggestion.label);
            }
        } else if (suggestion.type === 'search') {
            setSearchQuery(suggestion.value);
        }
    };

    // Búsqueda de pictogramas
    useEffect(() => {
        const searchPictogramsDebounced = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setAutocompleteSuggestions([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const [results, newSuggestions] = await Promise.all([
                    searchPictograms(searchQuery.trim()),
                    getAutocompleteSuggestions(searchQuery.trim())
                ]);

                setSearchResults(results.slice(0, 20));
                setAutocompleteSuggestions(newSuggestions);
                // When searching, clear category selection
                if (results.length > 0) setSelectedCategory('');
            } catch (error) {
                console.error('Error searching pictograms:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchPictogramsDebounced, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Cargar pictogramas de categoría seleccionada
    useEffect(() => {
        const loadCategoryPictograms = async () => {
            if (!selectedCategory) {
                setCategoryPictograms([]);
                return;
            }

            if (selectedCategory === 'favoritos') {
                setCategoryPictograms(favoritePictograms);
                return;
            }

            if (selectedCategory === 'mas usados') {
                setCategoryPictograms(recentPictograms);
                return;
            }

            try {
                const pictograms = await getPictogramsByCategory(selectedCategory, 30);
                setCategoryPictograms(pictograms);
            } catch (error) {
                console.error('Error loading category pictograms:', error);
                setCategoryPictograms([]);
            }
        };

        loadCategoryPictograms();
    }, [selectedCategory, favoritePictograms, recentPictograms]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setAutocompleteSuggestions([]);
    };

    const handleBackToCategories = () => {
        setSelectedCategory('');
        setCategoryPictograms([]);
    };

    const handlePictogramClick = (pictogram: Pictogram) => {
        addRecent(pictogram);
        onSelectPictogram(pictogram);
    };

    const isPictogramSelected = (pictogramId: number) => {
        return selectedPictograms.some(p => p.id === pictogramId);
    };

    const renderPictogramButton = (pictogram: Pictogram) => (
        <div
            key={pictogram.id}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:border-primary/50 group ${isPictogramSelected(pictogram.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
        >
            <button
                onClick={() => handlePictogramClick(pictogram)}
                className="absolute inset-0 w-full h-full z-0"
                aria-label={`Seleccionar ${pictogram.labels?.es}`}
            />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pictogram);
                }}
                className="absolute top-1 right-1 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={isFavorite(pictogram.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
                <Star
                    className={`h-4 w-4 ${isFavorite(pictogram.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                />
            </button>
            <img
                src={pictogram.image_urls.png_color}
                alt={pictogram.labels?.es || 'Pictograma'}
                className="w-16 h-16 object-contain z-0 pointer-events-none"
            />
            <span className="text-xs text-center line-clamp-2 z-0 pointer-events-none">
                {pictogram.labels?.es || 'Sin etiqueta'}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white border-l border-border">
            {/* Header con búsqueda */}
            <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Pictogramas
                    </h3>
                    {/* Show Active Category Badge if selected */}
                    {selectedCategory && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium capitalize animate-in fade-in">
                            {selectedCategory.replace('_', ' ')}
                        </span>
                    )}
                </div>

                {/* Smart Suggestions Bar */}
                {suggestions.length > 0 && !searchQuery && (
                    <div className="flex gap-2 overflow-x-auto pb-4 px-2 scrollbar-thin">
                        {suggestions.map((suggestion, idx) => {
                            // Determine Icon ID
                            let iconId = 2369; // Default (Interrogation/Search)
                            const val = suggestion.value.toLowerCase();

                            if (suggestion.type === 'category') {
                                // Explicit mappings for mismatches
                                if (val === 'verbos') iconId = CATEGORY_ICONS['acciones'];
                                else if (val === 'alimentos') iconId = CATEGORY_ICONS['comida'];
                                else if (val === 'juegos') iconId = 32301; // Toy/Game icon
                                else if (val === 'ropa') iconId = 2358; // Clothing icon
                                else {
                                    // Fuzzy match for others (personas, sentimentos, etc)
                                    const key = Object.keys(CATEGORY_ICONS).find(k =>
                                        val.includes(k) || k.includes(val)
                                    );
                                    if (key) iconId = CATEGORY_ICONS[key];
                                }
                            } else if (suggestion.type === 'search') {
                                // Hardcoded mappings for common prediction terms
                                if (val === 'querer') iconId = 7293;
                                else if (val === 'descriptivos') iconId = 6878;
                                else if (val === 'objetos') iconId = 2276;
                            }

                            const isActive = selectedCategory.includes(suggestion.value) || searchQuery === suggestion.value;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`flex flex-col items-center flex-shrink-0 w-20 p-2 gap-1 rounded-lg border-2 transition-all
                                        ${isActive
                                            ? 'bg-primary/20 border-primary shadow-sm'
                                            : 'bg-white border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm'
                                        }`}
                                >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <img
                                            src={`https://static.arasaac.org/pictograms/${iconId}/${iconId}_300.png`}
                                            alt={suggestion.label}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                // Fallback if image fails
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <span className={`text-[10px] text-center font-bold leading-tight line-clamp-2 ${isActive ? 'text-primary' : 'text-slate-600'}`}>
                                        {suggestion.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-9"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Contenido */}
            <ScrollArea className="flex-1">
                <div className="p-4">
                    {/* Resultados de búsqueda */}
                    {searchQuery.trim().length >= 2 ? (
                        <div>
                            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                                {isSearching ? 'Buscando...' : `Resultados (${searchResults.length})`}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {searchResults.map(renderPictogramButton)}
                            </div>
                        </div>
                    ) : selectedCategory ? (
                        /* Vista de categoría */
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Button variant="ghost" size="sm" onClick={handleBackToCategories} className="h-8">
                                    ← Categorías
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {categoryPictograms.map(renderPictogramButton)}
                            </div>
                        </div>
                    ) : (
                        /* Grid de Categorías + Favoritos */
                        <div className="space-y-6">
                            {/* Frequently Used or Favorites first if available */}

                            <div>
                                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Explorar</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all"
                                        >
                                            {category === 'favoritos' ? (
                                                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                                            ) : (
                                                <img
                                                    src={`https://static.arasaac.org/pictograms/${CATEGORY_ICONS[category] || 2369}/${CATEGORY_ICONS[category] || 2369}_500.png`}
                                                    alt={category}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            )}
                                            <span className="text-xs text-center font-medium capitalize">
                                                {category.replace('_', ' ')}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
