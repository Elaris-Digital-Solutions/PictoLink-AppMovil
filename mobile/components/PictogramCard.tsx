import React, { useState } from 'react';
import { Image } from 'expo-image';
import { View, Text, TouchableOpacity, StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { Star } from 'lucide-react-native';
import { Pictogram } from '../lib/pictograms';

interface PictogramCardProps {
    pictogram: Pictogram;
    onPress: (pictogram: Pictogram) => void;
    isSelected?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: (pictogram: Pictogram) => void;
    size?: number;
}

export function PictogramCard({
    pictogram,
    onPress,
    isSelected = false,
    isFavorite = false,
    onToggleFavorite,
    size = 80
}: PictogramCardProps) {
    const [imageError, setImageError] = useState(false);

    // Dynamic styles
    const containerSize = { width: size, height: size + 30 }; // Extra space for text
    const imageSize = { width: size - 16, height: size - 16 };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                containerSize,
                isSelected && styles.selectedContainer
            ]}
            onPress={() => onPress(pictogram)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Pictograma ${pictogram.labels.es}`}
            accessibilityHint="Doble toque para seleccionar"
        >
            {onToggleFavorite && (
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => onToggleFavorite(pictogram)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                    <Star
                        size={16}
                        color={isFavorite ? "#FACC15" : "#9CA3AF"}
                        fill={isFavorite ? "#FACC15" : "transparent"}
                    />
                </TouchableOpacity>
            )}

            <View style={styles.imageContainer}>
                {!imageError ? (
                    <Image
                        source={{ uri: pictogram.image_urls.png_color }}
                        style={[styles.image, imageSize as ImageStyle]}
                        contentFit="contain"
                        onError={() => setImageError(true)}
                        cachePolicy="memory-disk"
                    />
                ) : (
                    <View style={[styles.placeholder, imageSize as ViewStyle]}>
                        <Text style={styles.placeholderText}>?</Text>
                    </View>
                )}
            </View>

            <Text style={styles.label} numberOfLines={2}>
                {pictogram.labels.es}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        margin: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    selectedContainer: {
        borderColor: '#000', // primary
        backgroundColor: '#F3F4F6', // gray-100
        borderWidth: 2,
    },
    favoriteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    image: {
        // Size handled dynamically
    },
    placeholder: {
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    placeholderText: {
        fontSize: 24,
        color: '#9CA3AF',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        color: '#1F2937', // gray-800
        lineHeight: 14,
    }
});
