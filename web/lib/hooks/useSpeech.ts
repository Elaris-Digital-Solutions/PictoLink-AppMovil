'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PictoNode } from '@/types';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { translateText } from '@/lib/utils/translate';

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

    const isSupported =
        typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Load ALL available system voices (no language filter)
    useEffect(() => {
        if (!isSupported) return;

        const load = () => setVoices(window.speechSynthesis.getVoices());
        load();
        window.speechSynthesis.addEventListener('voiceschanged', load);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
    }, [isSupported]);

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [isSupported]);

    const speak = useCallback(
        (input: PictoNode[] | string) => {
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
                stop();
                const text = await translateText(spanishText, targetLang);

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
        [isSupported, stop, profile, voices]
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
