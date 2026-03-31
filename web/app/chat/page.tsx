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
import {
    ArrowLeft, MessageCircle, MessageSquare,
    X, Send, Home, ChevronRight, Volume2,
} from 'lucide-react';

import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { usePhraseLogStore, type PhraseEntry } from '@/lib/store/usePhraseLogStore';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useSpeech } from '@/lib/hooks/useSpeech';

import { SentenceBar } from '@/components/board/SentenceBar';
import { PictoGrid } from '@/components/board/PictoGrid';
import { getCurrentBoardItems, getPathNodes, getPictoImageUrl } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';
import { cn } from '@/lib/utils';

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
            {nodes.map((node, idx) => (
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
    label: string; arasaacId?: number; color?: string; size?: 'sm' | 'md' | 'lg';
}) {
    const bg = color ?? '#6B7280';
    const w       = size === 'lg' ? 72 : size === 'md' ? 56 : 48;
    const imgSize = size === 'lg' ? 50 : size === 'md' ? 34 : 30;
    const imgH    = size === 'lg' ? 56 : size === 'md' ? 42 : 38;
    const stripH  = size === 'lg' ? 5 : 4;
    const lblCls  = size === 'lg' ? 'text-[10px]' : size === 'md' ? 'text-[9px]' : 'text-[8px]';
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
// Reply Banner — ALWAYS visible inside ConversationBoard
// Shows the last message received from this contact.
// Large, high-contrast, with auto-TTS so the person doesn't have to read.
// =============================================================================

function ReplyBanner({ contact }: { contact: Contact }) {
    const entries = usePhraseLogStore((s) => s.entries);
    const { speak, isSpeaking } = useSpeech();

    const lastReply = useMemo(() => {
        // entries are newest-first; find first received for this contact
        return entries.find(
            (e) => e.contactId === contact.id && e.direction === 'received'
        ) ?? null;
    }, [entries, contact.id]);

    // Auto-speak whenever a new reply arrives
    const prevIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (lastReply && lastReply.id !== prevIdRef.current) {
            prevIdRef.current = lastReply.id;
            speak(lastReply.text);
        }
    }, [lastReply, speak]);

    if (!lastReply) return null;

    return (
        <div
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b-2"
            style={{ backgroundColor: BRAND_SOFT, borderColor: BRAND_BORDER }}
        >
            {/* Avatar */}
            <Avatar contact={contact} size="sm" />

            {/* Pictograms — primary display for the person with CD */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1">
                {lastReply.pictograms.length > 0 ? (
                    lastReply.pictograms.map((p, i) => (
                        <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="lg" />
                    ))
                ) : (
                    // Fallback: new replies not yet processed by AI — show text
                    <p className="text-base font-bold text-gray-900 leading-snug">{lastReply.text}</p>
                )}
            </div>

            {/* Big speak button */}
            <button
                onClick={() => speak(lastReply.text)}
                className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors shadow-sm',
                    isSpeaking
                        ? 'bg-[#E56F2C] text-white animate-pulse'
                        : 'bg-white text-[#C85F27] hover:bg-[#FFF4ED] active:bg-[#FFE6D6]'
                )}
                style={{ border: `2px solid ${BRAND_BORDER}` }}
                aria-label="Escuchar mensaje"
            >
                <Volume2 size={26} />
            </button>
        </div>
    );
}

// =============================================================================
// Thread panel (slide-over — caregiver side)
// =============================================================================

