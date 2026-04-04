'use client';

/**
 * /settings/aac — Ajustes del Comunicador AAC
 *
 * Accessible settings tailored for the AAC user:
 *  - TTS voice selection & speed
 *  - Sign out
 * No caregiver tools visible here.
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, Check, Play, Languages, LogOut } from 'lucide-react';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { langName } from '@/lib/utils/translate';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const BRAND = '#FF8844';
const BRAND_DARK = '#C85F27';
const BRAND_BORDER = '#FFD5BF';

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Section({ icon: Icon, title, children }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 px-4 py-2 mb-1">
                <Icon size={15} className="text-[#C85F27]" />
                <h2 className="text-[11px] font-black text-[#C85F27] uppercase tracking-widest">{title}</h2>
            </div>
            <div className="bg-white border border-[#FFE2D0] rounded-2xl overflow-hidden mx-3 shadow-sm">
                {children}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AACSettingsPage() {
    const router = useRouter();
    const profile = useProfileStore(s => s.profile);
    const updateProfile = useProfileStore(s => s.updateProfile);
    const { speak, isSpeaking, voices } = useSpeech();

    const [selectedURI, setSelectedURI] = useState<string>(profile?.tts_voice ?? '');
    const [rate, setRate] = useState<number>(profile?.tts_rate ?? 1.0);
    const [showVoicePicker, setShowVoicePicker] = useState(false);

    const groupedVoices = useMemo(() => {
        const map = new Map<string, SpeechSynthesisVoice[]>();
        for (const v of voices) {
            const lang = v.lang.split('-')[0];
            if (!map.has(lang)) map.set(lang, []);
            map.get(lang)!.push(v);
        }
        return [...map.entries()].sort(([a], [b]) =>
            a === 'es' ? -1 : b === 'es' ? 1 : a.localeCompare(b)
        );
    }, [voices]);

    function saveVoice(uri: string) {
        setSelectedURI(uri);
        setShowVoicePicker(false);
        updateProfile({ tts_voice: uri });
    }

    function saveRate(val: number) {
        setRate(val);
        updateProfile({ tts_rate: val });
    }

    const selectedVoiceObj = voices.find(v => v.voiceURI === selectedURI);
    const currentVoiceName = selectedVoiceObj?.name ?? 'Voz del sistema';
    const isNonSpanish = selectedVoiceObj && !selectedVoiceObj.lang.startsWith('es');

    async function handleSignOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        useProfileStore.setState({ profile: null, isOnboarded: false });
        router.replace('/');
    }

    return (
        <div className="flex flex-col h-full bg-[#FFF7F2] overflow-y-auto">
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-6 pb-4 bg-[#FFF4ED] border-b border-[#FFD5BF]">
                <h1 className="text-2xl font-black text-[#FF8844] leading-none">Ajustes</h1>
                {profile?.display_name && (
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Hola, <span className="font-bold text-[#C85F27]">{profile.display_name}</span>
                    </p>
                )}
            </div>

            <div className="flex-1 py-4">

                {/* TTS Section */}
                <Section icon={Volume2} title="Voz y habla">
                    {/* Voice selector */}
                    <button
                        onClick={() => setShowVoicePicker(v => !v)}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left border-b border-[#FFF0E8] hover:bg-[#FFFAF7] active:bg-[#FFF0E8] transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">Voz seleccionada</p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                {currentVoiceName}
                                {isNonSpanish && (
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-blue-200">
                                        <Languages size={9} />
                                        Auto-traducción
                                    </span>
                                )}
                            </p>
                        </div>
                        <Volume2 size={18} className="text-[#C85F27] flex-shrink-0" />
                    </button>

                    {/* Voice picker */}
                    {showVoicePicker && (
                        <div className="border-b border-[#FFF0E8] max-h-72 overflow-y-auto">
                            {groupedVoices.map(([lang, langVoices]) => (
                                <div key={lang}>
                                    <div className="flex items-center gap-2 px-5 py-2 bg-[#FFF8F3] border-b border-[#FFF0E8] sticky top-0">
                                        <span className="text-[10px] font-black text-[#C85F27] uppercase tracking-widest">
                                            {langName(lang)}
                                        </span>
                                        {lang !== 'es' && (
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                <Languages size={8} />se traduce
                                            </span>
                                        )}
                                    </div>
                                    {langVoices.map(v => (
                                        <button
                                            key={v.voiceURI}
                                            onClick={() => saveVoice(v.voiceURI)}
                                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#FFFAF7] border-b border-[#FFF0E8] last:border-0 text-left transition-colors"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{v.name}</p>
                                                <p className="text-xs text-gray-400">{v.lang}</p>
                                            </div>
                                            {v.voiceURI === selectedURI && (
                                                <Check size={16} className="text-[#FF8844] flex-shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Rate slider */}
                    <div className="px-5 py-4 border-b border-[#FFF0E8]">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-gray-900">Velocidad de habla</p>
                            <span className="text-xs font-black text-[#FF8844] bg-[#FFF0E8] px-2 py-0.5 rounded-full">
                                {rate === 1 ? 'Normal' : rate < 1 ? 'Lenta' : 'Rápida'} ({rate.toFixed(1)}×)
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0.5} max={2} step={0.1}
                            value={rate}
                            onChange={e => saveRate(parseFloat(e.target.value))}
                            className="w-full accent-[#FF8844]"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                            <span>0.5× Lenta</span><span>1× Normal</span><span>2× Rápida</span>
                        </div>
                    </div>

                    {/* Test voice */}
                    <button
                        onClick={() => speak('Hola, así suena mi voz en PictoLink.')}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FFFAF7] active:bg-[#FFF0E8] transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">Probar voz</p>
                            <p className="text-xs text-gray-500 mt-0.5">Escucha cómo suena la síntesis</p>
                        </div>
                        <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                            isSpeaking ? 'bg-[#FF8844] text-white animate-pulse' : 'bg-[#FFF0E8] text-[#C85F27]'
                        )}>
                            {isSpeaking ? <Volume2 size={16} /> : <Play size={14} />}
                        </div>
                    </button>
                </Section>

                {/* Sign out */}
                <div className="mb-6 px-3">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-white border border-red-100 rounded-2xl shadow-sm text-red-600 font-bold hover:bg-red-50 active:bg-red-100 transition-colors"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>

            </div>
        </div>
    );
}
