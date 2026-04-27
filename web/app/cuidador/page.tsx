'use client';

/**
 * /cuidador — Caregiver / Support Network Screen
 *
 * WhatsApp-style layout: unified conversation list on the left (contacts and
 * groups merged into one chronological feed), chat thread on the right.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Send, Volume2,
    Search, Plus, CheckCheck, Settings, UserRound, X, UsersRound,
    Trash2, LogOut, UserMinus, UserPlus, ChevronRight
} from 'lucide-react';
import AvatarUpload from '@/components/ui/AvatarUpload';

import { useContactStore, type Contact } from '@/lib/store/useContactStore';
import { useChatStore, type ChatMessage } from '@/lib/store/useChatStore';
import { useGroupStore, type Group, type MemberProfile } from '@/lib/store/useGroupStore';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { getSupabase } from '@/lib/supabase/client';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { textToPictos } from '@/lib/ai/picto-nlp';
import { useSpeech } from '@/lib/hooks/useSpeech';
import { cn } from '@/lib/utils';
import { ContactForm } from '@/components/ContactForm';

const BRAND        = '#FF8844';
const BRAND_DARK   = '#C85F27';
const BRAND_BORDER = '#FFD5BF';
const GROUP_COLOR  = '#4B6BC8';
const GROUP_BG     = '#E0E8FF';

// =============================================================================
// Selection type
// =============================================================================

type Selection =
    | { kind: 'contact'; contact: Contact }
    | { kind: 'group';   group: Group }
    | null;

// Unified item for the merged, sorted conversation list
type ConversationItem =
    | { kind: 'contact'; contact: Contact;  lastTs: string }
    | { kind: 'group';   group: Group;      lastTs: string };

// =============================================================================
// Helpers
// =============================================================================

function timeLabel(ts: string) {
    const d   = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
        ? d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('es', { month: 'short', day: 'numeric' });
}

// =============================================================================
// Avatar — individual contacts (orange)
// =============================================================================

function Avatar({ contact, size = 'md' }: { contact: Contact; size?: 'sm' | 'md' | 'lg' }) {
    const px = size === 'sm' ? 36 : size === 'md' ? 48 : 64;
    if (contact.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={contact.avatarUrl} alt={contact.name}
                className="rounded-full object-cover flex-shrink-0 select-none"
                style={{ width: px, height: px }} />
        );
    }
    return (
        <div className="rounded-full flex items-center justify-center flex-shrink-0 select-none bg-[#FFE6D6]"
            style={{ width: px, height: px, fontSize: px * 0.38 }}>
            <span className="font-black text-[#C85F27]">{contact.name.charAt(0).toUpperCase()}</span>
        </div>
    );
}

// =============================================================================
// GroupCollageAvatar — auto-generated collage from member photos
//
// Layouts by member count:
//   0    → group initial on blue background
//   1    → single full avatar
//   2    → vertical split (left | right)
//   3    → 2 top (50/50) + 1 bottom (100%)
//   4+   → 2×2 grid (max 4 shown)
// =============================================================================

/** Renders one cell of the collage — fills its parent 100% × 100%. */
function CollageCell({ profile }: { profile: MemberProfile }) {
    if (profile.avatar_url) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={profile.avatar_url}
                alt={profile.display_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
        );
    }
    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: GROUP_BG,
        }}>
            <span style={{ fontWeight: 900, color: GROUP_COLOR, fontSize: 10, lineHeight: 1 }}>
                {profile.display_name.charAt(0).toUpperCase()}
            </span>
        </div>
    );
}