function ThreadPanel({ contact, onClose }: { contact: Contact; onClose: () => void }) {
    const entries = usePhraseLogStore((s) => s.entries);
    const addReply = usePhraseLogStore((s) => s.addReply);
    const { speak } = useSpeech();
    const [replyText, setReplyText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Oldest first for thread display
    const thread = useMemo(
        () => [...entries.filter((e) => e.contactId === contact.id)].reverse(),
        [entries, contact.id]
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread.length]);

    const handleReply = () => {
        const t = replyText.trim();
        if (!t) return;
        addReply(contact.id, t);
        setReplyText('');
    };

    return (
        <>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/25 z-20" onClick={onClose} />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 w-full sm:max-w-sm flex flex-col bg-white shadow-2xl z-30">

                {/* Header */}
                <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#FFD5BF] bg-[#FFF8F3]">
                    <Avatar contact={contact} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.role}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-[#FFF1E8] hover:bg-[#FFE6D6] flex items-center justify-center"
                        aria-label="Cerrar"
                    >
                        <X size={20} className="text-[#C85F27]" />
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
                            const isSent = entry.direction !== 'received';
                            return (
                                <div key={entry.id} className={cn('flex flex-col gap-1.5', isSent ? 'items-end' : 'items-start')}>
                                    {isSent ? (
                                        <>
                                            {/* Pictogram strip */}
                                            {entry.pictograms.length > 0 && (
                                                <div className="flex gap-1 flex-wrap justify-end max-w-[260px]">
                                                    {entry.pictograms.map((p, i) => (
                                                        <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} />
                                                    ))}
                                                </div>
                                            )}
                                            {/* Text bubble + speak */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => speak(entry.text)}
                                                    className="w-8 h-8 rounded-full bg-[#FFF1E8] hover:bg-[#FFE6D6] flex items-center justify-center flex-shrink-0"
                                                    aria-label="Escuchar"
                                                >
                                                    <Volume2 size={14} className="text-[#FF8844]" />
                                                </button>
                                                <div className="bg-[#FF8844] text-white px-3 py-2 rounded-2xl rounded-br-none text-sm font-semibold max-w-[200px] leading-snug">
                                                    &ldquo;{entry.text}&rdquo;
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <Avatar contact={contact} size="sm" />
                                            <div className="flex flex-col gap-1">
                                                {/* Pictograms — primary display */}
                                                {entry.pictograms.length > 0 ? (
                                                    <div className="flex gap-1 flex-wrap max-w-[220px]">
                                                        {entry.pictograms.map((p, i) => (
                                                            <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    // New reply, still pending AI translation
                                                    <div className="bg-[#FFF1E8] text-slate-700 px-3 py-2 rounded-2xl rounded-bl-none text-sm font-medium max-w-[200px] leading-snug">
                                                        {entry.text}
                                                    </div>
                                                )}
                                                {/* Text caption — for caregiver context */}
                                                {entry.pictograms.length > 0 && (
                                                    <p className="text-[10px] text-gray-400 italic px-1 max-w-[220px]">{entry.text}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <span className="text-[9px] text-gray-400 px-1">
                                        {new Date(entry.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
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
    const entries = usePhraseLogStore((s) => s.entries);

    // Last received reply per contact (full entry — pictograms + text)
    const lastReplies = useMemo(() => {
        const map: Record<string, PhraseEntry> = {};
        for (const e of entries) {
            if (e.contactId && e.direction === 'received' && !map[e.contactId]) {
                map[e.contactId] = e;
            }
        }
        return map;
    }, [entries]);

    // Unread received count per contact
    const unreadCount = useMemo(() => {
        const map: Record<string, number> = {};
        for (const e of entries) {
            if (e.contactId && e.direction === 'received')
                map[e.contactId] = (map[e.contactId] ?? 0) + 1;
        }
        return map;
    }, [entries]);

    return (
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
            <div className="flex-1 overflow-y-auto px-3 py-2.5">
                {contacts.map((contact) => {
                    const unread = unreadCount[contact.id] ?? 0;
                    const preview = lastReplies[contact.id];
                    const timeStr = preview
                        ? new Date(preview.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
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
                                            <div className="flex gap-1 items-center">
                                                {preview.pictograms.slice(0, 2).map((p, i) => (
                                                    <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="md" />
                                                ))}
                                                {preview.pictograms.length > 2 && (
                                                    <span className="text-[11px] font-bold text-slate-500 pl-1">+{preview.pictograms.length - 2}</span>
                                                )}
                                            </div>
                                        ) : preview ? (
                                            <p className="text-[13px] text-gray-500 truncate font-medium">
                                                {preview.direction === 'received' ? '← ' : '→ '}{preview.text}
                                            </p>
                                        ) : (
                                            <p className="text-[13px] text-gray-400 italic">Sin mensajes</p>
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

    // Board state
    const categoryPath = useBoardStore((s) => s.categoryPath);
    const sentence = useBoardStore((s) => s.sentence);
    const favorites = useBoardStore((s) => s.favorites);
    const addWord = useBoardStore((s) => s.addWord);
    const enterFolder = useBoardStore((s) => s.enterFolder);
    const navigateHome = useBoardStore((s) => s.navigateHome);
    const navigateToPath = useBoardStore((s) => s.navigateToPath);
    const toggleFavorite = useBoardStore((s) => s.toggleFavorite);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    // Phrase log
    const addPhrase = usePhraseLogStore((s) => s.addEntry);
    const entries = usePhraseLogStore((s) => s.entries);
    const msgCount = useMemo(
        () => entries.filter((e) => e.contactId === contact.id).length,
        [entries, contact.id]
    );

    // Derived board data
    const currentItems = useMemo(() => getCurrentBoardItems(categoryPath), [categoryPath]);
    const selectedIds = useMemo(() => sentence.map((p) => p.id), [sentence]);
    const favoriteIds = useMemo(() => {
        const favSet = new Set(favorites.map((f) => f.id));
        return currentItems.filter((n) => favSet.has(n.id)).map((n) => n.id);
    }, [currentItems, favorites]);

    // Match the board density to Proloquo-like layout.
    const boardColumns = 11;
    const boardRows = 6;

    const handleSelectItem = useCallback((node: PictoNode) => {
        if (node.isFolder) enterFolder(node.id);
        else addWord(node);
    }, [enterFolder, addWord]);

    const handleLongPress = useCallback((node: PictoNode) => {
        if (!node.isFolder) toggleFavorite(node);
    }, [toggleFavorite]);

    const handleSend = useCallback((text: string) => {
        if (sentence.length > 0) addPhrase([...sentence], text, contact.id);
        clearSentence();
    }, [addPhrase, sentence, contact.id, clearSentence]);

    return (
        <div className="relative flex flex-col w-full h-full overflow-hidden bg-white">

            {/* Header — flat contact color */}
            <div
                className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
                style={{ backgroundColor: BRAND_ORANGE }}
            >
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all press-anim"
                    style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
                    aria-label="Volver a contactos"
                >
                    <ArrowLeft size={20} className="text-white" />
                </button>

                <div style={{ border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%' }}>
                    <Avatar contact={contact} size="sm" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-white leading-none">{contact.name}</p>
                    <p className="text-xs text-white/70 font-medium mt-0.5">{contact.role}</p>
                </div>

                {/* Toggle thread */}
                <button
                    onClick={() => setShowThread((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all press-anim"
                    style={{
                        backgroundColor: showThread ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                        color: showThread ? BRAND_ORANGE_DARK : 'white',
                    }}
                    aria-label="Ver conversación"
                >
                    <MessageSquare size={16} />
                    <span>{msgCount > 0 ? msgCount : 'Ver'}</span>
                </button>
            </div>

            {/* Sentence bar */}
            <SentenceBar actionMode="messages" onSend={handleSend} />

            {/* Reply banner — last message from this contact, always visible */}
            <ReplyBanner contact={contact} />

            {/* Breadcrumb */}
            <Breadcrumb path={categoryPath} onHome={navigateHome} onNavigateTo={navigateToPath} />

            {/* Picto grid */}
            <div className="flex-1 overflow-hidden bg-[#FFF0E6] p-1.5">
                <PictoGrid
                    items={currentItems}
                    columns={boardColumns}
                    rows={boardRows}
                    onSelectItem={handleSelectItem}
                    onLongPressItem={handleLongPress}
                    selectedIds={selectedIds}
                    favoriteIds={favoriteIds}
                    emptyMessage="Selecciona una categoría"
                />
            </div>

            {/* Thread slide-over */}
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
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    if (!selectedContact) {
        return <ContactGrid onSelect={setSelectedContact} />;
    }

    return (
        <ConversationBoard
            contact={selectedContact}
            onBack={() => setSelectedContact(null)}
        />
    );
}
