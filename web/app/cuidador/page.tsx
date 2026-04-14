'use client';

/**
 * /cuidador — Caregiver / Support Network Screen
 *
 * Familiar WhatsApp-style interface for caregivers, therapists and family.
 * Left panel: contact list.  Right/full panel: vertical chat thread.
 *
 * Reads from the same usePhraseLogStore used by the AAC board so the
 * conversation history is always in sync without a backend.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Send, Volume2, Image as ImageIcon,
    Search, Plus, Check, CheckCheck, Settings, UserRound
} from 'lucide-react';

import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { useChatStore, type ChatMessage } from '@/lib/store/useChatStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { textToPictos } from '@/lib/ai/picto-nlp';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { cn } from '@/lib/utils';
import { ContactForm } from '@/components/ContactForm';

const BRAND = '#FF8844';
const BRAND_DARK = '#C85F27';
const BRAND_SOFT = '#FFF4ED';
const BRAND_BORDER = '#FFD5BF';

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
// Avatar
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
// Contact List (left panel / full screen on mobile)
// =============================================================================

function ContactList({
    contacts,
    isLoading,
    selectedId,
    entries,
    onSelect,
    onAdd,
}: {
    contacts: Contact[];
    isLoading: boolean;
    selectedId: string | null;
    entries: ChatMessage[];
    onSelect: (c: Contact) => void;
    onAdd: () => void;
}) {
    const [query, setQuery] = useState('');

    const profileId = useProfileStore(s => s.profile?.id);

    const lastMsg = useMemo(() => {
        const map: Record<string, ChatMessage> = {};
        for (const e of entries) {
            // El cuidador quiere ver el último mensaje de cada chat
            // Para simplificar (ya que el store de chat tiene todos), asumimos 1 a 1 por ahora 
            // o lo agrupamos por participante en base a las conversations.
            const otherId = e.sender_id === profileId ? e.receiver_id : e.sender_id;
            map[otherId] = e; // P2P mapping
        }
        return map;
    }, [entries, profileId]);

    const unread = useMemo(() => {
        const map: Record<string, number> = {};
        for (const e of entries) {
            // Un mensaje recibido es aquel cuyo sender NO es el perfil actual.
            // Sumamos al contactId que nos lo envió.
            if (profileId && e.sender_id !== profileId && !e.read) {
                map[e.sender_id] = (map[e.sender_id] ?? 0) + 1;
            }
        }
        return map;
    }, [entries, profileId]);

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-[#FFE2D0]">
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-5 pb-3 bg-[#FFF8F3] border-b border-[#FFD5BF]">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-black text-[#C85F27]">Mensajes</h1>
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
            <div className="flex-1 overflow-y-auto divide-y divide-[#FFF0E8] flex flex-col">
                {isLoading ? (
                    // Loading skeleton while contacts fetch from Supabase
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
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-gray-400">
                        <UserRound size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No tienes contactos aún</p>
                        <button
                            onClick={onAdd}
                            className="text-sm font-bold text-[#FF8844] underline"
                        >
                            Añadir el primero
                        </button>
                    </div>
                ) : filtered.map(contact => {
                    const preview = lastMsg[contact.contact_id];
                    const count = unread[contact.contact_id] ?? 0;
                    const isActive = contact.id === selectedId;
                    return (
                        <button
                            key={contact.id}
                            onClick={() => onSelect(contact)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                                isActive ? 'bg-[#FFF0E8]' : 'hover:bg-[#FFFAF7]'
                            )}
                        >
                            <div className="relative flex-shrink-0">
                                <Avatar contact={contact} size="md" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-gray-900 truncate">{contact.name}</span>
                                    {preview && (
                                        <span className={cn('text-[10px] flex-shrink-0', count > 0 ? 'text-[#C85F27] font-bold' : 'text-gray-400')}>
                                            {timeLabel(preview.created_at)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <p className="text-xs text-gray-500 truncate">
                                        {/* TODO: Connect preview properly with Supabase conversations */}
                                        <span className="italic text-gray-300">Click para ver mensajes</span>
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
// Message Bubble
// =============================================================================

