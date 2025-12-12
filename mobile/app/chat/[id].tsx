import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useMessages } from '@/src/hooks/useMessages';
import { useSpeechRecognition, useSpeechSynthesis } from '@/src/hooks/useSpeech';
import { Pictogram, searchPictograms } from '@/src/lib/pictograms';
import { convertTextToPictos, convertPictosToText, getAutocompleteSuggestions } from '@/src/lib/api';
import { PictogramKeyboard } from '@/components/PictogramKeyboard';
import { Send, Mic, Sparkles, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Image } from 'expo-image';

export default function ChatScreen() {
    const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
    const { user } = useAuth();
    const { messages, loading, sendMessage } = useMessages(id);

    // Speech Hooks
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
    const { speak } = useSpeechSynthesis();

    // State
    const [inputMessage, setInputMessage] = useState('');
    const [selectedPictograms, setSelectedPictograms] = useState<Pictogram[]>([]);
    const [showPictograms, setShowPictograms] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    // Sync transcript
    useEffect(() => {
        if (transcript) {
            setInputMessage(transcript);
        }
    }, [transcript]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!id) return;

        // Ensure we stop listening if sending
        if (isListening) stopListening();

        let messageSent = false;

        // Priority 1: Send pictograms if any
        if (selectedPictograms.length > 0) {
            try {
                const generatedText = await convertPictosToText(selectedPictograms);
                const ids = selectedPictograms.map(p => p.id).join(',');
                const labels = selectedPictograms.map(p => p.labels.es).join(' ');

                // Format: [pictograms:IDs:Labels|GeneratedText]
                const messageToSend = `[pictograms:${ids}:${labels}|${generatedText}]`;

                await sendMessage(messageToSend);
                setSelectedPictograms([]);
                setInputMessage('');
                messageSent = true;
            } catch (e) {
                console.error("Error sending pictograms:", e);
                alert("Error sending pictograms");
            }
        }

        // Priority 2: Text message
        if (!messageSent && inputMessage.trim()) {
            try {
                // Attempt conversion
                const foundPictograms = await convertTextToPictos(inputMessage.trim());
                let messageToSend = inputMessage.trim();

                if (foundPictograms.length > 0) {
                    const ids = foundPictograms.map(p => p.id).join(',');
                    const labels = foundPictograms.map(p => p.labels.es).join(' ');
                    messageToSend = `[pictograms:${ids}:${labels}|${inputMessage.trim()}]`;
                }

                await sendMessage(messageToSend);
                setInputMessage('');
            } catch (e) {
                console.error("Error sending message:", e);
                try {
                    await sendMessage(inputMessage.trim());
                    setInputMessage('');
                } catch (sendErr) {
                    console.error("Fatal send error:", sendErr);
                }
            }
        }

        resetTranscript();
    };

    const handleSelectPictogram = (pictogram: Pictogram) => {
        setSelectedPictograms(prev => [...prev, pictogram]);
        // Don't wipe inputMessage here if we want to allow mixed (though logic separates them nicely)
        // keeping original behavior
        setInputMessage('');
    };

    const handleRemovePictogram = (index: number) => {
        setSelectedPictograms(prev => prev.filter((_, i) => i !== index));
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender_id === user?.id;
        const content = item.content;

        // Parse
        const compoundMatch = content.match(/^\[pictograms:([\d,]+):([^|\]]+)(?:\|([^\]]*))?\]$/);
        const textToRead = compoundMatch ? (compoundMatch[3] || '') : content;

        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onLongPress={() => speak(textToRead)}
                    delayLongPress={500}
                >
                    <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
                        {compoundMatch ? (
                            <View>
                                <View style={styles.pictoRow}>
                                    {compoundMatch[1].split(',').map((pid: string, idx: number) => {
                                        const label = compoundMatch[2].split(' ')[idx] || '';
                                        return (
                                            <View key={`${pid}-${idx}`} style={styles.messagePicto}>
                                                <Image
                                                    source={{ uri: `https://static.arasaac.org/pictograms/${pid}/${pid}_300.png` }}
                                                    style={{ width: 40, height: 40 }}
                                                    contentFit="contain"
                                                />
                                                <Text style={styles.pictoLabel}>{label}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                                {compoundMatch[3] && (
                                    <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText, { marginTop: 4, fontStyle: 'italic' }]}>
                                        {compoundMatch[3]}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
                                {content}
                            </Text>
                        )}
                        <Text style={[styles.timeText, isMe ? styles.myTime : styles.otherTime]}>
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: name || 'Chat' }} />

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {/* Pictogram Composition Bar */}
                {selectedPictograms.length > 0 && (
                    <View style={styles.compositionBar}>
                        <View style={styles.compositionHeader}>
                            <Text style={styles.compositionTitle}>Mensaje:</Text>
                            <TouchableOpacity onPress={() => setSelectedPictograms([])}>
                                <Text style={styles.clearText}>Borrar todo</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={selectedPictograms}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.compositionItem}>
                                    <Image
                                        source={{ uri: item.image_urls.png_color }}
                                        style={{ width: 40, height: 40 }}
                                        contentFit="contain"
                                    />
                                    <TouchableOpacity
                                        style={styles.removeItem}
                                        onPress={() => handleRemovePictogram(index)}
                                    >
                                        <X size={12} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            contentContainerStyle={{ padding: 8 }}
                        />
                    </View>
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowPictograms(!showPictograms)}
                    >
                        {showPictograms ? (
                            <ChevronDown size={24} color="#4B5563" />
                        ) : (
                            <Sparkles size={24} color="#F59E0B" />
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder={
                            isListening ? "Escuchando..." :
                                (selectedPictograms.length > 0 ? "Enviar pictogramas..." : "Escribe un mensaje...")
                        }
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        editable={!isListening && selectedPictograms.length === 0}
                    />

                    {/* Send Button or Mic Button */}
                    {inputMessage.length > 0 || selectedPictograms.length > 0 ? (
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSendMessage}
                        >
                            <Send size={20} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.sendButton, isListening ? styles.listeningButton : styles.micButton]}
                            onPress={isListening ? stopListening : startListening}
                        >
                            <Mic size={20} color={isListening ? "white" : "#4B5563"} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Custom Keyboard Area */}
                {showPictograms && (
                    <View style={styles.keyboardContainer}>
                        <PictogramKeyboard
                            onSelectPictogram={handleSelectPictogram}
                            selectedPictograms={selectedPictograms}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageRow: {
        marginBottom: 12,
        flexDirection: 'row',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: '#3B82F6',
        borderBottomRightRadius: 2,
    },
    otherBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 16,
    },
    myText: {
        color: '#FFFFFF',
    },
    otherText: {
        color: '#1F2937',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTime: {
        color: '#9CA3AF',
    },
    pictoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'center',
    },
    messagePicto: {
        alignItems: 'center',
        margin: 2,
    },
    pictoLabel: {
        fontSize: 10,
        textAlign: 'center',
        color: '#4B5563',
    },
    compositionBar: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    compositionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    compositionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    clearText: {
        fontSize: 12,
        color: '#EF4444',
    },
    compositionItem: {
        marginRight: 8,
        alignItems: 'center',
    },
    removeItem: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    iconButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    micButton: {
        backgroundColor: '#F3F4F6',
    },
    listeningButton: {
        backgroundColor: '#EF4444',
    },
    keyboardContainer: {
        height: 300,
        backgroundColor: '#FFFFFF',
    }
});
