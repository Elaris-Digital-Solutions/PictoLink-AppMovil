'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import type { PictoNode } from '@/types';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { translateText } from '@/lib/utils/translate';
import { trackEvent } from '@/lib/analytics';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseSpeechReturn {
    speak: (nodes: PictoNode[] | string) => void;
    stop: () => void;
    isSpeaking: boolean;
    isSupported: boolean;
    voices: SpeechSynthesisVoice[];
    selectedVoiceURI: string | undefined;
    setVoiceURI: (uri: string) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSpeech(): UseSpeechReturn {
    const profile = useProfileStore((s) => s.profile);
    const updateProfile = useProfileStore((s) => s.updateProfile);

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // El WebView de Android no trae speechSynthesis (medido, corrección 7 del plan del Bloque E):
    // en la app nativa habla el TTS del sistema; en el navegador, la Web Speech API como antes.
    const esNativo = Capacitor.isNativePlatform();
    const webTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const isSupported = esNativo || webTTS;

    // Load ALL available system voices (no language filter)
    // ponytail: en nativo la lista queda vacía y no se aplica profile.tts_voice (es un voiceURI
    // de la Web Speech API); mapear a getSupportedVoices() del plugin cuando se cierre E.5.1.
    useEffect(() => {
        if (!webTTS) return;

        const load = () => setVoices(window.speechSynthesis.getVoices());
        load();
        window.speechSynthesis.addEventListener('voiceschanged', load);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
    }, [webTTS]);

    const stop = useCallback(() => {
        if (esNativo) {
            TextToSpeech.stop().catch((e) => console.error('[tts] stop nativo falló', e));
        } else if (webTTS) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    }, [esNativo, webTTS]);

    const speak = useCallback(
        (input: PictoNode[] | string) => {
            trackEvent('voice_tts_used');
            if (!isSupported) return;

            const spanishText =
                typeof input === 'string'
                    ? input
                    : input.map((n) => n.label).join(' ');

            if (!spanishText.trim()) return;

            // Find the selected voice object
            const selectedVoice =
                voices.find((v) => v.voiceURI === profile?.tts_voice) ?? null;

            // Resolve target language from the voice (default to es)
            const targetLang = selectedVoice?.lang ?? 'es';

            // Fire async: translate then speak
            const doSpeak = async () => {
                // En nativo no hace falta: QueueStrategy.Flush (por defecto) corta lo que suena.
                if (!esNativo) stop();
                const text = await translateText(spanishText, targetLang);

                if (esNativo) {
                    setIsSpeaking(true);
                    TextToSpeech.speak({ text, lang: targetLang, rate: profile?.tts_rate ?? 1.0 })
                        .catch((e) => console.error('[tts] speak nativo falló', e))
                        .finally(() => setIsSpeaking(false));
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = profile?.tts_rate ?? 1.0;
                utterance.lang = targetLang;
                if (selectedVoice) utterance.voice = selectedVoice;

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);

                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            };

            void doSpeak();
        },
        [isSupported, esNativo, stop, profile, voices]
    );

    const setVoiceURI = useCallback(
        (uri: string) => {
            updateProfile({ tts_voice: uri });
        },
        [updateProfile]
    );

    return {
        speak,
        stop,
        isSpeaking,
        isSupported,
        voices,
        selectedVoiceURI: profile?.tts_voice,
        setVoiceURI,
    };
}
