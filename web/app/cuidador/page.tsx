'use client';

/**
 * /cuidador — Caregiver / Support Network Screen
 *
 * Familiar WhatsApp-style interface for caregivers, therapists and family.
 * Left panel: contact list (Personas tab) or group list (Grupos tab).
 * Right/full panel: vertical chat thread (P2P or group).
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Send, Volume2,
    Search, Plus, CheckCheck, Settings, UserRound, Users, X
} from 'lucide-react';

import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { useChatStore, type ChatMessage } from '@/lib/store/useChatStore';
import { useGroupStore, type Group, type GroupMessage } from '@/lib/store/useGroupStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { textToPictos } from '@/lib/ai/picto-nlp';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { cn } from '@/lib/utils';
import { ContactForm } from '@/components/ContactForm';

const BRAND = '#FF8844';
const BRAND_DARK = '#C85F27';
const BRAND_SOFT = '#FFF4ED';
const BRAND_BORDER = '#FFD5BF';
const GROUP_COLOR = '#4B6BC8';
const GROUP_BG = '#E0E8FF';

// =============================================================================
// Selection type
// =============================================================================

type Selection =
    | { kind: 'contact'; contact: Contact }
    | { kind: 'group'; group: Group }
    | null;

// =============================================================================
// Helpers
// =============================================================================

function timeLabel(ts: string) {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
        ? d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('es', { month: 'short', day: 'numeric' });
}

// =============================================================================
// Avatar — for contacts (orange scheme)
// =============================================================================

function Avatar({
    contact, size = 'md',
}: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 36 : size === 'md' ? 48 : 64;
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

// =============================================================================
// GroupAvatar — for groups (blue scheme)
// =============================================================================

function GroupAvatar({
    name, size = 'md',
}: { name: string; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 36 : size === 'md' ? 48 : 64;
    return (
        <div
            className="rounded-full flex items-center justify-center flex-shrink-0 select-none"
            style={{ width: px, height: px, fontSize: px * 0.38, backgroundColor: GROUP_BG }}
        >
            <span className="font-black" style={{ color: GROUP_COLOR }}>
                {name.charAt(0).toUpperCase()}
            </span>
        </div>
    );
}

// =============================================================================
// Left-panel tab switcher
// =============================================================================

function TabBar({
    activeTab,
    onChange,
}: { activeTab: 'personas' | 'grupos'; onChange: (t: 'personas' | 'grupos') => void }) {
    return (
        <div className="flex-shrink-0 flex border-b border-[#FFD5BF] bg-[#FFF8F3]">
            {(['personas', 'grupos'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={cn(
                        'flex-1 py-3 text-sm font-bold transition-colors capitalize',
                        activeTab === tab
                            ? 'text-[#FF8844] border-b-2 border-[#FF8844]'
                            : 'text-gray-400 hover:text-gray-600'
                    )}
                >
                    {tab === 'personas' ? 'Personas' : 'Grupos'}
                </button>
            ))}
        </div>
    );
}

// =============================================================================
// Contact List (Personas tab)
// =============================================================================

function ContactList({
    contacts,
    isLoading,
    selectedId,
    onSelect,
    onAdd,
}: {
    contacts: Contact[];
    isLoading: boolean;
    selectedId: string | null;
    onSelect: (c: Contact) => void;
    onAdd: () => void;
}) {
    const [query, setQuery] = useState('');
    const profileId = useProfileStore(s => s.profile?.id);
    const summary = useChatStore(s => s.summary);

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-[#FFF8F3] border-b border-[#FFD5BF]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onAdd}
                            className="p-2 text-[#C85F27] hover:bg-[#FFE6D6] rounded-full transition-colors"
                            aria-label="Añadir contacto"
                        >
                            <Plus size={20} />
                        </button>
                        <Link href="/cuidador/settings" className="p-2 -mr-2 text-[#C85F27] hover:bg-[#FFE6D6] rounded-full transition-colors" aria-label="Ajustes">
                            <Settings size={20} />
                        </Link>
                    </div>
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-[#FFD5BF] rounded-2xl px-3 py-2">
                    <Search size={15} className="text-[#C85F27] flex-shrink-0" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar contacto…"
                        className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#FFF0E8]">
                {isLoading ? (
                    <div className="flex flex-col divide-y divide-[#FFF0E8]">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-[#FFE9DC] flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-[#FFE9DC] rounded-full w-1/2" />
                                    <div className="h-3 bg-[#FFF0E8] rounded-full w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                        <UserRound size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No tienes contactos aún</p>
                        <button onClick={onAdd} className="text-sm font-bold text-[#FF8844] underline">
                            Añadir el primero
                        </button>
                    </div>
                ) : filtered.map(contact => {
                    const s = summary[contact.contact_id];
                    const lastMsg = s?.lastMessage;
                    const count = s?.unreadCount ?? 0;
                    const isActive = selectedId === contact.id;

                    let previewText = '';
                    if (lastMsg) {
                        const isSent = lastMsg.sender_id === profileId;
                        const arrow = isSent ? '→ ' : '← ';
                        const body = lastMsg.content || lastMsg.pictograms?.map(p => p.label).join(' ') || '';
                        previewText = arrow + body;
                    }

                    return (
                        <button
                            key={contact.id}
                            onClick={() => onSelect(contact)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                                isActive ? 'bg-[#FFF0E8]' : 'hover:bg-[#FFFAF7]'
                            )}
                        >
                            <Avatar contact={contact} size="md" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className={cn('text-sm font-bold truncate', count > 0 ? 'text-gray-900' : 'text-gray-800')}>
                                        {contact.name}
                                    </span>
                                    {lastMsg && (
                                        <span className={cn('text-[10px] flex-shrink-0', count > 0 ? 'text-[#C85F27] font-bold' : 'text-gray-400')}>
                                            {timeLabel(lastMsg.created_at)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <p className={cn('text-xs truncate flex-1', count > 0 ? 'text-gray-700 font-semibold' : 'text-gray-400')}>
                                        {previewText || <span className="italic">Sin mensajes</span>}
                                    </p>
                                    {count > 0 && (
                                        <span className="flex-shrink-0 bg-[#FF8844] text-white text-[10px] font-black min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">
                                            {count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// =============================================================================
// Group List (Grupos tab)
// =============================================================================

function GroupList({
    groups,
    isLoading,
    selectedId,
    onSelect,
    onCreate,
}: {
    groups: Group[];
    isLoading: boolean;
    selectedId: string | null;
    onSelect: (g: Group) => void;
    onCreate: () => void;
}) {
    const groupSummary = useGroupStore(s => s.groupSummary);

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-[#FFF8F3] border-b border-[#FFD5BF]">
                <div className="flex items-center justify-end">
                    <button
                        onClick={onCreate}
                        className="p-2 text-[#C85F27] hover:bg-[#FFE6D6] rounded-full transition-colors"
                        aria-label="Crear grupo"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#EEF1FF]">
                {isLoading ? (
                    <div className="flex flex-col divide-y divide-[#EEF1FF]">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-[#E0E8FF] flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-[#E0E8FF] rounded-full w-1/2" />
                                    <div className="h-3 bg-[#EEF1FF] rounded-full w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                        <Users size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No hay grupos aún</p>
                        <button onClick={onCreate} className="text-sm font-bold" style={{ color: GROUP_COLOR }}>
                            Crear el primero
                        </button>
                    </div>
                ) : groups.map(group => {
                    const lastMsg = groupSummary[group.id];
                    const isActive = selectedId === group.id;
                    return (
                        <button
                            key={group.id}
                            onClick={() => onSelect(group)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                                isActive ? 'bg-[#EEF1FF]' : 'hover:bg-[#F7F8FF]'
                            )}
                        >
                            <GroupAvatar name={group.name} size="md" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-gray-800 truncate">{group.name}</span>
                                    {lastMsg && (
                                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                                            {timeLabel(lastMsg.created_at)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {lastMsg
                                        ? `${lastMsg.sender_name}: ${lastMsg.content || (lastMsg.pictograms?.length > 0 ? `${lastMsg.pictograms.length} pictograma(s)` : '')}`
                                        : <span className="italic">Sin mensajes</span>
                                    }
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// =============================================================================
// Group Create Modal
// =============================================================================

function GroupCreateModal({
    onSave,
    onCancel,
}: {
    onSave: (group: Group) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState('');
    const [emails, setEmails] = useState(['']);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const profile = useProfileStore(s => s.profile);
    const loadGroups = useGroupStore(s => s.loadGroups);
    const loadGroupSummary = useGroupStore(s => s.loadGroupSummary);

    async function handleCreate() {
        if (!name.trim()) { setError('El nombre del grupo es requerido'); return; }
        setIsCreating(true);
        setError('');
        try {
            const validEmails = emails.filter(e => e.trim());
            const res = await fetch('/api/groups/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), memberEmails: validEmails }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                setError(json.error || 'Error al crear el grupo');
                return;
            }
            const { group } = await res.json();
            // Reload groups so the new one appears
            if (profile?.id) {
                await Promise.all([loadGroups(profile.id), loadGroupSummary(profile.id)]);
            }
            // Convert API response to our Group shape
            onSave({
                id: group.id,
                name: group.name,
                avatarUrl: group.avatar_url ?? null,
                createdBy: group.created_by,
                createdAt: group.created_at,
                memberIds: [],
            });
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-[420px] flex flex-col gap-5 shadow-2xl">
                <h2 className="text-xl font-black text-[#C85F27]">Crear grupo</h2>

                {/* Group name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700">Nombre del grupo</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej: Familia García"
                        autoFocus
                        className="h-11 border border-[#FFD5BF] rounded-xl px-4 text-sm outline-none focus:border-[#FF8844]"
                    />
                </div>

                {/* Member emails */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">
                        Miembros <span className="text-gray-400 font-normal">(correo electrónico)</span>
                    </label>
                    {emails.map((email, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input
                                value={email}
                                onChange={e => {
                                    const n = [...emails];
                                    n[i] = e.target.value;
                                    setEmails(n);
                                }}
                                placeholder="correo@ejemplo.com"
                                type="email"
                                className="flex-1 h-10 border border-[#FFD5BF] rounded-xl px-3 text-sm outline-none focus:border-[#FF8844]"
                            />
                            {emails.length > 1 && (
                                <button
                                    onClick={() => setEmails(emails.filter((_, j) => j !== i))}
                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => setEmails([...emails, ''])}
                        className="text-sm font-bold self-start hover:underline"
                        style={{ color: GROUP_COLOR }}
                    >
                        + Añadir correo
                    </button>
                </div>

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-xl border border-[#FFD5BF] text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isCreating || !name.trim()}
                        className="flex-1 h-11 rounded-xl text-white text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                        style={{ backgroundColor: BRAND }}
                    >
                        {isCreating ? 'Creando…' : 'Crear grupo'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Message Bubble (P2P)
// =============================================================================

function Bubble({ entry, contact, isSent }: { entry: ChatMessage; contact: Contact; isSent: boolean }) {
    const { speak, isSpeaking } = useSpeech();

    return (
        <div className={cn('flex items-end gap-2 max-w-[80%]', isSent ? 'self-end flex-row-reverse' : 'self-start')}>
            {!isSent && <Avatar contact={contact} size="sm" />}

            <div className="flex flex-col gap-1">
                {/* Pictogram strip */}
                {entry.pictograms && entry.pictograms.length > 0 && (
                    <div className={cn(
                        'flex flex-wrap gap-1 p-2 rounded-2xl border max-w-[280px]',
                        isSent
                            ? 'bg-[#FFF0E8] border-[#FFD5BF] rounded-br-sm'
                            : 'bg-white border-slate-200 rounded-bl-sm'
                    )}>
                        {entry.pictograms.map((p, i) => (
                            <div key={i} className="flex flex-col items-center gap-0.5">
                                <div
                                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl"
                                    style={{ borderColor: p.color ?? '#e2e8f0', backgroundColor: `${p.color ?? '#6b7280'}18` }}
                                >
                                    {p.arasaacId ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={`https://static.arasaac.org/pictograms/${p.arasaacId}/${p.arasaacId}_300.png`} alt={p.label} className="w-10 h-10 object-contain" />
                                    ) : '🔲'}
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 text-center leading-none">{p.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Text bubble */}
                <div className={cn('flex items-center gap-2', isSent ? 'flex-row-reverse' : '')}>
                    <div className={cn(
                        'px-4 py-2.5 rounded-[1.25rem] text-sm font-medium leading-relaxed shadow-sm',
                        isSent
                            ? 'bg-[#FF8844] text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-slate-200 rounded-bl-sm'
                    )}>
                        {entry.content}
                    </div>
                    <button
                        onClick={() => speak(entry.content)}
                        className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                            isSpeaking ? 'bg-[#FF8844] text-white' : 'bg-slate-100 text-slate-500 hover:bg-[#FFF0E8] hover:text-[#FF8844]'
                        )}
                        aria-label="Escuchar"
                    >
                        <Volume2 size={13} />
                    </button>
                </div>

                {/* Timestamp + read receipt */}
                <div className={cn('flex items-center gap-1 px-1', isSent ? 'justify-end' : 'justify-start')}>
                    <span className="text-[10px] text-gray-400">{timeLabel(entry.created_at)}</span>
                    {isSent && <CheckCheck size={12} className="text-[#FF8844]" />}
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Thread Panel — P2P (right panel for a selected contact)
// =============================================================================

function ThreadPanel({
    contact,
    onBack,
}: {
    contact: Contact;
    onBack: () => void;
}) {
    const profile = useProfileStore(s => s.profile);
    const messages = useChatStore(s => s.messages);
    const setCurrentContact = useChatStore(s => s.setCurrentContact);
    const setContactName = useChatStore(s => s.setContactName);
    const unsubscribeFromMessages = useChatStore(s => s.unsubscribeFromMessages);

    const [text, setText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (profile?.id && contact.contact_id) {
            setContactName(contact.name);
            setCurrentContact(contact.contact_id, profile.id);
        }
        return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id, contact.contact_id]);

    const thread = useMemo(() => messages, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread.length]);

    const sendMessage = useChatStore(s => s.sendMessage);

    const handleSend = useCallback(async () => {
        const t = text.trim();
        if (!t || !profile?.id || !contact.contact_id) return;
        setIsTranslating(true);
        try {
            const hfRes = await textToPictos(t);
            const pictosMapped = hfRes.pictograms.map(p => ({
                id: p.id.toString(),
                label: p.labels?.es || '?',
                arasaacId: p.id,
                color: '#FFF0E8'
            }));
            await sendMessage(pictosMapped, t, profile.id, contact.contact_id);
            setText('');
        } catch (e) {
            console.error('[Cuidador Send Error]', e);
        } finally {
            setIsTranslating(false);
        }
    }, [text, profile?.id, contact.contact_id, sendMessage]);

    return (
        <div className="flex flex-col h-full bg-[#F8F4F1]">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#FFD5BF] shadow-sm">
                <button
                    onClick={onBack}
                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF4ED] text-[#FF8844] border border-[#FFD5BF] hover:bg-[#FFE6D6] transition-colors flex-shrink-0"
                >
                    <ArrowLeft size={18} />
                </button>
                <Avatar contact={contact} size="sm" />
                <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-base font-black text-gray-900 truncate">{contact.name}</p>
                </div>
                <div className="text-[10px] font-bold text-gray-400 italic hidden md:block">
                    Los mensajes de texto se traducen automáticamente a pictogramas
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                {thread.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-gray-400 text-center">
                        <div className="text-5xl">💬</div>
                        <p className="text-sm font-semibold max-w-[200px]">Aún no hay mensajes con {contact.name}.</p>
                    </div>
                ) : (
                    thread.map(entry => (
                        <Bubble key={entry.id} entry={entry} contact={contact} isSent={entry.sender_id === profile?.id} />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 bg-white border-t border-[#FFD5BF]">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Escribe a ${contact.name}…`}
                    className="flex-1 h-11 bg-[#F8F4F1] border border-[#FFD5BF] rounded-2xl px-4 text-sm outline-none focus:border-[#FF8844] text-gray-800 placeholder:text-gray-400"
                    disabled={isTranslating}
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim() || isTranslating}
                    className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-md active:scale-95',
                        text.trim() && !isTranslating ? 'bg-[#FF8844] text-white' : 'bg-[#FFD5BF] text-white cursor-not-allowed'
                    )}
                >
                    <Send size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// Group Thread Panel — right panel for a selected group
// =============================================================================

function GroupThreadPanel({
    group,
    onBack,
}: {
    group: Group;
    onBack: () => void;
}) {
    const profile = useProfileStore(s => s.profile);
    const groupMessages = useGroupStore(s => s.groupMessages);
    const loadGroupMessages = useGroupStore(s => s.loadGroupMessages);
    const sendGroupMessage = useGroupStore(s => s.sendGroupMessage);
    const subscribeToGroup = useGroupStore(s => s.subscribeToGroup);
    const unsubscribeFromGroup = useGroupStore(s => s.unsubscribeFromGroup);

    const [text, setText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (profile?.id) {
            loadGroupMessages(group.id);
            subscribeToGroup(group.id, profile.id);
        }
        return () => unsubscribeFromGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.id, profile?.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [groupMessages.length]);

    const handleSend = useCallback(async () => {
        const t = text.trim();
        if (!t || !profile?.id) return;
        setIsTranslating(true);
        try {
            const hfRes = await textToPictos(t);
            const pictosMapped = hfRes.pictograms.map(p => ({
                id: p.id.toString(),
                label: p.labels?.es || '?',
                arasaacId: p.id,
                color: '#FFF0E8'
            }));
            await sendGroupMessage(pictosMapped, t, profile.id, profile.display_name ?? 'Yo', group.id);
            setText('');
        } catch (e) {
            console.error('[Group Send Error]', e);
        } finally {
            setIsTranslating(false);
        }
    }, [text, profile, group.id, sendGroupMessage]);

    return (
        <div className="flex flex-col h-full bg-[#F7F8FF]">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#D0D8F0] shadow-sm">
                <button
                    onClick={onBack}
                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-[#EEF1FF] hover:bg-[#E0E8FF] transition-colors flex-shrink-0"
                    style={{ color: GROUP_COLOR }}
                >
                    <ArrowLeft size={18} />
                </button>
                <GroupAvatar name={group.name} size="sm" />
                <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-gray-900 truncate">{group.name}</p>
                    <p className="text-xs text-gray-400">{group.memberIds.length > 0 ? `${group.memberIds.length} miembros` : 'Grupo'}</p>
                </div>
                <div className="text-[10px] font-bold text-gray-400 italic hidden md:block">
                    Los mensajes se traducen a pictogramas para usuarios AAC
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {groupMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-gray-400 text-center">
                        <div className="text-5xl">💬</div>
                        <p className="text-sm font-semibold">Sin mensajes en este grupo.</p>
                        <p className="text-xs text-gray-300 max-w-[200px]">Escribe el primero abajo.</p>
                    </div>
                ) : (
                    groupMessages.map(msg => {
                        const isSent = msg.sender_id === profile?.id;
                        return (
                            <div key={msg.id} className={cn('flex items-end gap-2 max-w-[80%]', isSent ? 'self-end flex-row-reverse' : 'self-start')}>
                                {/* Sender initial bubble (for others) */}
                                {!isSent && (
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                                        style={{ backgroundColor: GROUP_BG, color: GROUP_COLOR }}>
                                        {msg.sender_name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                    {!isSent && (
                                        <span className="text-[10px] font-bold px-1" style={{ color: GROUP_COLOR }}>{msg.sender_name}</span>
                                    )}
                                    {/* Pictogram strip */}
                                    {msg.pictograms?.length > 0 && (
                                        <div className={cn('flex flex-wrap gap-1 p-2 rounded-2xl border max-w-[280px]',
                                            isSent ? 'bg-[#FFF0E8] border-[#FFD5BF]' : 'bg-white border-slate-200')}>
                                            {msg.pictograms.map((p, i) => (
                                                <div key={i} className="flex flex-col items-center gap-0.5">
                                                    <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center"
                                                        style={{ borderColor: p.color ?? '#e2e8f0', backgroundColor: `${p.color ?? '#6b7280'}18` }}>
                                                        {p.arasaacId
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            ? <img src={`https://static.arasaac.org/pictograms/${p.arasaacId}/${p.arasaacId}_300.png`} alt={p.label} className="w-10 h-10 object-contain" />
                                                            : '🔲'}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-600">{p.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Text bubble */}
                                    <div className={cn('px-4 py-2.5 rounded-[1.25rem] text-sm font-medium leading-relaxed shadow-sm',
                                        isSent ? 'bg-[#FF8844] text-white rounded-br-sm' : 'bg-white text-gray-800 border border-slate-200 rounded-bl-sm')}>
                                        {msg.content}
                                    </div>
                                    <span className={cn('text-[10px] text-gray-400 px-1', isSent ? 'text-right' : 'text-left')}>
                                        {timeLabel(msg.created_at)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 bg-white border-t border-[#D0D8F0]">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Escribe al grupo…"
                    className="flex-1 h-11 bg-[#F7F8FF] border border-[#D0D8F0] rounded-2xl px-4 text-sm outline-none text-gray-800 placeholder:text-gray-400"
                    style={{ ['--tw-ring-color' as any]: GROUP_COLOR }}
                    disabled={isTranslating}
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim() || isTranslating}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: text.trim() && !isTranslating ? GROUP_COLOR : '#A0AED8', color: 'white' }}
                >
                    <Send size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// Empty State (no chat selected on desktop)
// =============================================================================

function NoChat() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#FFFAF7] text-gray-400 text-center p-8">
            <div className="text-6xl">💬</div>
            <p className="text-lg font-black text-[#C85F27]">PictoLink — Red de Apoyo</p>
            <p className="text-sm font-medium max-w-[260px]">
                Selecciona un contacto o grupo para ver la conversación.
                <br /><br />
                Tus mensajes se traducen automáticamente a pictogramas para el usuario AAC.
            </p>
        </div>
    );
}

// =============================================================================
// Root Page
// =============================================================================

export default function CuidadorPage() {
    const contacts = useContactStore(s => s.contacts);
    const isLoadingContacts = useContactStore(s => s.isLoading);
    const { addContact, loadContacts, subscribeToContacts, unsubscribeFromContacts } = useContactStore();

    const groups = useGroupStore(s => s.groups);
    const isLoadingGroups = useGroupStore(s => s.isLoading);
    const { loadGroups, loadGroupSummary } = useGroupStore();

    const profile = useProfileStore(s => s.profile);
    const loadSummary = useChatStore(s => s.loadSummary);

    const [selected, setSelected] = useState<Selection>(null);
    const [activeTab, setActiveTab] = useState<'personas' | 'grupos'>('personas');
    const [showAddContact, setShowAddContact] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    // Initial load + realtime subscription for auto-created contacts
    useEffect(() => {
        if (profile?.id) {
            loadContacts(profile.id);
            loadSummary(profile.id);
            loadGroups(profile.id);
            loadGroupSummary(profile.id);
            subscribeToContacts(profile.id);
        }
        return () => unsubscribeFromContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id]);

    async function handleAddContact(data: Omit<Contact, 'id'>) {
        if (!profile?.id) return;
        await addContact(data, profile.id);
        setShowAddContact(false);
    }

    function handleGroupCreated(group: Group) {
        setShowCreateGroup(false);
        setActiveTab('grupos');
        setSelected({ kind: 'group', group });
    }

    const showThread = !!selected;
    const selectedContactId = selected?.kind === 'contact' ? selected.contact.id : null;
    const selectedGroupId = selected?.kind === 'group' ? selected.group.id : null;

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left panel — Contacts + Groups tabs */}
            <aside className={cn(
                'flex-shrink-0 w-full md:w-[320px] md:flex flex-col h-full bg-white border-r border-[#FFE2D0]',
                showThread ? 'hidden' : 'flex'
            )}>
                {/* App header */}
                <div className="flex-shrink-0 px-4 pt-5 pb-0 bg-[#FFF8F3]">
                    <h1 className="text-xl font-black text-[#C85F27] mb-3">Mensajes</h1>
                </div>

                {/* Tab switcher */}
                <TabBar activeTab={activeTab} onChange={setActiveTab} />

                {/* Tab content */}
                {activeTab === 'personas' ? (
                    <ContactList
                        contacts={contacts}
                        isLoading={isLoadingContacts}
                        selectedId={selectedContactId}
                        onSelect={c => setSelected({ kind: 'contact', contact: c })}
                        onAdd={() => setShowAddContact(true)}
                    />
                ) : (
                    <GroupList
                        groups={groups}
                        isLoading={isLoadingGroups}
                        selectedId={selectedGroupId}
                        onSelect={g => setSelected({ kind: 'group', group: g })}
                        onCreate={() => setShowCreateGroup(true)}
                    />
                )}
            </aside>

            {/* Right panel — Thread */}
            <div className={cn(
                'flex-1 flex-col h-full',
                showThread ? 'flex' : 'hidden md:flex'
            )}>
                {selected?.kind === 'contact' ? (
                    <ThreadPanel contact={selected.contact} onBack={() => setSelected(null)} />
                ) : selected?.kind === 'group' ? (
                    <GroupThreadPanel
                        group={groups.find(g => g.id === selected.group.id) ?? selected.group}
                        onBack={() => setSelected(null)}
                    />
                ) : (
                    <NoChat />
                )}
            </div>

            {/* Add Contact Modal */}
            {showAddContact && (
                <ContactForm
                    onSave={handleAddContact}
                    onCancel={() => setShowAddContact(false)}
                />
            )}

            {/* Create Group Modal */}
            {showCreateGroup && (
                <GroupCreateModal
                    onSave={handleGroupCreated}
                    onCancel={() => setShowCreateGroup(false)}
                />
            )}
        </div>
    );
}