function Bubble({ entry, contact, isSent }: { entry: ChatMessage; contact: Contact; isSent: boolean }) {
    const { speak, isSpeaking } = useSpeech();

    return (
        <div className={cn('flex items-end gap-2 max-w-[80%]', isSent ? 'self-end flex-row-reverse' : 'self-start')}>
            {!isSent && <Avatar contact={contact} size="sm" />}

            <div className="flex flex-col gap-1">
                {/* Pictogram strip — shown when AAC message has pictograms */}
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
                                        <img
                                            src={`https://static.arasaac.org/pictograms/${p.arasaacId}/${p.arasaacId}_300.png`}
                                            alt={p.label}
                                            className="w-10 h-10 object-contain"
                                        />
                                    ) : '🔲'}
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 text-center leading-none">{p.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Text bubble */}
                <div className={cn(
                    'flex items-center gap-2',
                    isSent ? 'flex-row-reverse' : ''
                )}>
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
// Thread Panel (right side — the actual chat)
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

    // Initialise chat — only re-run when IDs change
    useEffect(() => {
        if (profile?.id && contact.contact_id) {
            setContactName(contact.name);
            setCurrentContact(contact.contact_id, profile.id);
            import('@/lib/notifications').then(({ requestNotificationPermission }) => {
                requestNotificationPermission();
            });
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
            // Translador de Hugging Face: Texto -> Pictos  (para favorecer comprensión del usuario AAC)
            const hfRes = await textToPictos(t);
            const pictosMapped = hfRes.pictograms.map(p => ({
                id: p.id.toString(),
                label: p.labels?.es || '?',
                arasaacId: p.id,
                color: '#FFF0E8'
            }));

            // Grabar en Supabase
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
                {/* Back button — visible on mobile */}
                <button
                    onClick={onBack}
                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF4ED] text-[#FF8844] border border-[#FFD5BF] hover:bg-[#FFE6D6] transition-colors flex-shrink-0"
                    aria-label="Volver"
                >
                    <ArrowLeft size={18} />
                </button>

                <Avatar contact={contact} size="sm" />

                <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-base font-black text-gray-900 truncate">{contact.name}</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-gray-400 italic hidden md:block">
                        Los mensajes de texto se traducen automáticamente a pictogramas
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                {thread.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-gray-400 text-center">
                        <div className="text-5xl">💬</div>
                        <p className="text-sm font-semibold max-w-[200px]">
                            Aún no hay mensajes con {contact.name}.
                        </p>
                        <p className="text-xs text-gray-300 max-w-[200px]">
                            Escribe un mensaje abajo para comenzar.
                        </p>
                    </div>
                ) : (
                    thread.map(entry => (
                        <Bubble key={entry.id} entry={entry} contact={contact} isSent={entry.sender_id === profile?.id} />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 bg-white border-t border-[#FFD5BF]">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Escribe a ${contact.name}…`}
                    className="flex-1 h-11 bg-[#F8F4F1] border border-[#FFD5BF] rounded-2xl px-4 text-sm outline-none focus:border-[#FF8844] focus:ring-2 focus:ring-[#FF8844]/10 transition-all text-gray-800 placeholder:text-gray-400"
                    disabled={isTranslating}
                />

                <button
                    onClick={handleSend}
                    disabled={!text.trim() || isTranslating}
                    className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-all active:scale-95',
                        text.trim() && !isTranslating
                            ? 'bg-[#FF8844] text-white hover:bg-[#E56F2C]'
                            : 'bg-[#FFD5BF] text-white cursor-not-allowed'
                    )}
                    aria-label="Enviar"
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
                Selecciona un contacto para ver la conversación.
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
    const { addContact, loadContacts } = useContactStore();
    const profile = useProfileStore(s => s.profile);
    const chatStore = useChatStore();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showAddContact, setShowAddContact] = useState(false);

    // Carga inicial de contactos
    useEffect(() => {
        if (profile?.id) {
            loadContacts(profile.id);
        }
    }, [profile?.id, loadContacts]);

    async function handleAddContact(data: Omit<Contact, 'id'>) {
        if (!profile?.id) return;
        await addContact(data, profile.id);
        setShowAddContact(false);
    }

    // On mobile: hide list when contact selected. On md+: show both side-by-side.
    const showThread = !!selectedContact;

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Contact List — full width on mobile, fixed 320px column on md+ */}
            <aside className={cn(
                'flex-shrink-0 w-full md:w-[320px] md:flex flex-col h-full',
                showThread ? 'hidden' : 'flex'
            )}>
                <ContactList
                    contacts={contacts}
                    isLoading={isLoadingContacts}
                    selectedId={selectedContact?.id ?? null}
                    entries={chatStore.messages}
                    onSelect={setSelectedContact}
                    onAdd={() => setShowAddContact(true)}
                />
            </aside>

            {/* Thread Panel */}
            <div className={cn(
                'flex-1 flex-col h-full',
                showThread ? 'flex' : 'hidden md:flex'
            )}>
                {selectedContact
                    ? <ThreadPanel contact={selectedContact} onBack={() => setSelectedContact(null)} />
                    : <NoChat />
                }
            </div>

            {/* Add Contact Modal */}
            {showAddContact && (
                <ContactForm
                    onSave={handleAddContact}
                    onCancel={() => setShowAddContact(false)}
                />
            )}
        </div>
    );
}
