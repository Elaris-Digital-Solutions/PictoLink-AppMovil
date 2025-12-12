import { useState, useEffect, useCallback } from 'react';
import * as Speech from 'expo-speech';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Hook: useSpeechRecognition (Speech-to-Text)
// ---------------------------------------------------------------------------
export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true); // Native modules usually support it or throw
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Setup Voice listeners
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);
        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
            if (e.value && e.value.length > 0) {
                setTranscript(e.value[0]);
            }
        };
        Voice.onSpeechError = (e: SpeechErrorEvent) => {
            console.error('Speech Recognition Error:', e);
            setError(e.error?.message || 'Error desconocido de reconocimiento de voz');
            setIsListening(false);
        };

        return () => {
            // Cleanup
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const startListening = useCallback(async () => {
        setError(null);
        setTranscript('');
        try {
            await Voice.start('es-ES');
        } catch (e: any) {
            console.error('Error starting voice recognition:', e);
            setError(e.message || 'No se pudo iniciar el reconocimiento.');
        }
    }, []);

    const stopListening = useCallback(async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error('Error stopping voice recognition:', e);
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        isListening,
        transcript,
        isSupported, // Always true for native unless explicit check fails?
        error,
        startListening,
        stopListening,
        resetTranscript,
    };
}

// ---------------------------------------------------------------------------
// Hook: useSpeechSynthesis (Text-to-Text)
// ---------------------------------------------------------------------------
export function useSpeechSynthesis() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(true); // Expo Speech is supported

    const speak = useCallback((text: string) => {
        if (!text) return;

        Speech.speak(text, {
            language: 'es-ES',
            rate: 1.0,
            onStart: () => setIsSpeaking(true),
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: (e) => {
                console.error('Speech synthesis error:', e);
                setIsSpeaking(false);
            }
        });
    }, []);

    const stop = useCallback(async () => {
        await Speech.stop();
        setIsSpeaking(false);
    }, []);

    return {
        speak,
        stop,
        isSpeaking,
        isSupported
    };
}
