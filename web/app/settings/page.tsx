'use client';

/**
 * /settings — Ajustes Generales (Usuario AAC)
 *
 * - Selección de voz TTS
 * - Tamaño de la grilla del tablero
 * - Velocidad de habla
 * - Volumen de TTS
 */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Volume2, ChevronRight, Check, Play, LayoutGrid, Languages, LogOut, CreditCard } from 'lucide-react';
import { useProfileStore } from '@/lib/store/useProfileStore';
import type { Plan } from '@/types';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { langName } from '@/lib/utils/translate';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const BRAND = '#FF8844';
const BRAND_DARK = '#C85F27';
const BRAND_SOFT = '#FFF4ED';
const BRAND_BORDER = '#FFD5BF';


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

function Row({ label, desc, right, onPress, border = true }: {
    label: string;
    desc?: React.ReactNode;
    right?: React.ReactNode;
    onPress?: () => void;
    border?: boolean;
}) {
    const Wrapper = onPress ? 'button' : 'div';
    return (
        <Wrapper
            onClick={onPress}
            className={cn(
                'w-full flex items-center gap-4 px-5 py-4 text-left transition-colors',
                onPress && 'hover:bg-[#FFFAF7] active:bg-[#FFF0E8]',
                border && 'border-b border-[#FFF0E8]'
            )}
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{label}</p>
                {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
            </div>
            {right ?? (onPress && <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />)}
        </Wrapper>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const router = useRouter();
    const profile = useProfileStore(s => s.profile);
    const updateProfile = useProfileStore(s => s.updateProfile);
    const { speak, isSpeaking, voices } = useSpeech();

    // Use voiceURI as the persistent identifier (more stable than `name` across OS)
    const [selectedURI, setSelectedURI] = useState<string>(profile?.tts_voice ?? '');
    const [rate, setRate] = useState<number>(profile?.tts_rate ?? 1.0);
    const [showVoicePicker, setShowVoicePicker] = useState(false);

    // Group voices by language for the picker
    const groupedVoices = useMemo(() => {
        const map = new Map<string, SpeechSynthesisVoice[]>();
        for (const v of voices) {
            const lang = v.lang.split('-')[0];
            if (!map.has(lang)) map.set(lang, []);
            map.get(lang)!.push(v);
        }
        // Sort: Spanish first, then alphabetically
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

    function testVoice() {
        speak('Hola, así suena mi voz en PictoLink.');
    }

    const selectedVoiceObj = voices.find(v => v.voiceURI === selectedURI);
    const currentVoiceName = selectedVoiceObj?.name ?? 'Voz del sistema';
    const isNonSpanish = selectedVoiceObj && !selectedVoiceObj.lang.startsWith('es');

    return (
        <div className="flex flex-col h-full bg-[#FFF7F2] overflow-y-auto">
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-6 pb-4 bg-[#FFF4ED] border-b border-[#FFD5BF]">
                <h1 className="text-2xl font-black text-[#FF8844] leading-none">Ajustes</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Personaliza tu experiencia en PictoLink</p>
            </div>

            <div className="flex-1 py-4">

                {/* TTS Section */}
                <Section icon={Volume2} title="Voz y Síntesis de Habla">
                    <Row
                        label="Voz seleccionada"
                        desc={
                            <span className="flex items-center gap-1.5">
                                {currentVoiceName}
                                {isNonSpanish && (
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-blue-200">
                                        <Languages size={9} />
                                        Auto-traducción
                                    </span>
                                )}
                            </span>
                        }
                        onPress={() => setShowVoicePicker(v => !v)}
                        border={showVoicePicker}
                    />

                    {/* Voice picker — grouped by language */}
                    {showVoicePicker && (
                        <div className="border-b border-[#FFF0E8] max-h-72 overflow-y-auto">
                            {groupedVoices.map(([lang, langVoices]) => (
                                <div key={lang}>
                                    {/* Language group header */}
                                    <div className="flex items-center gap-2 px-5 py-2 bg-[#FFF8F3] border-b border-[#FFF0E8] sticky top-0">
                                        <span className="text-[10px] font-black text-[#C85F27] uppercase tracking-widest">
                                            {langName(lang)}
                                        </span>
                                        {lang !== 'es' && (
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                <Languages size={8} />
                                                se traduce
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

                    {/* Test button */}
                    <Row
                        label="Probar voz"
                        desc="Escucha cómo sonará la síntesis"
                        onPress={testVoice}
                        border={false}
                        right={
                            <div className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                                isSpeaking ? 'bg-[#FF8844] text-white animate-pulse' : 'bg-[#FFF0E8] text-[#C85F27]'
                            )}>
                                {isSpeaking ? <Volume2 size={16} /> : <Play size={14} />}
                            </div>
                        }
                    />
                </Section>

                {/* Tools Section */}
                <Section icon={LayoutGrid} title="Herramientas del Cuidador">
                    <Link href="/board/edit" className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FFFAF7] active:bg-[#FFF0E8] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0E8] flex items-center justify-center flex-shrink-0">
                            <LayoutGrid size={18} className="text-[#C85F27]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">Editor del Tablero</p>
                            <p className="text-xs text-gray-500 mt-0.5">Añadir o eliminar pictogramas · Requiere PIN</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                    </Link>
                </Section>

                {/* Account Section */}
                <Section icon={CreditCard} title="Cuenta y Suscripción">
                    <div className="p-5 border-b border-[#FFF0E8]">
                        <p className="text-sm font-bold text-gray-900 mb-1">Plan actual</p>
                        <p className="text-xs text-gray-500 mb-4">
                            Selecciona el plan que mejor se adapte a tus necesidades.
                        </p>
                        
                        <div className="flex flex-col gap-2">
                            {(['free', 'basic', 'premium'] as Plan[]).map((p) => {
                                const selected = profile?.plan_type === p;
                                const labels = { free: 'Gratis', basic: 'Básico ($10/mes)', premium: 'Premium ($15/mes)' };
                                return (
                                    <button
                                        key={p}
                                        onClick={async () => {
                                            if (!profile?.id) return;
                                            const supabase = createClient();
                                            await supabase.from('profiles').update({ plan_type: p }).eq('id', profile.id);
                                            updateProfile({ plan_type: p });
                                        }}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all active:scale-95 text-left",
                                            selected 
                                                ? "border-[#FF8844] bg-[#FFF8F3]" 
                                                : "border-[#FFF0E8] bg-white hover:bg-gray-50 text-gray-700"
                                        )}
                                    >
                                        <span className={cn("font-bold text-sm", selected && "text-[#C85F27]")}>
                                            {labels[p]}
                                        </span>
                                        {selected && <Check size={18} className="text-[#FF8844]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Section>

                {/* Account Section */}
                <div className="mb-6 px-3">
                    <button 
                        onClick={async () => {
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            useProfileStore.setState({ profile: null, isOnboarded: false });
                            router.replace('/');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-5 py-4 hover:bg-red-50 active:bg-red-100 transition-colors bg-white border border-red-100 rounded-2xl shadow-sm text-red-600 font-bold"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>

            </div>
        </div>
    );
}
