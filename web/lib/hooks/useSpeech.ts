'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PictoNode } from '@/types';
import { useProfileStore } from '@/lib/store/useProfileStore';

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

    // Load voices (Chrome fires voiceschanged asynchronously)
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

            const text =
                typeof input === 'string'
                    ? input
                    : input.map((n) => n.label).join(' ');

            if (!text.trim()) return;

            stop();

            const utterance = new SpeechSynthesisUtterance(text);

            // Apply profile settings
            utterance.rate = profile?.tts_rate ?? 1.0;
            utterance.lang = 'es-ES'; // default to Spanish for AAC context

            if (profile?.tts_voice && voices.length > 0) {
                const voice = voices.find((v) => v.voiceURI === profile.tts_voice);
                if (voice) utterance.voice = voice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
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
