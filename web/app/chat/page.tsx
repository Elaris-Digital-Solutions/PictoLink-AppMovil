'use client';

/**
 * Mensajes — AAC communication hub
 *
 * Screen 1  Contact + Group grid
 *   Large accessible contact cards (photo + name + role).
 *   Group cards appear below contacts.
 *   Tap to open the conversation with that person or group.
 *
 * Screen 2a Conversation + embedded AAC board (P2P)
 *   The board IS the message composer.
 *   Tap pictograms → build sentence → ENVIAR → message saved for this contact.
 *   "Historial" button opens a thread panel (slide-over).
 *
 * Screen 2b Group Conversation + embedded AAC board
 *   Same as 2a but sends to a group_messages row instead of a P2P message.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    ArrowLeft, MessageCircle, MessageSquare,
    X, Send, Home, ChevronRight, Volume2, UserRound
} from 'lucide-react';

import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { useBoardStore } from '@/lib/store/useBoardStore';
import { useChatNavStore } from '@/lib/store/useChatNavStore';
import { useChatStore } from '@/lib/store/useChatStore';
import { useGroupStore, type Group, type GroupMessage, type MemberProfile } from '@/lib/store/useGroupStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { useSpeech } from '@/lib/hooks/useSpeech';

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
const GROUP_COLOR = '#4B6BC8';
const GROUP_BG = '#E0E8FF';

// =============================================================================
// Shared sub-components
// =============================================================================

// ─── Contact Avatar ───────────────────────────────────────────────────────────

function Avatar({ contact, size = 'md' }: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 40 : size === 'md' ? 60 : 96;
    if (contact.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="rounded-full object-cover flex-shrink-0 select-none"
                style={{ width: px, height: px }}
            />
        );
    }
    const initial = contact.name.charAt(0).toUpperCase();
    return (
        <div
            className="rounded-full flex items-center justify-center flex-shrink-0 select-none bg-[#FFE6D6]"
            style={{ width: px, height: px, fontSize: px * 0.38 }}
        >
            <span className="font-black text-[#C85F27]">{initial}</span>
        </div>
    );
}

// ─── Group Avatar ─────────────────────────────────────────────────────────────
// Shows (in priority order):
//   1. Custom uploaded photo (group.avatarUrl)
//   2. Auto-collage from member profile photos (group.memberProfiles)
//   3. Group initial letter on blue background

function GroupCollageCell({ profile }: { profile: MemberProfile }) {
    if (profile.avatar_url) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.display_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        );
    }
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', backgroundColor: GROUP_BG }}>
            <span style={{ fontWeight: 900, color: GROUP_COLOR, fontSize: 10 }}>
                {profile.display_name.charAt(0).toUpperCase()}
            </span>
        </div>
    );
}

function GroupAvatar({
    group,
    size = 'md',
}: {
    group: Pick<Group, 'name' | 'avatarUrl' | 'memberProfiles'>;
    size?: 'sm' | 'md' | 'lg';
}) {
    const px = size === 'sm' ? 40 : size === 'md' ? 60 : 96;
    const base: React.CSSProperties = {
        width: px, height: px, borderRadius: '50%',
        overflow: 'hidden', flexShrink: 0, userSelect: 'none',
    };

    // 1. Custom uploaded photo
    if (group.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={group.avatarUrl} alt={group.name}
                style={{ ...base, objectFit: 'cover', display: 'block' }} />
        );
    }

    const shown = (group.memberProfiles ?? []).slice(0, 4);
    const n = shown.length;

    // 2. No members → initial letter
    if (n === 0) {
        return (
            <div style={{ ...base, display: 'flex', alignItems: 'center',
                justifyContent: 'center', backgroundColor: GROUP_BG }}>
                <span style={{ fontWeight: 900, color: GROUP_COLOR, fontSize: px * 0.38 }}>
                    {group.name.charAt(0).toUpperCase()}
                </span>
            </div>
        );
    }

    // 3. 1 member
    if (n === 1) {
        return (
            <div style={base}><GroupCollageCell profile={shown[0]} /></div>
        );
    }

    // 4. 2 members → vertical split
    if (n === 2) {
        return (
            <div style={{ ...base, display: 'flex', gap: 1 }}>
                <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}><GroupCollageCell profile={shown[0]} /></div>
                <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}><GroupCollageCell profile={shown[1]} /></div>
            </div>
        );
    }

    // 5. 3 members → 2 top + 1 bottom full-width
    if (n === 3) {
        return (
            <div style={{ ...base, display: 'grid', gap: 1,
                gridTemplateAreas: '"a b" "c c"', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                <div style={{ gridArea: 'a', overflow: 'hidden' }}><GroupCollageCell profile={shown[0]} /></div>
                <div style={{ gridArea: 'b', overflow: 'hidden' }}><GroupCollageCell profile={shown[1]} /></div>
                <div style={{ gridArea: 'c', overflow: 'hidden' }}><GroupCollageCell profile={shown[2]} /></div>
            </div>
        );
    }

    // 6. 4+ members → 2×2 grid
    return (
        <div style={{ ...base, display: 'grid', gap: 1,
            gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
            {shown.map(p => (
                <div key={p.id} style={{ overflow: 'hidden' }}><GroupCollageCell profile={p} /></div>
            ))}
        </div>
    );
}

// ─── Folder breadcrumb ────────────────────────────────────────────────────────

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

// ─── Mini pictogram chip ──────────────────────────────────────────────────────

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
// Inline Reply — shows last received message in the header bar (P2P)
// =============================================================================

function InlineReply({ contact }: { contact: Contact }) {
    const messages = useChatStore((s) => s.messages);
    const profile = useProfileStore((s) => s.profile);
    const { speak, isSpeaking } = useSpeech();

    const lastReply = useMemo(() => {
        if (!profile?.id) return null;
        const received = messages.filter(
            (m) => m.sender_id === contact.contact_id && m.receiver_id === profile.id
        );
        return received.length > 0 ? received[received.length - 1] : null;
    }, [messages, contact.contact_id, profile?.id]);

    // initializedRef prevents speaking the last pre-existing message when the
    // conversation is first opened. TTS should only fire for genuinely NEW messages
    // that arrive after the component is mounted and the history has loaded.
    const initializedRef = useRef(false);
    const prevIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (!lastReply) return;
        if (!initializedRef.current) {
            // Silence the initial history load — just record the current last-message ID
            initializedRef.current = true;
            prevIdRef.current = lastReply.id;
            return;
        }
        if (lastReply.id !== prevIdRef.current) {
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
// Inline Reply — for groups (shows last message from any other member)
// =============================================================================

function GroupInlineReply({ group }: { group: Group }) {
    const groupMessages = useGroupStore((s) => s.groupMessages);
    const profile = useProfileStore((s) => s.profile);
    const { speak } = useSpeech();

    const lastReply = useMemo(() => {
        if (!profile?.id) return null;
        const received = groupMessages.filter(m => m.sender_id !== profile.id);
        return received.length > 0 ? received[received.length - 1] : null;
    }, [groupMessages, profile?.id]);

    // Same initialization guard as InlineReply — suppress TTS for pre-existing messages
    const initializedRef = useRef(false);
    const prevIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (!lastReply) return;
        if (!initializedRef.current) {
            initializedRef.current = true;
            prevIdRef.current = lastReply.id;
            return;
        }
        if (lastReply.id !== prevIdRef.current) {
            prevIdRef.current = lastReply.id;
            speak(lastReply.content);
        }
    }, [lastReply, speak]);

    if (!lastReply) {
        return (
            <div className="flex-1 flex items-center px-4">
                <span className="text-sm font-bold text-white/70 italic">{group.name}</span>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 px-3">
            <span className="text-white/60 text-xs font-bold flex-shrink-0">{lastReply.sender_name}:</span>
            {lastReply.pictograms?.length > 0 ? (
                lastReply.pictograms.slice(0, 5).map((p, i) => (
                    <PictoChip key={i} label={p.label} arasaacId={p.arasaacId} color={p.color} size="lg" />
                ))
            ) : (
                <p className="text-base font-bold text-white leading-snug line-clamp-2">{lastReply.content}</p>
            )}
        </div>
    );
}

// =============================================================================
// Thread panel (slide-over — caregiver P2P history)
// =============================================================================

function ThreadPanel({ contact, onClose }: { contact: Contact; onClose: () => void }) {
    const messages = useChatStore((s) => s.messages);
    const sendMessage = useChatStore((s) => s.sendMessage);
    const profile = useProfileStore((s) => s.profile);
    const { speak } = useSpeech();
    const [replyText, setReplyText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

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
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-full sm:max-w-[400px] flex flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.3)] z-50 animate-in slide-in-from-right">
                <div className="flex-shrink-0 flex items-center gap-4 px-6 py-5 border-b-2 border-[#FFD5BF] bg-[#FFF8F3] shadow-sm">
                    <Avatar contact={contact} size="md" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xl font-black text-gray-900 truncate">{contact.name}</p>
                        <p className="text-sm font-bold text-[#FF8844] uppercase tracking-widest">{contact.role}</p>
                    </div>
                    <button onClick={onClose} className="w-16 h-16 rounded-2xl bg-white border-2 border-[#FFD5BF] hover:bg-[#FFE6D6] active:scale-95 flex items-center justify-center transition-all shadow-md">
                        <X size={32} className="text-[#C85F27]" strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {thread.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 h-full py-12 text-gray-400">
                            <MessageCircle size={36} className="opacity-25" />
                            <p className="text-xs text-center font-medium px-6">Sin mensajes todavía.<br />Construye una frase en el tablero y envíala.</p>
                        </div>
                    ) : (
                        thread.map((entry) => {
                            const isSent = entry.sender_id === profile?.id;
                            return (
                                <div key={entry.id} className={cn('flex flex-col gap-1.5', isSent ? 'items-end' : 'items-start')}>
                                    {isSent ? (
                                        <>
                                            {entry.pictograms?.length > 0 && (
                                                <div className="flex gap-2 flex-wrap justify-end max-w-[320px]">
                                                    {entry.pictograms.map((p, i) => (
                                                        <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="xl" />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => speak(entry.content)} className="w-10 h-10 rounded-full bg-[#FFF1E8] hover:bg-[#FFE6D6] flex items-center justify-center flex-shrink-0 shadow-sm">
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
                                                {entry.pictograms?.length > 0 ? (
                                                    <div className="flex gap-2 flex-wrap max-w-[280px]">
                                                        {entry.pictograms.map((p, i) => (
                                                            <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="xl" />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#FFF1E8] text-slate-700 px-5 py-3 rounded-[1.5rem] rounded-bl-none text-lg font-bold max-w-[280px] leading-tight shadow-sm">
                                                        {entry.content}
                                                    </div>
                                                )}
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

                <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-t border-[#FFD5BF] bg-[#FFF8F3]">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                        placeholder={`${contact.name} responde…`}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-[#FFD5BF] text-sm focus:outline-none focus:border-[#FF8844] bg-white"
                    />
                    <button onClick={handleReply} disabled={!replyText.trim()}
                        className="w-11 h-11 rounded-xl bg-[#FF8844] hover:bg-[#F57D37] active:bg-[#E56F2C] disabled:opacity-30 flex items-center justify-center">
                        <Send size={18} className="text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}

// =============================================================================
// Group Historial slide-over (for AAC view)
// =============================================================================

function GroupHistorial({ group, onClose }: { group: Group; onClose: () => void }) {
    const groupMessages = useGroupStore((s) => s.groupMessages);
    const profile = useProfileStore((s) => s.profile);
    const { speak } = useSpeech();
    const bottomRef = useRef<HTMLDivElement>(null);

    function timeLabel(ts: string) {
        return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [groupMessages.length]);

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-full sm:max-w-[400px] flex flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.3)] z-50 animate-in slide-in-from-right">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center gap-4 px-6 py-5 border-b-2 border-[#D0D8F0] bg-[#F7F8FF] shadow-sm">
                    <GroupAvatar group={group} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xl font-black text-gray-900">{group.name}</p>
                    </div>
                    <button onClick={onClose} className="w-16 h-16 rounded-2xl bg-white border-2 border-[#D0D8F0] hover:bg-[#EEF1FF] active:scale-95 flex items-center justify-center shadow-md">
                        <X size={32} strokeWidth={3} style={{ color: GROUP_COLOR }} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {groupMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 h-full py-12 text-gray-400">
                            <MessageCircle size={36} className="opacity-25" />
                            <p className="text-xs text-center font-medium px-6">Sin mensajes en el grupo todavía.</p>
                        </div>
                    ) : (
                        groupMessages.map((msg) => {
                            const isSent = msg.sender_id === profile?.id;
                            return (
                                <div key={msg.id} className={cn('flex flex-col gap-1.5', isSent ? 'items-end' : 'items-start')}>
                                    {!isSent && (
                                        <span className="text-[10px] font-bold px-1" style={{ color: GROUP_COLOR }}>{msg.sender_name}</span>
                                    )}
                                    {isSent ? (
                                        <>
                                            {msg.pictograms?.length > 0 && (
                                                <div className="flex gap-2 flex-wrap justify-end max-w-[320px]">
                                                    {msg.pictograms.map((p, i) => (
                                                        <PictoChip key={i} label={p.label} arasaacId={p.arasaacId} color={p.color} size="xl" />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => speak(msg.content)} className="w-10 h-10 rounded-full bg-[#FFF1E8] hover:bg-[#FFE6D6] flex items-center justify-center flex-shrink-0">
                                                    <Volume2 size={20} className="text-[#FF8844]" />
                                                </button>
                                                <div className="bg-[#FF8844] text-white px-5 py-3 rounded-[1.5rem] rounded-br-none text-lg font-bold max-w-[280px] leading-tight shadow-sm">
                                                    &ldquo;{msg.content}&rdquo;
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                                                style={{ backgroundColor: GROUP_BG, color: GROUP_COLOR }}>
                                                {msg.sender_name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {msg.pictograms?.length > 0 ? (
                                                    <div className="flex gap-2 flex-wrap max-w-[280px]">
                                                        {msg.pictograms.map((p, i) => (
                                                            <PictoChip key={i} label={p.label} arasaacId={p.arasaacId} color={p.color} size="xl" />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#FFF1E8] text-slate-700 px-5 py-3 rounded-[1.5rem] rounded-bl-none text-lg font-bold max-w-[280px] leading-tight shadow-sm">
                                                        {msg.content}
                                                    </div>
                                                )}
                                                {msg.pictograms?.length > 0 && (
                                                    <p className="text-xs text-gray-400 font-bold px-1">{msg.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <span className="text-[10px] text-gray-400 font-bold px-1">{timeLabel(msg.created_at)}</span>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </>
    );
}

// =============================================================================
// Screen 1 — Contact + Group grid
// =============================================================================

function ContactGrid({ onSelectContact, onSelectGroup }: {
    onSelectContact: (c: Contact) => void;
    onSelectGroup: (g: Group) => void;
}) {
    const contacts = useContactStore((s) => s.contacts);
    const isLoading = useContactStore((s) => s.isLoading);
    const { addContact } = useContactStore();
    const profile = useProfileStore((s) => s.profile);
    const summary = useChatStore((s) => s.summary);
    const groups = useGroupStore((s) => s.groups);
    const groupSummary = useGroupStore((s) => s.groupSummary);
    const [showAddContact, setShowAddContact] = useState(false);

    const unifiedList = useMemo(() => {
        type Item =
            | { kind: 'contact'; data: Contact; ts: number }
            | { kind: 'group'; data: Group; ts: number };
        const items: Item[] = [
            ...contacts.map(c => ({
                kind: 'contact' as const,
                data: c,
                ts: summary[c.contact_id]?.lastMessage
                    ? new Date(summary[c.contact_id].lastMessage!.created_at).getTime()
                    : 0,
            })),
            ...groups.map(g => ({
                kind: 'group' as const,
                data: g,
                ts: groupSummary[g.id]
                    ? new Date(groupSummary[g.id]!.created_at).getTime()
                    : 0,
            })),
        ];
        return items.sort((a, b) => b.ts - a.ts);
    }, [contacts, groups, summary, groupSummary]);

    async function handleAddContact(data: Omit<Contact, 'id'>) {
        if (!profile?.id) return;
        await addContact(data, profile.id);
        setShowAddContact(false);
    }

    function timeStr(ts: string) {
        return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <>
        <div className="flex flex-col h-full bg-[#FFF7F2]">
            <div className="flex-shrink-0 px-5 pt-5 pb-4 bg-[#FFF4ED]" style={{ borderBottom: `1px solid ${BRAND_BORDER}` }}>
                <h1 className="text-[30px] font-black text-[#FF8844] leading-none tracking-tight">Mensajes</h1>
                <p className="text-[14px] text-slate-500 font-semibold mt-1.5">¿Con quién quieres hablar?</p>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2.5 flex flex-col">
                {isLoading ? (
                    <div className="flex flex-col gap-2 pt-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white border border-[#FFD5BF] animate-pulse">
                                <div className="w-[60px] h-[60px] rounded-full bg-[#FFE9DC] flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-[#FFE9DC] rounded-full w-1/2" />
                                    <div className="h-3 bg-[#FFF0E8] rounded-full w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : unifiedList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-400">
                        <UserRound size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No tienes contactos aún</p>
                        <button onClick={() => setShowAddContact(true)} className="text-sm font-bold text-[#FF8844] underline">
                            Añadir el primero
                        </button>
                    </div>
                ) : (
                    unifiedList.map((item) => {
                        if (item.kind === 'contact') {
                            const contact = item.data;
                            const s = summary[contact.contact_id];
                            const lastMsg = s?.lastMessage;
                            const unread = s?.unreadCount ?? 0;
                            const t = lastMsg ? timeStr(lastMsg.created_at) : '';
                            const lastReceived = lastMsg && lastMsg.sender_id !== profile?.id ? lastMsg : null;
                            return (
                                <button
                                    key={`c-${contact.id}`}
                                    onClick={() => onSelectContact(contact)}
                                    className="w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-white border border-[#FFD5BF] shadow-[0_1px_3px_rgba(200,95,39,0.14)] active:bg-[#FFF4ED] press-anim text-left"
                                >
                                    <Avatar contact={contact} size="md" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-[16px] font-bold text-gray-900 truncate leading-none">{contact.name}</span>
                                        </div>
                                        <div className="flex-1 min-w-0 flex items-center">
                                            {lastReceived?.pictograms && lastReceived.pictograms.length > 0 ? (
                                                <div className="flex gap-1 items-center flex-wrap">
                                                    {lastReceived.pictograms.slice(0, 4).map((p: PictoNode, i: number) => (
                                                        <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="md" />
                                                    ))}
                                                </div>
                                            ) : lastMsg?.pictograms && lastMsg.pictograms.length > 0 ? (
                                                <div className="flex gap-1 items-center opacity-60">
                                                    {lastMsg.pictograms.slice(0, 4).map((p: PictoNode, i: number) => (
                                                        <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="md" />
                                                    ))}
                                                </div>
                                            ) : lastReceived ? (
                                                <p className="text-[13px] text-gray-500 truncate font-medium">← {lastReceived.content}</p>
                                            ) : lastMsg ? (
                                                <p className="text-[13px] text-gray-400 truncate font-medium">→ {lastMsg.content}</p>
                                            ) : (
                                                <p className="text-[13px] text-gray-400 italic">Inicia la conversación</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between self-stretch py-0.5 min-w-[42px]">
                                        {t ? (
                                            <span className="text-[11px] leading-none" style={{ color: unread > 0 ? '#C85F27' : '#7B7B7B', fontWeight: unread > 0 ? 700 : 500 }}>{t}</span>
                                        ) : (
                                            <span className="text-[11px] text-transparent leading-none">00:00</span>
                                        )}
                                        {unread > 0 ? (
                                            <div className="flex-shrink-0 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[11px] font-black px-1 bg-[#FF8844]">{unread}</div>
                                        ) : (
                                            <span className="w-[22px] h-[22px]" aria-hidden="true" />
                                        )}
                                    </div>
                                </button>
                            );
                        }

                        // Group item
                        const group = item.data;
                        const lastMsg = groupSummary[group.id];
                        const t = lastMsg ? timeStr(lastMsg.created_at) : '';
                        return (
                            <button
                                key={`g-${group.id}`}
                                onClick={() => onSelectGroup(group)}
                                className="w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-white border press-anim text-left active:bg-[#EEF1FF]"
                                style={{ borderColor: GROUP_BG, boxShadow: '0 1px 3px rgba(75,107,200,0.12)' }}
                            >
                                <GroupAvatar group={group} size="md" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[16px] font-bold text-gray-900 truncate leading-none block mb-1">{group.name}</span>
                                    <div className="flex-1 min-w-0 flex items-center gap-1">
                                        {lastMsg?.pictograms && lastMsg.pictograms.length > 0 ? (
                                            <>
                                                <span className="text-[13px] text-gray-500 font-medium flex-shrink-0">{lastMsg.sender_name}:</span>
                                                {lastMsg.pictograms.slice(0, 3).map((p: PictoNode, i: number) => (
                                                    <PictoChip key={`${p.id}-${i}`} label={p.label} arasaacId={p.arasaacId} color={p.color} size="md" />
                                                ))}
                                            </>
                                        ) : lastMsg ? (
                                            <p className="text-[13px] text-gray-400 truncate font-medium">
                                                {lastMsg.sender_name}: {lastMsg.content}
                                            </p>
                                        ) : (
                                            <p className="text-[13px] text-gray-400 italic">Grupo nuevo</p>
                                        )}
                                    </div>
                                </div>
                                {t && (
                                    <span className="text-[11px] text-gray-400 flex-shrink-0">{t}</span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>

        {showAddContact && (
            <ContactForm onSave={handleAddContact} onCancel={() => setShowAddContact(false)} />
        )}
        </>
    );
}

// =============================================================================
// Screen 2a — Conversation with embedded AAC board (P2P)
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

    const profile = useProfileStore((s) => s.profile);
    const setCurrentContact = useChatStore((s) => s.setCurrentContact);
    const setContactName = useChatStore((s) => s.setContactName);
    const unsubscribeFromMessages = useChatStore((s) => s.unsubscribeFromMessages);

    // Open / switch conversation — runs when profile or contact changes
    useEffect(() => {
        if (profile?.id && contact.contact_id) {
            setCurrentContact(contact.contact_id, profile.id);
        }
        return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id, contact.contact_id]);

    // Keep notification name in sync independently so that if a caregiver renames
    // the contact while this conversation is open, push notifications get the new
    // name without re-running the whole subscription setup.
    useEffect(() => {
        setContactName(contact.name);
    }, [contact.name, setContactName]);

    const addWord = useBoardStore((s) => s.addWord);
    const sentence = useBoardStore((s) => s.sentence);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    const messages = useChatStore((s) => s.messages);
    const msgCount = useMemo(
        () => messages.filter(m => m.sender_id === contact.contact_id && !m.read).length,
        [messages, contact.contact_id]
    );

    const sendMessage = useChatStore((s) => s.sendMessage);

    const handleSend = useCallback(async () => {
        if (sentence.length === 0 || !profile?.id || !contact.contact_id) return;
        setIsTranslating(true);
        try {
            const content = sentence.map(p => p.label).join(' ');
            await sendMessage(sentence, content, profile.id, contact.contact_id);
            clearSentence();
        } catch (err) {
            console.error('[AAC Send Error]', err);
        } finally {
            setIsTranslating(false);
        }
    }, [sentence, profile?.id, contact.contact_id, sendMessage, clearSentence]);

    return (
        <div className="relative flex flex-col w-full h-full overflow-hidden bg-[#FFF0E6]">
            <header className="flex-shrink-0 flex flex-col bg-white border-b border-[#FFD5BF] z-10 shadow-sm">
                <div className="flex items-center gap-3 h-[72px] px-3 bg-[#FF8844]">
                    <button onClick={onBack} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white shadow-sm ml-1 border-2 border-white/30">
                        <ArrowLeft size={26} strokeWidth={2.5} className="text-white" />
                    </button>
                    <div className="ml-1 border-2 border-white/40 rounded-full shadow-sm bg-white/10 p-0.5 relative z-10 hidden sm:block">
                        <Avatar contact={contact} size="sm" />
                    </div>
                    <InlineReply contact={contact} />
                    <button onClick={() => setShowThread(true)} className="h-12 px-5 md:px-6 rounded-[1rem] flex items-center justify-center gap-2 font-black text-base transition-transform shadow-md bg-white text-[#FF8844] active:bg-[#FFF4ED] active:scale-95 ml-1 mr-1 border-b-4 border-[#FFD5BF]">
                        <MessageSquare size={22} fill="currentColor" />
                        <span className="hidden sm:inline">Historial</span>
                        {msgCount > 0 && (
                            <div className="bg-white text-[#C85F27] text-xs px-2 py-0.5 rounded-full ml-1">{msgCount}</div>
                        )}
                    </button>
                </div>
                <div className="bg-white border-t border-[#FFD5BF]/50">
                    <SentenceBar actionMode="messages" onSend={handleSend} isProcessing={isTranslating} />
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <AACBoard onWordAdd={addWord} onNavigate={() => {}} />
                </div>
            </main>

            {showThread && <ThreadPanel contact={contact} onClose={() => setShowThread(false)} />}
        </div>
    );
}

// =============================================================================
// Screen 2b — Group Conversation with embedded AAC board
// =============================================================================

function GroupConversationBoard({
    group,
    onBack,
}: {
    group: Group;
    onBack: () => void;
}) {
    const [showHistorial, setShowHistorial] = useState(false);

    const profile = useProfileStore((s) => s.profile);
    const loadGroupMessages = useGroupStore((s) => s.loadGroupMessages);
    const sendGroupMessage = useGroupStore((s) => s.sendGroupMessage);
    const subscribeToGroup = useGroupStore((s) => s.subscribeToGroup);
    const unsubscribeFromGroup = useGroupStore((s) => s.unsubscribeFromGroup);
    const groupMessages = useGroupStore((s) => s.groupMessages);

    useEffect(() => {
        if (profile?.id) {
            loadGroupMessages(group.id);
            subscribeToGroup(group.id, profile.id);
        }
        return () => unsubscribeFromGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.id, profile?.id]);

    const addWord = useBoardStore((s) => s.addWord);
    const sentence = useBoardStore((s) => s.sentence);
    const clearSentence = useBoardStore((s) => s.clearSentence);

    const handleSend = useCallback(async () => {
        if (sentence.length === 0 || !profile?.id) return;
        const content = sentence.map(p => p.label).join(' ');
        await sendGroupMessage(sentence, content, profile.id, profile.display_name ?? 'Yo', group.id);
        clearSentence();
    }, [sentence, profile, group.id, sendGroupMessage, clearSentence]);

    return (
        <div className="relative flex flex-col w-full h-full overflow-hidden bg-[#F0F2FF]">
            <header className="flex-shrink-0 flex flex-col bg-white border-b z-10 shadow-sm" style={{ borderColor: `${GROUP_BG}` }}>
                <div className="flex items-center gap-3 h-[72px] px-3" style={{ backgroundColor: GROUP_COLOR }}>
                    <button onClick={onBack} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20 hover:bg-white/30 active:scale-95 text-white border-2 border-white/30 ml-1">
                        <ArrowLeft size={26} strokeWidth={2.5} />
                    </button>
                    <div className="ml-1 hidden sm:block border-2 border-white/40 rounded-full">
                        <GroupAvatar group={group} size="sm" />
                    </div>
                    <GroupInlineReply group={group} />
                    <button onClick={() => setShowHistorial(true)} className="h-12 px-5 rounded-[1rem] flex items-center justify-center gap-2 font-black text-base bg-white active:scale-95 shadow-md border-b-4 ml-1 mr-1"
                        style={{ color: GROUP_COLOR, borderColor: GROUP_BG }}>
                        <MessageSquare size={22} fill="currentColor" />
                        <span className="hidden sm:inline">Historial</span>
                    </button>
                </div>
                <div className="bg-white border-t" style={{ borderColor: GROUP_BG }}>
                    <SentenceBar actionMode="messages" onSend={handleSend} isProcessing={false} />
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <AACBoard onWordAdd={addWord} onNavigate={() => {}} />
                </div>
            </main>

            {showHistorial && <GroupHistorial group={group} onClose={() => setShowHistorial(false)} />}
        </div>
    );
}

// =============================================================================
// Root — switches between contact grid, P2P conversation, and group conversation
// =============================================================================

export default function ChatPage() {
    const contacts = useContactStore((s) => s.contacts);
    const { loadContacts } = useContactStore();
    const profile = useProfileStore((s) => s.profile);
    const { selectedContactId, selectedGroupId, setSelectedContactId, setSelectedGroupId, clearSelectedContact } = useChatNavStore();

    const loadSummary = useChatStore((s) => s.loadSummary);
    const { loadGroups, loadGroupSummary } = useGroupStore();
    const groups = useGroupStore((s) => s.groups);

    useEffect(() => {
        if (profile?.id) {
            loadContacts(profile.id);
            loadSummary(profile.id);
            loadGroups(profile.id);
            loadGroupSummary(profile.id);
        }
    }, [profile?.id, loadContacts, loadSummary, loadGroups, loadGroupSummary]);

    const selectedContact = contacts.find((c) => c.id === selectedContactId) ?? null;
    const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

    if (selectedContact) {
        return <ConversationBoard contact={selectedContact} onBack={clearSelectedContact} />;
    }

    if (selectedGroup) {
        return <GroupConversationBoard group={selectedGroup} onBack={clearSelectedContact} />;
    }

    return (
        <ContactGrid
            onSelectContact={(c) => setSelectedContactId(c.id)}
            onSelectGroup={(g) => setSelectedGroupId(g.id)}
        />
    );
}
