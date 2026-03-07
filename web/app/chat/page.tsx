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
import { useProfileStore } from '@/lib/store/useProfileStore';
import { useSpeech } from '@/lib/hooks/useSpeech';

import { SentenceBar } from '@/components/board/SentenceBar';
import { PictoGrid } from '@/components/board/PictoGrid';
import { FolderRow } from '@/components/board/FolderRow';
import { getCurrentBoardItems, getPathNodes, getPictoImageUrl } from '@/lib/pictograms/catalog';
import type { PictoNode } from '@/types';
import { cn } from '@/lib/utils';

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
        <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1 bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button onClick={onHome} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 flex-shrink-0">
                <Home size={13} />
                <span className="text-xs font-bold">Inicio</span>
            </button>
            {nodes.map((node, idx) => (
                <span key={node.id} className="flex items-center gap-1 flex-shrink-0">
                    <ChevronRight size={12} className="text-gray-400" />
                    <button
                        onClick={() => onNavigateTo(path.slice(0, idx + 1))}
                        className="text-xs font-bold text-gray-600 hover:text-gray-900 whitespace-nowrap"
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
    label: string; arasaacId?: number; color?: string; size?: 'sm' | 'lg';
}) {
    const bg = color ?? '#6B7280';
    const w       = size === 'lg' ? 72  : 48;
    const imgSize = size === 'lg' ? 50  : 30;
    const imgH    = size === 'lg' ? 56  : 38;
    const stripH  = size === 'lg' ? 5   : 4;
    const lblCls  = size === 'lg' ? 'text-[10px]' : 'text-[8px]';
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
            style={{ backgroundColor: contact.avatarColor + '18', borderColor: contact.avatarColor + '44' }}
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
                        ? 'bg-green-400 text-white animate-pulse'
                        : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                )}
                style={{ border: `2px solid ${contact.avatarColor}55` }}
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
                <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <Avatar contact={contact} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.role}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        aria-label="Cerrar"
                    >
                        <X size={20} className="text-gray-600" />
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
                                                    className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center flex-shrink-0"
                                                    aria-label="Escuchar"
                                                >
                                                    <Volume2 size={14} className="text-blue-500" />
                                                </button>
                                                <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-br-none text-sm font-semibold max-w-[200px] leading-snug">
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
                                                    <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-none text-sm font-medium max-w-[200px] leading-snug">
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
                <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-gray-100 bg-gray-50">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                        placeholder={`${contact.name} responde…`}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm
                                   focus:outline-none focus:border-blue-400 bg-white"
                    />
                    <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="w-11 h-11 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700
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
        <div className="flex flex-col h-full bg-gray-50">

            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 bg-white border-b border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <MessageCircle size={22} className="text-blue-600" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none">Mensajes</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">¿Con quién quieres hablar?</p>
                </div>
            </div>

            {/* Grid of contacts */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                    {contacts.map((contact) => {
                        const unread = unreadCount[contact.id] ?? 0;
                        const preview = lastReplies[contact.id];
                        return (
                            <button
                                key={contact.id}
                                onClick={() => onSelect(contact)}
                                className="flex flex-col items-center gap-3 p-5 bg-white rounded-3xl border-2
                                           hover:border-blue-200 hover:bg-blue-50 active:scale-[0.97] transition-all shadow-sm text-left"
                                style={{ borderColor: unread > 0 ? contact.avatarColor : '#F3F4F6' }}
                            >
                                {/* Avatar + badge */}
                                <div className="relative">
                                    <Avatar contact={contact} size="lg" />
                                    {unread > 0 && (
                                        <div className="absolute -top-1 -right-1 min-w-[24px] h-[24px] rounded-full
                                                        text-white text-[11px] font-black
                                                        flex items-center justify-center px-1 shadow"
                                            style={{ backgroundColor: contact.avatarColor }}>
                                            {unread}
                                        </div>
                                    )}
                                </div>

                                {/* Name + role */}
                                <div className="text-center w-full">
                                    <p className="text-lg font-black text-gray-900 leading-tight">{contact.name}</p>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{contact.role}</p>
                                </div>

                                {/* Last reply preview — pictograms if available */}
                                {preview && (
                                    <div
                                        className="w-full rounded-xl overflow-hidden"
                                        style={{ border: `1.5px solid ${contact.avatarColor}44` }}
                                    >
                                        {preview.pictograms.length > 0 ? (
                                            <div className="flex gap-1 p-2 flex-wrap justify-center"
                                                style={{ backgroundColor: contact.avatarColor + '18' }}>
                                                {preview.pictograms.slice(0, 3).map((p, i) => (
                                                    <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="px-3 py-2 text-xs font-semibold text-gray-700 text-left line-clamp-2 leading-snug"
                                                style={{ backgroundColor: contact.avatarColor + '18' }}>
                                                💬 {preview.text}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
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
    const gridColumns = useProfileStore((s) => s.profile?.grid_columns ?? 8);
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

            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b-2 border-gray-100">
                <button
                    onClick={onBack}
                    className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300
                               flex items-center justify-center flex-shrink-0 transition-colors"
                    aria-label="Volver a contactos"
                >
                    <ArrowLeft size={22} className="text-gray-700" />
                </button>

                <Avatar contact={contact} size="sm" />

                <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-gray-900 leading-none">{contact.name}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{contact.role}</p>
                </div>

                {/* Toggle thread */}
                <button
                    onClick={() => setShowThread((v) => !v)}
                    className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-colors',
                        showThread
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    )}
                    aria-label="Ver conversación"
                >
                    <MessageSquare size={17} />
                    <span>{msgCount > 0 ? msgCount : 'Ver'}</span>
                </button>
            </div>

            {/* Sentence bar */}
            <SentenceBar onSend={handleSend} />

            {/* Reply banner — last message from this contact, always visible */}
            <ReplyBanner contact={contact} />

            {/* Breadcrumb */}
            <Breadcrumb path={categoryPath} onHome={navigateHome} onNavigateTo={navigateToPath} />

            {/* Picto grid */}
            <div className="flex-1 overflow-hidden bg-gray-100">
                <PictoGrid
                    items={currentItems}
                    columns={gridColumns}
                    onSelectItem={handleSelectItem}
                    onLongPressItem={handleLongPress}
                    selectedIds={selectedIds}
                    favoriteIds={favoriteIds}
                    emptyMessage="Selecciona una categoría"
                />
            </div>

            {/* Folder row */}
            <FolderRow />

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