function GroupCollageAvatar({
    memberProfiles,
    name,
    size = 'md',
}: {
    memberProfiles: MemberProfile[];
    name: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const px   = size === 'sm' ? 36 : size === 'md' ? 48 : 64;
    const shown = memberProfiles.slice(0, 4);
    const n    = shown.length;

    const base: React.CSSProperties = {
        width: px, height: px,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        userSelect: 'none',
    };

    // ── 0 members → group initial ────────────────────────────────────────────
    if (n === 0) {
        return (
            <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: GROUP_BG }}>
                <span style={{ fontWeight: 900, color: GROUP_COLOR, fontSize: px * 0.38 }}>
                    {name.charAt(0).toUpperCase()}
                </span>
            </div>
        );
    }

    // ── 1 member → full single avatar ───────────────────────────────────────
    if (n === 1) {
        if (shown[0].avatar_url) {
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={shown[0].avatar_url}
                    alt={shown[0].display_name}
                    className="object-cover flex-shrink-0 select-none"
                    style={{ ...base }}
                />
            );
        }
        return (
            <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: GROUP_BG }}>
                <span style={{ fontWeight: 900, color: GROUP_COLOR, fontSize: px * 0.38 }}>
                    {shown[0].display_name.charAt(0).toUpperCase()}
                </span>
            </div>
        );
    }

    // ── 2 members → vertical split ───────────────────────────────────────────
    if (n === 2) {
        return (
            <div style={{ ...base, display: 'flex', gap: 1 }}>
                <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
                    <CollageCell profile={shown[0]} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
                    <CollageCell profile={shown[1]} />
                </div>
            </div>
        );
    }

    // ── 3 members → 2 top + 1 bottom (full-width) ────────────────────────────
    if (n === 3) {
        return (
            <div style={{
                ...base,
                display: 'grid',
                gridTemplateAreas: '"a b" "c c"',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 1,
            }}>
                <div style={{ gridArea: 'a', overflow: 'hidden' }}><CollageCell profile={shown[0]} /></div>
                <div style={{ gridArea: 'b', overflow: 'hidden' }}><CollageCell profile={shown[1]} /></div>
                <div style={{ gridArea: 'c', overflow: 'hidden' }}><CollageCell profile={shown[2]} /></div>
            </div>
        );
    }

    // ── 4+ members → 2×2 grid ───────────────────────────────────────────────
    return (
        <div style={{
            ...base,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 1,
        }}>
            {shown.map(p => (
                <div key={p.id} style={{ overflow: 'hidden' }}>
                    <CollageCell profile={p} />
                </div>
            ))}
        </div>
    );
}

// =============================================================================
// Unified left panel — contacts + groups in one chronological list
// =============================================================================

