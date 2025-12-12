import React from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Pictogram } from '../lib/pictograms';
import { PictogramCard } from './PictogramCard';

interface PictogramGridProps {
    pictograms: Pictogram[];
    onSelectPictogram: (pictogram: Pictogram) => void;
    selectedPictograms?: Pictogram[]; // For highlighting
    loading?: boolean;
    emptyMessage?: string;
    onToggleFavorite?: (pictogram: Pictogram) => void;
    isFavorite?: (id: number) => boolean;
    onScroll?: (event: any) => void;
}

export function PictogramGrid({
    pictograms,
    onSelectPictogram,
    selectedPictograms = [],
    loading = false,
    emptyMessage = "No se encontraron pictogramas",
    onToggleFavorite,
    isFavorite,
    onScroll
}: PictogramGridProps) {

    const renderItem = ({ item }: { item: Pictogram }) => {
        const isSelected = selectedPictograms.some(p => p.id === item.id);

        return (
            <View style={styles.itemContainer}>
                <PictogramCard
                    pictogram={item}
                    onPress={onSelectPictogram}
                    isSelected={isSelected}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isFavorite ? isFavorite(item.id) : false}
                    size={90} // Slightly larger for mobile grid
                />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (pictograms.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={pictograms}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.listContent}
            onScroll={onScroll}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        padding: 8,
        paddingBottom: 40, // Extra space at bottom
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 4,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    }
});
