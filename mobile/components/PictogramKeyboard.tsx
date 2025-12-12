import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Search, X, Sparkles } from 'lucide-react-native';
import { Pictogram, getPictogramCategories, searchPictograms, getPictogramsByCategory } from '../lib/pictograms';
import { getAutocompleteSuggestions } from '../lib/api';
import { usePictogramPreferences } from '../hooks/usePictogramPreferences';
import { CategorySelector } from './CategorySelector';
import { PictogramGrid } from './PictogramGrid';

interface PictogramKeyboardProps {
    onSelectPictogram: (pictogram: Pictogram) => void;
    selectedPictograms?: Pictogram[];
    suggestions?: any[]; // Allow external suggestions
}

export function PictogramKeyboard({ onSelectPictogram, selectedPictograms = [], suggestions = [] }: PictogramKeyboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Pictogram[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Categories
    const [selectedCategory, setSelectedCategory] = useState<string>('favoritos');
    const [categoryPictograms, setCategoryPictograms] = useState<Pictogram[]>([]);
    const [loadingCategory, setLoadingCategory] = useState(false);

    const { recentPictograms, favoritePictograms, addRecent, toggleFavorite, isFavorite } = usePictogramPreferences();
    const categories = getPictogramCategories();

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Search Effect
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            try {
                const results = await searchPictograms(searchQuery.trim());
                setSearchResults(results.slice(0, 30));
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchQuery]);

    // Category Load Effect
    useEffect(() => {
        const loadCategory = async () => {
            setLoadingCategory(true);
            try {
                if (selectedCategory === 'favoritos') {
                    // Handled by render directly or set state? 
                    // Let's set state to keep Grid generic
                    setCategoryPictograms(favoritePictograms);
                } else if (selectedCategory === 'mas usados') {
                    setCategoryPictograms(recentPictograms);
                } else {
                    // Remote Fetch
                    // Note: getPictogramsByCategory is stubbed in Phase 1, so this might return empty
                    const pictos = await getPictogramsByCategory(selectedCategory);
                    setCategoryPictograms(pictos);
                }
            } catch (e) {
                console.error('Error loading category:', e);
            } finally {
                setLoadingCategory(false);
            }
        };

        loadCategory();
    }, [selectedCategory, favoritePictograms, recentPictograms]);

    const handleSelect = (pictogram: Pictogram) => {
        addRecent(pictogram);
        onSelectPictogram(pictogram);
    };

    const isSearchActive = searchQuery.trim().length >= 2;

    return (
        <View style={styles.container}>
            {/* Header: Search Bar */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar pictograma..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Selector (Only visible if not searching) */}
            {!isSearchActive && (
                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            )}

            {/* Main Content */}
            <View style={styles.content}>
                {isSearchActive ? (
                    isSearching ? (
                        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
                    ) : (
                        <PictogramGrid
                            pictograms={searchResults}
                            onSelectPictogram={handleSelect}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={isFavorite}
                            selectedPictograms={selectedPictograms} // Highlight selected?
                            emptyMessage="No se encontraron resultados"
                        />
                    )
                ) : (
                    loadingCategory ? (
                        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
                    ) : (
                        <PictogramGrid
                            pictograms={categoryPictograms}
                            onSelectPictogram={handleSelect}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={isFavorite}
                            selectedPictograms={selectedPictograms} // Highlight if needed
                            emptyMessage={
                                selectedCategory === 'favoritos'
                                    ? "Aún no tienes favoritos"
                                    : "No hay pictogramas en esta categoría"
                            }
                        />
                    )
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    header: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1F2937',
    },
    content: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    }
});