function UnifiedList({
    contacts,
    groups,
    isLoadingContacts,
    selectedId,
    selectedGroupId,
    onSelectContact,
    onSelectGroup,
    onAddContact,
    onCreateGroup,
}: {
    contacts: Contact[];
    groups: Group[];
    isLoadingContacts: boolean;
    selectedId: string | null;
    selectedGroupId: string | null;
    onSelectContact: (c: Contact) => void;
    onSelectGroup:   (g: Group)   => void;
    onAddContact: () => void;
    onCreateGroup: () => void;
}) {
    const [query, setQuery] = useState('');
    const profileId         = useProfileStore(s => s.profile?.id);
    const summary           = useChatStore(s => s.summary);
    const groupSummary      = useGroupStore(s => s.groupSummary);

    // Filter by search query
    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
    );
    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(query.toLowerCase())
    );

    // Merge contacts + groups into one list, sorted by most-recent message (desc).
    // Items with no messages use '' as timestamp → sorted to the end.
    const conversationItems = useMemo<ConversationItem[]>(() => {
        const items: ConversationItem[] = [
            ...filteredContacts.map(contact => ({
                kind: 'contact' as const,
                contact,
                lastTs: summary[contact.contact_id]?.lastMessage?.created_at ?? '',
            })),
            ...filteredGroups.map(group => ({
                kind: 'group' as const,
                group,
                // Fall back to group creation time so brand-new groups float up
                lastTs: groupSummary[group.id]?.created_at ?? group.createdAt,
            })),
        ];

        return items.sort((a, b) => {
            if (!a.lastTs && !b.lastTs) return 0;
            if (!a.lastTs) return 1;
            if (!b.lastTs) return -1;
            return b.lastTs.localeCompare(a.lastTs); // newest first
        });
    }, [filteredContacts, filteredGroups, summary, groupSummary]);

    const hasContent = conversationItems.length > 0;

    return (
        <div className="flex flex-col h-full bg-white border-r border-[#FFE2D0]">

            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex-shrink-0 px-4 pt-5 pb-3 bg-[#FFF8F3] border-b border-[#FFD5BF]">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-black text-[#C85F27]">Mensajes</h1>

                    <div className="flex items-center gap-0.5">
                        <button
                            onClick={onCreateGroup}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-[#C85F27] hover:bg-[#FFE6D6] transition-colors"
                            title="Crear grupo"
                        >
                            <UsersRound size={19} />
                        </button>
                        <button
                            onClick={onAddContact}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-[#C85F27] hover:bg-[#FFE6D6] transition-colors"
                            title="Añadir contacto"
                        >
                            <Plus size={19} />
                        </button>
                        <Link
                            href="/cuidador/settings"
                            className="w-9 h-9 flex items-center justify-center rounded-full text-[#C85F27] hover:bg-[#FFE6D6] transition-colors"
                            title="Ajustes"
                        >
                            <Settings size={19} />
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-[#FFD5BF] rounded-2xl px-3 py-2">
                    <Search size={15} className="text-[#C85F27] flex-shrink-0" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar…"
                        className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* ── Conversation list ──────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#FFF0E8]">

                {isLoadingContacts && contacts.length === 0 && groups.length === 0 ? (
                    /* Loading skeleton */
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
                ) : !hasContent ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
                        <UserRound size={48} className="opacity-20" />
                        <p className="text-sm font-semibold">No hay conversaciones aún</p>
                        <button onClick={onAddContact} className="text-sm font-bold text-[#FF8844] underline">
                            Añadir el primero
                        </button>
                    </div>
                ) : (
                    /* Unified chronological list — no section headers or dividers */
                    conversationItems.map(item => {

                        // ── Contact row ───────────────────────────────────────
                        if (item.kind === 'contact') {
                            const { contact } = item;
                            const s        = summary[contact.contact_id];
                            const lastMsg  = s?.lastMessage;
                            const count    = s?.unreadCount ?? 0;
                            const isActive = selectedId === contact.id;

                            let preview = '';
                            if (lastMsg) {
                                const mine = lastMsg.sender_id === profileId;
                                const body = lastMsg.content || lastMsg.pictograms?.map(p => p.label).join(' ') || '';
                                preview = (mine ? '→ ' : '← ') + body;
                            }

                            return (
                                <button
                                    key={`c-${contact.id}`}
                                    onClick={() => onSelectContact(contact)}
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
                                                {preview || <span className="italic">Sin mensajes</span>}
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
                        }

                        // ── Group row ─────────────────────────────────────────
                        const { group } = item;
                        const lastMsg  = groupSummary[group.id];
                        const isActive = selectedGroupId === group.id;

                        return (
                            <button
                                key={`g-${group.id}`}
                                onClick={() => onSelectGroup(group)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                                    isActive ? 'bg-[#FFF0E8]' : 'hover:bg-[#FFFAF7]'
                                )}
                            >
                                <GroupCollageAvatar
                                    memberProfiles={group.memberProfiles}
                                    name={group.name}
                                    size="md"
                                />
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
                                            ? `${lastMsg.sender_name}: ${lastMsg.content || (lastMsg.pictograms?.length ? `${lastMsg.pictograms.length} pictograma(s)` : '')}`
                                            : <span className="italic">Grupo nuevo</span>
                                        }
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// =============================================================================
// Group Settings Modal — edit name, description, avatar, members
// =============================================================================

function GroupSettingsModal({
    group,
    currentUserId,
    onClose,
    onGroupUpdated,
}: {
    group: Group;
    currentUserId: string;
    onClose: () => void;
    /** 'updated' | 'left' | 'deleted' — parent reloads groups and handles nav */
    onGroupUpdated: (action: 'updated' | 'left' | 'deleted') => void;
}) {
    const isCreator = group.createdBy === currentUserId;

    // ── Editable state (creator only) ────────────────────────────────────────
    const [name,        setName]        = useState(group.name);
    const [description, setDescription] = useState(group.description ?? '');
    const [avatarUrl,   setAvatarUrl]   = useState<string | null>(group.avatarUrl);

    // Members shown in the list = current memberProfiles minus locally removed ones
    const [removedIds,  setRemovedIds]  = useState<string[]>([]);
    const visibleMembers = group.memberProfiles.filter(m => !removedIds.includes(m.id));

    // Add members by email
    const [addEmails,   setAddEmails]   = useState<string[]>(['']);

    const [isSaving,   setIsSaving]    = useState(false);
    const [isLeaving,  setIsLeaving]   = useState(false);
    const [isDeleting, setIsDeleting]  = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error,      setError]       = useState('');

    // ── Save (creator) ────────────────────────────────────────────────────────
    async function handleSave() {
        if (!name.trim()) { setError('El nombre del grupo es requerido'); return; }
        setIsSaving(true); setError('');
        try {
            const sb = getSupabase();

            // Resolve new email addresses → UUIDs
            const addIds: string[] = [];
            for (const email of addEmails) {
                const trimmed = email.trim().toLowerCase();
                if (!trimmed) continue;
                const { data: uid } = await (sb as any)
                    .rpc('get_user_id_by_email', { lookup_email: trimmed });
                if (uid && uid !== currentUserId) addIds.push(uid as string);
            }

            const { error: rpcErr } = await (sb as any)
                .rpc('update_group_with_members', {
                    p_group_id:    group.id,
                    p_name:        name.trim(),
                    p_description: description.trim() || null,
                    p_avatar_url:  avatarUrl,
                    p_add_ids:     addIds,
                    p_remove_ids:  removedIds,
                });

            if (rpcErr) { setError(rpcErr.message); return; }

            // Destroy the old avatar in Cloudinary if it was replaced or removed.
            // Fire-and-forget — storage leak is acceptable vs blocking the UI.
            if (group.avatarUrl && group.avatarUrl !== avatarUrl) {
                deleteFromCloudinary(group.avatarUrl).catch(() => {});
            }

            onGroupUpdated('updated');
        } catch (e: any) {
            setError(e?.message ?? 'Error al guardar');
        } finally {
            setIsSaving(false);
        }
    }

    // ── Leave (non-creator) ───────────────────────────────────────────────────
    async function handleLeave() {
        setIsLeaving(true); setError('');
        try {
            const { error: rpcErr } = await (getSupabase() as any)
                .rpc('leave_group', { p_group_id: group.id });
            if (rpcErr) { setError(rpcErr.message); return; }
            onGroupUpdated('left');
        } catch (e: any) {
            setError(e?.message ?? 'Error al salir del grupo');
        } finally {
            setIsLeaving(false);
        }
    }

    // ── Delete (creator) ──────────────────────────────────────────────────────
    async function handleDelete() {
        setIsDeleting(true); setError('');
        try {
            const { error: rpcErr } = await (getSupabase() as any)
                .rpc('delete_group', { p_group_id: group.id });
            if (rpcErr) { setError(rpcErr.message); return; }

            // Destroy the group avatar from Cloudinary now that the group is gone.
            if (group.avatarUrl) {
                deleteFromCloudinary(group.avatarUrl).catch(() => {});
            }

            onGroupUpdated('deleted');
        } catch (e: any) {
            setError(e?.message ?? 'Error al eliminar el grupo');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-[440px] flex flex-col shadow-2xl my-auto">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#FFE2D0]">
                    <h2 className="text-xl font-black text-[#C85F27]">
                        {isCreator ? 'Editar grupo' : 'Info del grupo'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto max-h-[70vh]">

                    {/* ── Avatar ─────────────────────────────────────────── */}
                    <div className="flex flex-col items-center gap-2">
                        {isCreator ? (
                            <>
                                <AvatarUpload
                                    currentUrl={avatarUrl}
                                    displayName={name}
                                    onUpload={setAvatarUrl}
                                    size={88}
                                />
                                {avatarUrl && (
                                    <button
                                        onClick={() => setAvatarUrl(null)}
                                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        Quitar foto
                                    </button>
                                )}
                            </>
                        ) : (
                            <GroupCollageAvatar
                                memberProfiles={group.memberProfiles}
                                name={group.name}
                                size="lg"
                            />
                        )}
                    </div>

                    {/* ── Name ───────────────────────────────────────────── */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Nombre del grupo</label>
                        {isCreator ? (
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="h-11 border border-[#FFD5BF] rounded-xl px-4 text-sm outline-none focus:border-[#FF8844]"
                                placeholder="Nombre del grupo"
                            />
                        ) : (
                            <p className="text-sm text-gray-800 px-1">{group.name}</p>
                        )}
                    </div>

                    {/* ── Description ────────────────────────────────────── */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Descripción</label>
                        {isCreator ? (
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={2}
                                maxLength={200}
                                placeholder="Ej: Familia, equipo de trabajo…"
                                className="border border-[#FFD5BF] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF8844] resize-none"
                            />
                        ) : (
                            <p className="text-sm text-gray-500 px-1 italic">
                                {group.description || 'Sin descripción'}
                            </p>
                        )}
                    </div>

                    {/* ── Members list ───────────────────────────────────── */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-700">
                                Miembros ({visibleMembers.length})
                            </label>
                        </div>

                        <div className="flex flex-col gap-1 rounded-2xl border border-[#FFE2D0] overflow-hidden">
                            {group.memberProfiles.length === 0 ? (
                                <p className="text-xs text-gray-400 italic px-4 py-3">
                                    Sin información de miembros
                                </p>
                            ) : visibleMembers.map(member => {
                                const isYou    = member.id === currentUserId;
                                const isOwner  = member.id === group.createdBy;
                                const removed  = removedIds.includes(member.id);
                                if (removed) return null;

                                return (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-[#FFFAF7]"
                                    >
                                        {/* Mini avatar */}
                                        {member.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={member.avatar_url}
                                                alt={member.display_name}
                                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFE6D6]">
                                                <span className="text-xs font-black text-[#C85F27]">
                                                    {member.display_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {member.display_name}
                                                {isYou && <span className="text-gray-400 font-normal"> (tú)</span>}
                                            </p>
                                            {isOwner && (
                                                <p className="text-[10px] text-[#C85F27] font-bold">Administrador</p>
                                            )}
                                        </div>

                                        {/* Remove button (creator only, not self) */}
                                        {isCreator && !isYou && (
                                            <button
                                                onClick={() => setRemovedIds(prev => [...prev, member.id])}
                                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                                                title="Quitar del grupo"
                                            >
                                                <UserMinus size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Removed members preview */}
                            {removedIds.map(id => {
                                const m = group.memberProfiles.find(p => p.id === id);
                                if (!m) return null;
                                return (
                                    <div key={id}
                                        className="flex items-center gap-3 px-4 py-2.5 bg-red-50 opacity-60"
                                    >
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
                                            <span className="text-xs font-black text-red-400">
                                                {m.display_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="flex-1 text-sm font-semibold text-red-400 line-through truncate">
                                            {m.display_name}
                                        </p>
                                        <button
                                            onClick={() => setRemovedIds(prev => prev.filter(x => x !== id))}
                                            className="text-xs text-gray-400 hover:text-gray-600"
                                        >
                                            Deshacer
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Add members (creator only) ──────────────────────── */}
                    {isCreator && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                <UserPlus size={14} className="text-[#C85F27]" />
                                Agregar miembros
                            </label>
                            {addEmails.map((email, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        value={email}
                                        onChange={e => {
                                            const n = [...addEmails]; n[i] = e.target.value; setAddEmails(n);
                                        }}
                                        placeholder="correo@ejemplo.com"
                                        type="email"
                                        className="flex-1 h-10 border border-[#FFD5BF] rounded-xl px-3 text-sm outline-none focus:border-[#FF8844]"
                                    />
                                    {addEmails.length > 1 && (
                                        <button
                                            onClick={() => setAddEmails(addEmails.filter((_, j) => j !== i))}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => setAddEmails([...addEmails, ''])}
                                className="text-sm font-bold self-start hover:underline text-[#4B6BC8]"
                            >
                                + Añadir otro correo
                            </button>
                        </div>
                    )}

                    {/* ── Error ──────────────────────────────────────────── */}
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl font-medium">
                            {error}
                        </p>
                    )}

                    {/* ── Delete confirm ──────────────────────────────────── */}
                    {confirmDelete && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col gap-3">
                            <p className="text-sm font-semibold text-red-700 text-center">
                                ¿Eliminar el grupo <strong>{group.name}</strong>?<br />
                                <span className="font-normal">Esta acción no se puede deshacer. Se perderán todos los mensajes.</span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1 h-9 rounded-xl border border-red-200 text-sm font-bold text-red-400 hover:bg-red-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 h-9 rounded-xl bg-red-500 text-white text-sm font-bold disabled:opacity-50"
                                >
                                    {isDeleting ? 'Eliminando…' : 'Sí, eliminar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer actions ──────────────────────────────────────── */}
                <div className="px-6 pb-6 pt-2 flex flex-col gap-2 border-t border-[#FFE2D0]">
                    {isCreator ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !name.trim()}
                                className="w-full h-11 rounded-2xl text-white text-sm font-black active:scale-95 disabled:opacity-50 transition-transform"
                                style={{ backgroundColor: BRAND }}
                            >
                                {isSaving ? 'Guardando…' : 'Guardar cambios'}
                            </button>
                            {!confirmDelete && (
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="w-full h-10 rounded-2xl text-red-400 text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Eliminar grupo
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={handleLeave}
                            disabled={isLeaving}
                            className="w-full h-11 rounded-2xl text-red-500 border border-red-200 text-sm font-black flex items-center justify-center gap-2 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                            <LogOut size={15} />
                            {isLeaving ? 'Saliendo…' : 'Salir del grupo'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Group Create Modal
// =============================================================================

function GroupCreateModal({ onSave, onCancel }: { onSave: (g: Group) => void; onCancel: () => void }) {
    const [name,       setName]       = useState('');
    const [emails,     setEmails]     = useState(['']);
    const [isCreating, setIsCreating] = useState(false);
    const [error,      setError]      = useState('');
    const profile          = useProfileStore(s => s.profile);
    const loadGroups       = useGroupStore(s => s.loadGroups);
    const loadGroupSummary = useGroupStore(s => s.loadGroupSummary);

    async function handleCreate() {
        if (!name.trim()) { setError('El nombre del grupo es requerido'); return; }
        setIsCreating(true); setError('');
        try {
            const sb = getSupabase();

            // ── Resolve email addresses → user IDs ──────────────────────────
            const resolvedIds: string[] = [];
            for (const email of emails) {
                const trimmed = email.trim().toLowerCase();
                if (!trimmed) continue;
                const { data: uid, error: rpcErr } = await (sb as any)
                    .rpc('get_user_id_by_email', { lookup_email: trimmed });
                if (!rpcErr && uid && uid !== profile?.id) resolvedIds.push(uid as string);
            }

            // ── Create group + members via SECURITY DEFINER function ─────────
            const { data: group, error: createErr } = await (sb as any)
                .rpc('create_group_with_members', {
                    p_name:       name.trim(),
                    p_member_ids: resolvedIds,
                });

            if (createErr || !group) {
                setError(createErr?.message ?? 'Error al crear el grupo');
                return;
            }

            // Reload groups so the new group gets proper memberProfiles
            if (profile?.id) await Promise.all([loadGroups(profile.id), loadGroupSummary(profile.id)]);

            onSave({
                id: group.id,
                name: group.name,
                avatarUrl: group.avatar_url ?? null,
                createdBy: group.created_by,
                createdAt: group.created_at,
                memberIds: [],
                memberProfiles: [], // populated after loadGroups finishes
            });
        } finally { setIsCreating(false); }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-[420px] flex flex-col gap-5 shadow-2xl">
                <h2 className="text-xl font-black text-[#C85F27]">Crear grupo</h2>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700">Nombre del grupo</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Familia García" autoFocus
                        className="h-11 border border-[#FFD5BF] rounded-xl px-4 text-sm outline-none focus:border-[#FF8844]" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Miembros <span className="text-gray-400 font-normal">(correo electrónico)</span></label>
                    {emails.map((email, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input value={email} onChange={e => { const n = [...emails]; n[i] = e.target.value; setEmails(n); }}
                                placeholder="correo@ejemplo.com" type="email"
                                className="flex-1 h-10 border border-[#FFD5BF] rounded-xl px-3 text-sm outline-none focus:border-[#FF8844]" />
                            {emails.length > 1 && (
                                <button onClick={() => setEmails(emails.filter((_, j) => j !== i))}
                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-400">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button onClick={() => setEmails([...emails, ''])} className="text-sm font-bold self-start hover:underline" style={{ color: GROUP_COLOR }}>
                        + Añadir correo
                    </button>
                </div>

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-[#FFD5BF] text-sm font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
                    <button onClick={handleCreate} disabled={isCreating || !name.trim()}
                        className="flex-1 h-11 rounded-xl text-white text-sm font-bold active:scale-95 disabled:opacity-50"
                        style={{ backgroundColor: BRAND }}>
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
                {entry.pictograms && entry.pictograms.length > 0 && (
                    <div className={cn('flex flex-wrap gap-1 p-2 rounded-2xl border max-w-[280px]',
                        isSent ? 'bg-[#FFF0E8] border-[#FFD5BF] rounded-br-sm' : 'bg-white border-slate-200 rounded-bl-sm')}>
                        {entry.pictograms.map((p, i) => (
                            <div key={i} className="flex flex-col items-center gap-0.5">
                                <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl"
                                    style={{ borderColor: p.color ?? '#e2e8f0', backgroundColor: `${p.color ?? '#6b7280'}18` }}>
                                    {p.arasaacId
                                        // eslint-disable-next-line @next/next/no-img-element
                                        ? <img src={`https://static.arasaac.org/pictograms/${p.arasaacId}/${p.arasaacId}_300.png`} alt={p.label} className="w-10 h-10 object-contain" />
                                        : '🔲'}
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 text-center leading-none">{p.label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className={cn('flex items-center gap-2', isSent ? 'flex-row-reverse' : '')}>
                    <div className={cn('px-4 py-2.5 rounded-[1.25rem] text-sm font-medium leading-relaxed shadow-sm',
                        isSent ? 'bg-[#FF8844] text-white rounded-br-sm' : 'bg-white text-gray-800 border border-slate-200 rounded-bl-sm')}>
                        {entry.content}
                    </div>
                    <button onClick={() => speak(entry.content)}
                        className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                            isSpeaking ? 'bg-[#FF8844] text-white' : 'bg-slate-100 text-slate-500 hover:bg-[#FFF0E8] hover:text-[#FF8844]')}>
                        <Volume2 size={13} />
                    </button>
                </div>
                <div className={cn('flex items-center gap-1 px-1', isSent ? 'justify-end' : 'justify-start')}>
                    <span className="text-[10px] text-gray-400">{timeLabel(entry.created_at)}</span>
                    {isSent && <CheckCheck size={12} className="text-[#FF8844]" />}
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Thread Panel — P2P
// =============================================================================

function ThreadPanel({ contact, onBack }: { contact: Contact; onBack: () => void }) {
    const profile                 = useProfileStore(s => s.profile);
    const messages                = useChatStore(s => s.messages);
    const setCurrentContact       = useChatStore(s => s.setCurrentContact);
    const setContactName          = useChatStore(s => s.setContactName);
    const unsubscribeFromMessages = useChatStore(s => s.unsubscribeFromMessages);
    const sendMessage             = useChatStore(s => s.sendMessage);

    const [text, setText]               = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const bottomRef                     = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (profile?.id && contact.contact_id) {
            setContactName(contact.name);
            setCurrentContact(contact.contact_id, profile.id);
        }
        return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id, contact.contact_id]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

    const handleSend = useCallback(async () => {
        const t = text.trim();
        if (!t || !profile?.id || !contact.contact_id) return;
        setIsTranslating(true);
        try {
            const hfRes = await textToPictos(t);
            const pictos = hfRes.pictograms.map((p: any) => ({ id: p.id.toString(), label: p.labels?.es || '?', arasaacId: p.id, color: '#FFF0E8' }));
            await sendMessage(pictos, t, profile.id, contact.contact_id);
            setText('');
        } catch (e) { console.error('[Cuidador Send]', e); }
        finally { setIsTranslating(false); }
    }, [text, profile?.id, contact.contact_id, sendMessage]);

    return (
        <div className="flex flex-col h-full bg-[#F8F4F1]">
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#FFD5BF] shadow-sm">
                <button onClick={onBack} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF4ED] text-[#FF8844] border border-[#FFD5BF] hover:bg-[#FFE6D6]">
                    <ArrowLeft size={18} />
                </button>
                <Avatar contact={contact} size="sm" />
                <p className="flex-1 text-base font-black text-gray-900 truncate">{contact.name}</p>
                <span className="text-[10px] font-bold text-gray-400 italic hidden md:block">Los mensajes se traducen a pictogramas</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-gray-400 text-center">
                        <div className="text-5xl">💬</div>
                        <p className="text-sm font-semibold max-w-[200px]">Aún no hay mensajes con {contact.name}.</p>
                    </div>
                ) : messages.map(e => <Bubble key={e.id} entry={e} contact={contact} isSent={e.sender_id === profile?.id} />)}
                <div ref={bottomRef} />
            </div>

            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 bg-white border-t border-[#FFD5BF]">
                <input type="text" value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Escribe a ${contact.name}…`} disabled={isTranslating}
                    className="flex-1 h-11 bg-[#F8F4F1] border border-[#FFD5BF] rounded-2xl px-4 text-sm outline-none focus:border-[#FF8844] text-gray-800 placeholder:text-gray-400" />
                <button onClick={handleSend} disabled={!text.trim() || isTranslating}
                    className={cn('w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-md active:scale-95',
                        text.trim() && !isTranslating ? 'bg-[#FF8844] text-white' : 'bg-[#FFD5BF] text-white cursor-not-allowed')}>
                    <Send size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// Group Thread Panel
// =============================================================================

function GroupThreadPanel({ group, onBack, onOpenSettings }: { group: Group; onBack: () => void; onOpenSettings: () => void }) {
    const profile              = useProfileStore(s => s.profile);
    const groupMessages        = useGroupStore(s => s.groupMessages);
    const loadGroupMessages    = useGroupStore(s => s.loadGroupMessages);
    const sendGroupMessage     = useGroupStore(s => s.sendGroupMessage);
    const subscribeToGroup     = useGroupStore(s => s.subscribeToGroup);
    const unsubscribeFromGroup = useGroupStore(s => s.unsubscribeFromGroup);

    const [text, setText]               = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const bottomRef                     = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (profile?.id) { loadGroupMessages(group.id); subscribeToGroup(group.id, profile.id); }
        return () => unsubscribeFromGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.id, profile?.id]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [groupMessages.length]);

    const handleSend = useCallback(async () => {
        const t = text.trim();
        if (!t || !profile?.id) return;
        setIsTranslating(true);
        try {
            const hfRes = await textToPictos(t);
            const pictos = hfRes.pictograms.map((p: any) => ({ id: p.id.toString(), label: p.labels?.es || '?', arasaacId: p.id, color: '#FFF0E8' }));
            await sendGroupMessage(pictos, t, profile.id, profile.display_name ?? 'Yo', group.id);
            setText('');
        } catch (e) { console.error('[Group Send]', e); }
        finally { setIsTranslating(false); }
    }, [text, profile, group.id, sendGroupMessage]);

    return (
        <div className="flex flex-col h-full bg-[#F7F8FF]">
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#D0D8F0] shadow-sm">
                <button onClick={onBack} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-[#EEF1FF] hover:bg-[#E0E8FF]" style={{ color: GROUP_COLOR }}>
                    <ArrowLeft size={18} />
                </button>
                {/* Avatar + name — tappable to open settings */}
                <button
                    onClick={onOpenSettings}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                >
                    <GroupCollageAvatar memberProfiles={group.memberProfiles} name={group.name} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-black text-gray-900 truncate group-hover:text-[#C85F27] transition-colors">
                            {group.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {group.memberIds.length > 0
                                ? `${group.memberIds.length} miembro${group.memberIds.length !== 1 ? 's' : ''}`
                                : group.description || 'Grupo'}
                        </p>
                    </div>
                    <ChevronRight size={15} className="text-gray-300 group-hover:text-[#C85F27] flex-shrink-0 transition-colors" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {groupMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-gray-400 text-center">
                        <div className="text-5xl">💬</div>
                        <p className="text-sm font-semibold">Sin mensajes en este grupo.</p>
                    </div>
                ) : groupMessages.map(msg => {
                    const isSent = msg.sender_id === profile?.id;
                    return (
                        <div key={msg.id} className={cn('flex items-end gap-2 max-w-[80%]', isSent ? 'self-end flex-row-reverse' : 'self-start')}>
                            {!isSent && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                                    style={{ backgroundColor: GROUP_BG, color: GROUP_COLOR }}>
                                    {msg.sender_avatar
                                        // eslint-disable-next-line @next/next/no-img-element
                                        ? <img src={msg.sender_avatar} alt={msg.sender_name} className="w-8 h-8 rounded-full object-cover" />
                                        : msg.sender_name.charAt(0)
                                    }
                                </div>
                            )}
                            <div className="flex flex-col gap-0.5">
                                {!isSent && <span className="text-[10px] font-bold px-1" style={{ color: GROUP_COLOR }}>{msg.sender_name}</span>}
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
                })}
                <div ref={bottomRef} />
            </div>

            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 bg-white border-t border-[#D0D8F0]">
                <input type="text" value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Escribe al grupo…" disabled={isTranslating}
                    className="flex-1 h-11 bg-[#F7F8FF] border border-[#D0D8F0] rounded-2xl px-4 text-sm outline-none text-gray-800 placeholder:text-gray-400" />
                <button onClick={handleSend} disabled={!text.trim() || isTranslating}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: text.trim() && !isTranslating ? GROUP_COLOR : '#A0AED8', color: 'white' }}>
                    <Send size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// Empty State
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
    const contacts          = useContactStore(s => s.contacts);
    const isLoadingContacts = useContactStore(s => s.isLoading);
    const { addContact, loadContacts, subscribeToContacts, unsubscribeFromContacts } = useContactStore();

    const groups = useGroupStore(s => s.groups);
    const { loadGroups, loadGroupSummary } = useGroupStore();

    const profile     = useProfileStore(s => s.profile);
    const loadSummary = useChatStore(s => s.loadSummary);

    const [selected,          setSelected]          = useState<Selection>(null);
    const [showAddContact,    setShowAddContact]    = useState(false);
    const [showCreateGroup,   setShowCreateGroup]   = useState(false);
    const [showGroupSettings, setShowGroupSettings] = useState(false);

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
        setSelected({ kind: 'group', group });
    }

    function handleGroupUpdated(action: 'updated' | 'left' | 'deleted') {
        setShowGroupSettings(false);
        if (profile?.id) {
            loadGroups(profile.id);
            loadGroupSummary(profile.id);
        }
        if (action === 'left' || action === 'deleted') {
            setSelected(null);
        }
    }

    const showThread      = !!selected;
    const selectedId      = selected?.kind === 'contact' ? selected.contact.id : null;
    const selectedGroupId = selected?.kind === 'group'   ? selected.group.id   : null;

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left panel */}
            <aside className={cn(
                'flex-shrink-0 w-full md:w-[320px] md:flex flex-col h-full',
                showThread ? 'hidden' : 'flex'
            )}>
                <UnifiedList
                    contacts={contacts}
                    groups={groups}
                    isLoadingContacts={isLoadingContacts}
                    selectedId={selectedId}
                    selectedGroupId={selectedGroupId}
                    onSelectContact={c => setSelected({ kind: 'contact', contact: c })}
                    onSelectGroup={g => setSelected({ kind: 'group', group: g })}
                    onAddContact={() => setShowAddContact(true)}
                    onCreateGroup={() => setShowCreateGroup(true)}
                />
            </aside>

            {/* Right panel */}
            <div className={cn('flex-1 flex-col h-full', showThread ? 'flex' : 'hidden md:flex')}>
                {selected?.kind === 'contact' ? (
                    <ThreadPanel contact={selected.contact} onBack={() => setSelected(null)} />
                ) : selected?.kind === 'group' ? (
                    <GroupThreadPanel
                        group={groups.find(g => g.id === selected.group.id) ?? selected.group}
                        onBack={() => setSelected(null)}
                        onOpenSettings={() => setShowGroupSettings(true)}
                    />
                ) : (
                    <NoChat />
                )}
            </div>

            {showAddContact && (
                <ContactForm onSave={handleAddContact} onCancel={() => setShowAddContact(false)} />
            )}
            {showCreateGroup && (
                <GroupCreateModal onSave={handleGroupCreated} onCancel={() => setShowCreateGroup(false)} />
            )}

            {showGroupSettings && selected?.kind === 'group' && profile?.id && (
                <GroupSettingsModal
                    group={groups.find(g => g.id === selected.group.id) ?? selected.group}
                    currentUserId={profile.id}
                    onClose={() => setShowGroupSettings(false)}
                    onGroupUpdated={handleGroupUpdated}
                />
            )}
        </div>
    );
}
