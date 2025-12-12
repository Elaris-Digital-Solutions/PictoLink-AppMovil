import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { CATEGORY_ICONS } from '../lib/pictograms';

interface CategorySelectorProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export function CategorySelector({ categories, selectedCategory, onSelectCategory }: CategorySelectorProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const isSelected = selectedCategory === category;
                    const iconId = CATEGORY_ICONS[category] || 2369; // Default icon

                    return (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.button,
                                isSelected && styles.selectedButton
                            ]}
                            onPress={() => onSelectCategory(category)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isSelected }}
                            accessibilityLabel={`Categoría ${category.replace('_', ' ')}`}
                        >
                            <View style={styles.iconContainer}>
                                {category === 'favoritos' ? (
                                    <Star
                                        size={24}
                                        color="#FACC15"
                                        fill="#FACC15"
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: `https://static.arasaac.org/pictograms/${iconId}/${iconId}_300.png` }}
                                        style={styles.icon}
                                        contentFit="contain"
                                        cachePolicy="memory-disk"
                                    />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.label,
                                    isSelected && styles.selectedLabel
                                ]}
                            >
                                {category.replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 70, // Fixed height for consistency
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    scrollContent: {
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#F9FAFB', // gray-50
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        minWidth: 70,
    },
    selectedButton: {
        backgroundColor: '#EFF6FF', // blue-50
        borderColor: '#3B82F6', // blue-500
    },
    iconContainer: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        textTransform: 'capitalize',
        color: '#6B7280', // gray-500
    },
    selectedLabel: {
        color: '#1D4ED8', // blue-700
        fontWeight: '700',
    }
});
