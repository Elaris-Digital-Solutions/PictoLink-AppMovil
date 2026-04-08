'use client';

/**
 * Mensajes — AAC communication hub
 *
 * Screen 1  Contact grid
 *   Large accessible contact cards (photo + name + role).
 *   Tap to open the conversation with that person.
 *
 * Screen 2  Conversation + embedded AAC board
 *   The board IS the message composer.
 *   Tap pictograms → build sentence → ENVIAR → message saved for this contact.
 *   "Ver conversación" button opens a thread panel (slide-over) where the
 *   caregiver can read sent messages and type a text reply.
 *
 * Everything is stored locally (no backend required for the prototype).
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, MessageCircle, MessageSquare,
    X, Send, Home, ChevronRight, Volume2, UserRound
} from 'lucide-react';

import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { usePhraseLogStore, type PhraseEntry } from '@/lib/store/usePhraseLogStore';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useChatNavStore } from '@/lib/store/useChatNavStore';
import { useChatStore, type ChatMessage } from '@/lib/store/useChatStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { pictosToText } from '@/lib/ai/picto-nlp';

import { SentenceBar } from '@/components/board/SentenceBar';
import { AACBoard } from '@/components/board/AACBoard';
import { getPictoImageUrl, getPathNodes } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';
import { cn } from '@/lib/utils';
import { ContactForm } from '@/components/ContactForm';

const BRAND_ORANGE = '#FF8844';
const BRAND_ORANGE_DARK = '#C85F27';
const BRAND_SOFT = '#FFF1E8';
const BRAND_BORDER = '#FFD5BF';

// =============================================================================
// Shared sub-components
// =============================================================================

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ contact, size = 'md' }: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 40 : size === 'md' ? 60 : 96;
    return (
        <div
            className="rounded-full flex items-center justify-center flex-shrink-0 select-none"
            style={{ width: px, height: px, backgroundColor: contact.avatarColor, fontSize: px * 0.44 }}
        >
            {contact.avatarEmoji}
        </div>
    );
}

// ─── Folder breadcrumb (for grid navigation) ──────────────────────────────────

function Breadcrumb({
    path, onHome, onNavigateTo,
}: {
    path: string[];
    onHome: () => void;
    onNavigateTo: (p: string[]) => void;
}) {
    const nodes = getPathNodes(path);
    if (path.length === 0) return null;
    return (
        <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide"
            style={{ backgroundColor: '#FFF4ED', borderBottom: `1px solid ${BRAND_BORDER}` }}
        >
            <button onClick={onHome} className="flex items-center gap-1.5 flex-shrink-0">
                <Home size={13} style={{ color: BRAND_ORANGE_DARK }} />
                <span className="text-xs font-bold" style={{ color: BRAND_ORANGE_DARK }}>Inicio</span>
            </button>
            {nodes.map((node: { id: string; label: string }, idx: number) => (
                <span key={node.id} className="flex items-center gap-1.5 flex-shrink-0">
                    <ChevronRight size={11} style={{ color: '#E38A59' }} />
                    <button
                        onClick={() => onNavigateTo(path.slice(0, idx + 1))}
                        className="text-xs font-bold text-slate-800 whitespace-nowrap"
                    >
                        {node.label}
                    </button>
                </span>
            ))}
        </div>
    );
}

// ─── Mini pictogram chip (inside thread) ─────────────────────────────────────

function PictoChip({ label, arasaacId, color, size = 'sm' }: {
    label: string; arasaacId?: number; color?: string; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
    const bg = color ?? '#6B7280';
    const w       = size === 'xl' ? 96  : size === 'lg' ? 72 : size === 'md' ? 56 : 48;
    const imgSize = size === 'xl' ? 64  : size === 'lg' ? 50 : size === 'md' ? 34 : 30;
    const imgH    = size === 'xl' ? 70  : size === 'lg' ? 56 : size === 'md' ? 42 : 38;
    const stripH  = size === 'xl' ? 6   : size === 'lg' ? 5 : 4;
    const lblCls  = size === 'xl' ? 'text-[11px]' : size === 'lg' ? 'text-[10px]' : size === 'md' ? 'text-[9px]' : 'text-[8px]';
    return (
        <div
            className="flex flex-col items-center bg-white border rounded-xl overflow-hidden flex-shrink-0"
            style={{ width: w, borderColor: `${bg}55` }}
        >
            <div style={{ height: stripH, backgroundColor: bg, width: '100%' }} />
            <div className="flex items-center justify-center p-0.5" style={{ height: imgH }}>
                {arasaacId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getPictoImageUrl(arasaacId, 300)} alt={label}
                        className="object-contain" style={{ width: imgSize, height: imgSize }} />
                ) : (
                    <span className="text-xl leading-none">🔲</span>
                )}
            </div>
            <div className="w-full px-0.5 pb-1 text-center" style={{ backgroundColor: `${bg}18` }}>
                <span className={cn(lblCls, 'font-bold text-gray-700 line-clamp-1 block')}>{label}</span>
            </div>
        </div>
    );
}

// =============================================================================
// Inline Reply Viewer — Embedded in the main consolidated header
// Shows the last message received from this contact.
// Auto-TTS so the person doesn't have to read.
// =============================================================================

function InlineReply({ contact }: { contact: Contact }) {
    const messages = useChatStore((s) => s.messages);
    const profile = useProfileStore((s) => s.profile);
    const { speak, isSpeaking } = useSpeech();

    const lastReply = useMemo(() => {
        if (!profile?.id) return null;
        // Search backwards for the last message *received* from this contact
        const received = messages.filter(
            (m) => m.sender_id === contact.contact_id && m.receiver_id === profile.id
        );
        return received.length > 0 ? received[received.length - 1] : null;
    }, [messages, contact.contact_id, profile?.id]);

    const prevIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (lastReply && lastReply.id !== prevIdRef.current) {
            prevIdRef.current = lastReply.id;
            speak(lastReply.content);
        }
    }, [lastReply, speak]);

    if (!lastReply) {
        return <div className="flex-1 flex items-center text-sm font-bold text-white/50 italic px-4">Esperando mensaje...</div>;
    }

    return (
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 px-3">
            {lastReply.pictograms.length > 0 ? (
                lastReply.pictograms.map((p, i) => (
                    <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="lg" />
                ))
            ) : (
                <p className="text-base font-bold text-white leading-snug line-clamp-2 drop-shadow">{lastReply.content}</p>
            )}
        </div>
    );
}

// =============================================================================
// Thread panel (slide-over — caregiver side)
// =============================================================================

function ThreadPanel({ contact, onClose }: { contact: Contact; onClose: () => void }) {
    const messages = useChatStore((s) => s.messages);
    const sendMessage = useChatStore((s) => s.sendMessage);
    const profile = useProfileStore((s) => s.profile);
    const { speak } = useSpeech();
    const [replyText, setReplyText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Filter messages for this contact
    const thread = useMemo(
        () => messages.filter((m) => 
            (m.sender_id === profile?.id && m.receiver_id === contact.contact_id) ||
            (m.sender_id === contact.contact_id && m.receiver_id === profile?.id)
        ),
        [messages, contact.contact_id, profile?.id]
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread.length]);

    const handleReply = () => {
        const t = replyText.trim();
        if (!t || !profile?.id) return;
        sendMessage([], t, profile.id, contact.contact_id);
        setReplyText('');
    };

    return (
        <>
            {/* Backdrop strictly fixed over everything */}
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />

            {/* Panel strictly fixed to the right */}
            <div className="fixed top-0 right-0 h-full w-full sm:max-w-[400px] flex flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.3)] z-50 animate-in slide-in-from-right">

                {/* Header */}
                <div className="flex-shrink-0 flex items-center gap-4 px-6 py-5 border-b-2 border-[#FFD5BF] bg-[#FFF8F3] shadow-sm">
                    <Avatar contact={contact} size="md" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xl font-black text-gray-900 truncate">{contact.name}</p>
                        <p className="text-sm font-bold text-[#FF8844] uppercase tracking-widest">{contact.role}</p>
                    </div>
                    {/* Big visible close button */}
                    <button
                        onClick={onClose}
                        className="w-16 h-16 rounded-2xl bg-white border-2 border-[#FFD5BF] hover:bg-[#FFE6D6] active:scale-95 flex items-center justify-center transition-all shadow-md"
                        aria-label="Cerrar"
                    >
                        <X size={32} className="text-[#C85F27]" strokeWidth={3} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {thread.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 h-full py-12 text-gray-400">
                            <MessageCircle size={36} className="opacity-25" />
                            <p className="text-xs text-center font-medium px-6">
                                Sin mensajes todavía.<br />
                                Construye una frase en el tablero y envíala.
                            </p>
                        </div>
                    ) : (
                        thread.map((entry) => {
                            const isSent = entry.sender_id === profile?.id;
                            return (
                                <div key={entry.id} className={cn('flex flex-col gap-1.5', isSent ? 'items-end' : 'items-start')}>
                                    {isSent ? (
                                        <>
                                            {/* Pictogram strip */}
                                            {entry.pictograms?.length > 0 && (
                                                <div className="flex gap-2 flex-wrap justify-end max-w-[320px]">
                                                    {entry.pictograms.map((p, i) => (
                                                        <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="xl" />
                                                    ))}
                                                </div>
                                            )}
                                            {/* Text bubble + speak */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => speak(entry.content)}
                                                    className="w-10 h-10 rounded-full bg-[#FFF1E8] hover:bg-[#FFE6D6] flex items-center justify-center flex-shrink-0 shadow-sm"
                                                    aria-label="Escuchar"
                                                >
                                                    <Volume2 size={20} className="text-[#FF8844]" />
                                                </button>
                                                <div className="bg-[#FF8844] text-white px-5 py-3 rounded-[1.5rem] rounded-br-none text-lg font-bold max-w-[280px] leading-tight shadow-sm">
                                                    &ldquo;{entry.content}&rdquo;
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <Avatar contact={contact} size="md" />
                                            <div className="flex flex-col gap-2">
                                                {/* Pictograms — primary display */}
                                                {entry.pictograms?.length > 0 ? (
                                                    <div className="flex gap-2 flex-wrap max-w-[280px]">
                                                        {entry.pictograms.map((p, i) => (
                                                            <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="xl" />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    // New reply, still pending AI translation
                                                    <div className="bg-[#FFF1E8] text-slate-700 px-5 py-3 rounded-[1.5rem] rounded-bl-none text-lg font-bold max-w-[280px] leading-tight shadow-sm">
                                                        {entry.content}
                                                    </div>
                                                )}
                                                {/* Text caption — for caregiver context */}
                                                {entry.pictograms?.length > 0 && (
                                                    <p className="text-xs text-gray-400 font-bold px-1 max-w-[280px]">{entry.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <span className="text-[10px] text-gray-400 font-bold px-1">
                                        {new Date(entry.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Reply input — caregiver types here */}
                <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-[#FFD5BF] bg-[#FFF8F3]">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                        placeholder={`${contact.name} responde…`}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-[#FFD5BF] text-sm
                                   focus:outline-none focus:border-[#FF8844] bg-white"
                    />
                    <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="w-11 h-11 rounded-xl bg-[#FF8844] hover:bg-[#F57D37] active:bg-[#E56F2C]
                                   disabled:opacity-30 flex items-center justify-center transition-colors"
                        aria-label="Enviar respuesta"
                    >
                        <Send size={18} className="text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}

// =============================================================================
// Screen 1 — Contact grid
// =============================================================================

function ContactGrid({ onSelect }: { onSelect: (c: Contact) => void }) {
    const contacts = useContactStore((s) => s.contacts);
    const { addContact } = useContactStore();
    const messages = useChatStore((s) => s.messages);
    const profile = useProfileStore((s) => s.profile);
    const [showAddContact, setShowAddContact] = useState(false);

    async function handleAddContact(data: Omit<Contact, 'id'>) {
        if (!profile?.id) return;
        await addContact(data, profile.id);
        setShowAddContact(false);
    }

    // Last message per contact (any direction) for preview
    const lastMessages = useMemo(() => {
        const map: Record<string, ChatMessage> = {};
        if (!profile?.id) return map;
        // Newest to oldest — first hit per contact wins
        for (let i = messages.length - 1; i >= 0; i--) {
            const m = messages[i];
            const otherId = m.sender_id === profile.id ? m.receiver_id : m.sender_id;
            if (!map[otherId]) map[otherId] = m;
        }
        return map;
    }, [messages, profile?.id]);

    // Last *received* message per contact — shown as the preview text
    const lastReplies = useMemo(() => {
        const map: Record<string, ChatMessage> = {};
        if (!profile?.id) return map;
        for (let i = messages.length - 1; i >= 0; i--) {
            const m = messages[i];
            const otherId = m.sender_id === profile.id ? m.receiver_id : m.sender_id;
            if (!map[otherId] && m.sender_id !== profile.id) map[otherId] = m;
        }
        return map;
    }, [messages, profile?.id]);

    // Unread received count per contact
    const unreadCount = useMemo(() => {
        const map: Record<string, number> = {};
        if (!profile?.id) return map;
        for (const m of messages) {
            if (m.receiver_id === profile.id && !m.read) {
                map[m.sender_id] = (map[m.sender_id] ?? 0) + 1;
            }
        }
        return map;
    }, [messages, profile?.id]);

    return (
        <>
        <div className="flex flex-col h-full bg-[#FFF7F2]">

            {/* Header — clean, modern, no gradient */}
            <div
                className="flex-shrink-0 px-5 pt-5 pb-4 bg-[#FFF4ED]"
                style={{ borderBottom: `1px solid ${BRAND_BORDER}` }}
            >
                <h1 className="text-[30px] font-black text-[#FF8844] leading-none tracking-tight">Mensajes</h1>
                <p className="text-[14px] text-slate-500 font-semibold mt-1.5">¿Con quién quieres hablar?</p>
            </div>

            {/* Contact list — high-contrast cards */}
            <div className="flex-1 overflow-y-auto px-3 py-2.5 flex flex-col">
                {contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-gray-400">
                        <UserRound size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No tienes contactos aún</p>
                        <button
                            onClick={() => setShowAddContact(true)}
                            className="text-sm font-bold text-[#FF8844] underline"
                        >
                            Añadir el primero
                        </button>
                    </div>
                ) : contacts.map((contact) => {
                    const unread = unreadCount[contact.contact_id] ?? 0;
                    const preview = lastReplies[contact.contact_id];   // last received (for content preview)
                    const anyLast = lastMessages[contact.contact_id];  // any direction (for timestamp)
                    const timeStr = anyLast
                        ? new Date(anyLast.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
                        : '';
                    return (
                        <button
                            key={contact.id}
                            onClick={() => onSelect(contact)}
                            className="w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-white border border-[#FFD5BF] shadow-[0_1px_3px_rgba(200,95,39,0.14)] active:bg-[#FFF4ED] press-anim text-left"
                        >
                            {/* Avatar */}
                            <Avatar contact={contact} size="md" />

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[16px] font-bold text-gray-900 truncate leading-none">
                                        {contact.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 min-w-0 flex items-center">
                                        {preview?.pictograms && preview.pictograms.length > 0 ? (
                                            <div className="flex gap-1 items-center flex-wrap">
                                                {preview.pictograms.map((p: PictoNode, i: number) => (
                                                    <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="md" />
                                                ))}
                                            </div>
                                        ) : preview ? (
                                            <p className="text-[13px] text-gray-500 truncate font-medium">
                                                ← {preview.content}
                                            </p>
                                        ) : anyLast ? (
                                            // AAC user sent the last message — show it with arrow indicator
                                            <p className="text-[13px] text-gray-400 truncate font-medium">
                                                → {anyLast.content}
                                            </p>
                                        ) : (
                                            <p className="text-[13px] text-gray-400 italic">Inicia la conversación</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between self-stretch py-0.5 min-w-[42px]">
                                {timeStr ? (
                                    <span
                                        className="text-[11px] leading-none"
                                        style={{ color: unread > 0 ? '#C85F27' : '#7B7B7B', fontWeight: unread > 0 ? 700 : 500 }}
                                    >
                                        {timeStr}
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-transparent leading-none">00:00</span>
                                )}

                                {unread > 0 ? (
                                    <div className="flex-shrink-0 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[11px] font-black px-1 bg-[#FF8844]">
                                        {unread}
                                    </div>
                                ) : (
                                    <span className="w-[22px] h-[22px]" aria-hidden="true" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Add Contact Modal */}
        {showAddContact && (
            <ContactForm
                onSave={handleAddContact}
                onCancel={() => setShowAddContact(false)}
            />
        )}
    </>
    );
}

// =============================================================================
// Screen 2 — Conversation with embedded AAC board
// =============================================================================

function ConversationBoard({
    contact,
    onBack,
}: {
    contact: Contact;
    onBack: () => void;
}) {
    const [showThread, setShowThread] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    // Profile & Chat layer
    const profile = useProfileStore((s) => s.profile);
    const setCurrentContact = useChatStore((s) => s.setCurrentContact);
    const unsubscribeFromMessages = useChatStore((s) => s.unsubscribeFromMessages);

    // Init conversation on mount
    useEffect(() => {
        if (profile?.id && contact.contact_id) {
            setCurrentContact(contact.contact_id, profile.id);
        }
        return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id, contact.contact_id]);

    // Board state
    const addWord = useBoardStore((s) => s.addWord);
    const sentence = useBoardStore((s) => s.sentence);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    // Context messages
    const messages = useChatStore((s) => s.messages);
    const msgCount = useMemo(
        () => messages.length,
        [messages]
    );

    const sendMessage = useChatStore((s) => s.sendMessage);

    const handleSend = useCallback(async () => {
        if (sentence.length === 0 || !profile?.id || !contact.contact_id) return;
        
        setIsTranslating(true);
        try {
            // Generar frase simple concatenando las etiquetas (No usamos IA para AAC -> Texto)
            const content = sentence.map(p => p.label).join(' ');
            
            // Persistir en Supabase (sender_id = profile.id, receiver_id = contact.contact_id)
            await sendMessage(
                sentence, 
                content, 
                profile.id, 
                contact.contact_id
            );
            
            clearSentence();
            console.log('[AAC Send Success] Mensaje guardado:', content);
        } catch (err) {
            console.error('[AAC Send Error]', err);
        } finally {
            setIsTranslating(false);
        }
    }, [sentence, profile?.id, contact.contact_id, sendMessage, clearSentence]);

    return (
        <div className="relative flex flex-col w-full h-[100dvh] overflow-hidden bg-[#FFF0E6]">

            {/* TOP BAR / HEADER UNIFICADO (1 ÚNICA FRANJA) */}
            <header className="flex-shrink-0 flex flex-col pt-safe bg-white border-b border-[#FFD5BF] z-10 shadow-sm">
                
                {/* 1. Fila principal consolidada: Nav + Avatar + Mensaje Recibido + Historial */}
                <div className="flex items-center gap-3 h-[72px] px-3 bg-[#FF8844]">
                    
                    {/* Botón de volver */}
                    <button
                        onClick={onBack}
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white shadow-sm ml-1 border-2 border-white/30"
                        aria-label="Volver a contactos"
                    >
                        <ArrowLeft size={26} strokeWidth={2.5} className="text-white" />
                    </button>

                    {/* Avatar del contacto */}
                    <div className="ml-1 border-2 border-white/40 rounded-full shadow-sm bg-white/10 p-0.5 relative z-10 hidden sm:block">
                        <Avatar contact={contact} size="sm" />
                    </div>

                    {/* Último mensaje recibido (Pictogramas inline) */}
                    <InlineReply contact={contact} />

                    {/* Botón Historial sobre fondo naranja */}
                    <button
                        onClick={() => setShowThread(true)}
                        className="h-12 px-5 md:px-6 rounded-[1rem] flex items-center justify-center gap-2 font-black text-base transition-transform shadow-md bg-white text-[#FF8844] active:bg-[#FFF4ED] active:scale-95 ml-1 mr-1 border-b-4 border-[#FFD5BF]"
                        aria-label="Cargar Historial"
                    >
                        <MessageSquare size={22} fill="currentColor" />
                        <span className="hidden sm:inline">Historial</span>
                        {msgCount > 0 && (
                            <div className="bg-white text-[#C85F27] text-xs px-2 py-0.5 rounded-full ml-1">
                                {msgCount}
                            </div>
                        )}
                    </button>
                </div>

                {/* 2. Constructor de frase (SentenceBar) */}
                <div className="bg-white border-t border-[#FFD5BF]/50">
                    <SentenceBar actionMode="messages" onSend={handleSend} isProcessing={isTranslating} />
                </div>
            </header>

            {/* TABLERO AAC MAIN AREA */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* AACBoard — manages its own internal navigation */}
                <div className="flex-1 overflow-hidden">
                    <AACBoard
                        onWordAdd={addWord}
                        onNavigate={(target: string) => console.log('[AACBoard] external folder:', target)}
                    />
                </div>
            </main>

            {/* HISTORIAL SLIDE-OVER STRICT FIXED OVERLAY */}
            {showThread && (
                <ThreadPanel contact={contact} onClose={() => setShowThread(false)} />
            )}
        </div>
    );
}

// =============================================================================
// Root — switches between contact grid and conversation
// =============================================================================

export default function ChatPage() {
    const contacts = useContactStore((s) => s.contacts);
    const { loadContacts } = useContactStore();
    const profile = useProfileStore((s) => s.profile);
    const { selectedContactId, setSelectedContactId, clearSelectedContact } = useChatNavStore();

    // Carga inicial de contactos
    useEffect(() => {
        if (profile?.id) {
            loadContacts(profile.id);
        }
    }, [profile?.id, loadContacts]);

    const selectedContact = contacts.find((c) => c.id === selectedContactId) ?? null;

    if (!selectedContact) {
        return <ContactGrid onSelect={(c) => setSelectedContactId(c.id)} />;
    }

    return (
        <ConversationBoard
            contact={selectedContact}
            onBack={clearSelectedContact}
        />
    );
}
