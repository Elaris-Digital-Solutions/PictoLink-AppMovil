import { createAdminClient } from '@/lib/supabase/admin';
import { FreemiumSlider } from './FreemiumSlider';
import { UserTable } from './UserTable';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AnalyticsEvent {
  user_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface MessageRow {
  sender_id: string;
  pictograms: unknown[];
  created_at: string;
}

interface ProfileRow {
  id: string;
  display_name: string;
  mode: string;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countByUser(rows: { user_id?: string; sender_id?: string }[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const id = row.user_id ?? row.sender_id ?? '';
    map.set(id, (map.get(id) ?? 0) + 1);
  }
  return map;
}

function toDateStr(iso: string) {
  return iso.slice(0, 10);
}

function fmtDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MetricsPage() {
  const supabase = createAdminClient();

  const [
    { data: profiles = [] },
    { data: messages = [] },
    { data: groupMessages = [] },
    { data: events = [] },
    { data: contacts = [] },
    { data: groupMembers = [] },
  ] = await Promise.all([
    supabase.from('profiles').select('id, display_name, mode, created_at'),
    supabase.from('messages').select('sender_id, pictograms, created_at'),
    supabase.from('group_messages').select('sender_id, created_at'),
    supabase.from('analytics_events').select('user_id, event_type, metadata, created_at'),
    supabase.from('contacts').select('user_id'),
    supabase.from('group_members').select('user_id, group_id'),
  ]);

  // ── Active users ──────────────────────────────────────────────────────────
  const activeIds = new Set([
    ...(messages as MessageRow[]).map((m) => m.sender_id),
    ...(groupMessages as { sender_id: string }[]).map((m) => m.sender_id),
    ...(events as AnalyticsEvent[]).map((e) => e.user_id),
  ]);

  const activeProfiles = (profiles as ProfileRow[]).filter((p) => activeIds.has(p.id));
  const totalActive = activeProfiles.length;
  const caregiverCount = activeProfiles.filter((p) => p.mode === 'caregiver').length;
  const communicatorCount = activeProfiles.filter((p) => p.mode === 'communicator').length;

  // ── Message totals ────────────────────────────────────────────────────────
  const msgList = messages as MessageRow[];
  const pictogramMessages = msgList.filter(
    (m) => Array.isArray(m.pictograms) && m.pictograms.length > 0
  ).length;
  const textMessages = msgList.length - pictogramMessages;
  const groupMsgCount = (groupMessages ?? []).length;

  // ── Avg session duration ──────────────────────────────────────────────────
  const sessionEnds = (events as AnalyticsEvent[]).filter(
    (e) => e.event_type === 'session_end' && typeof e.metadata?.duration_s === 'number'
  );
  const avgDurationSec =
    sessionEnds.length > 0
      ? Math.round(
          sessionEnds.reduce((s, e) => s + (e.metadata.duration_s as number), 0) /
            sessionEnds.length
        )
      : 0;

  // ── Daily active users (last 30 days) ─────────────────────────────────────
  const dailyUsers = new Map<string, Set<string>>();
  for (const m of msgList) {
    const d = toDateStr(m.created_at);
    if (!dailyUsers.has(d)) dailyUsers.set(d, new Set());
    dailyUsers.get(d)!.add(m.sender_id);
  }
  for (const m of groupMessages as { sender_id: string; created_at: string }[]) {
    const d = toDateStr(m.created_at);
    if (!dailyUsers.has(d)) dailyUsers.set(d, new Set());
    dailyUsers.get(d)!.add(m.sender_id);
  }
  for (const e of events as AnalyticsEvent[]) {
    const d = toDateStr(e.created_at);
    if (!dailyUsers.has(d)) dailyUsers.set(d, new Set());
    dailyUsers.get(d)!.add(e.user_id);
  }
  const dailyChartData = [...dailyUsers.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, users]) => ({ date, count: users.size }));
  const maxDailyCount = Math.max(...dailyChartData.map((d) => d.count), 1);

  // ── Feature usage ─────────────────────────────────────────────────────────
  const eventsByType = new Map<string, Set<string>>();
  for (const e of events as AnalyticsEvent[]) {
    if (!eventsByType.has(e.event_type)) eventsByType.set(e.event_type, new Set());
    eventsByType.get(e.event_type)!.add(e.user_id);
  }

  const aacboardUsers = eventsByType.get('aacboard_opened')?.size ?? 0;
  const ttsUsers = eventsByType.get('voice_tts_used')?.size ?? 0;
  const pictoMsgUsers = new Set(
    msgList.filter((m) => Array.isArray(m.pictograms) && m.pictograms.length > 0).map((m) => m.sender_id)
  ).size;
  const groupUsers = new Set((groupMembers as { user_id: string }[]).map((m) => m.user_id)).size;

  const featureRows = [
    { label: 'AACBoard (tablero pictogramas)', users: aacboardUsers },
    { label: 'Síntesis de voz (TTS)', users: ttsUsers },
    { label: 'Mensajes con pictogramas', users: pictoMsgUsers },
    { label: 'Grupos de conversación', users: groupUsers },
  ];

  // ── Freemium distributions (for slider) ──────────────────────────────────
  const contactsPerUser = countByUser(contacts as { user_id: string }[]);
  const groupsPerUser = countByUser(groupMembers as { user_id: string }[]);

  const contactDist = (profiles as ProfileRow[]).map((p) => ({
    userId: p.id,
    count: contactsPerUser.get(p.id) ?? 0,
  }));

  const groupDist = (profiles as ProfileRow[]).map((p) => ({
    userId: p.id,
    count: groupsPerUser.get(p.id) ?? 0,
  }));

  // ── User table data ───────────────────────────────────────────────────────
  const msgCountByUser = countByUser(msgList.map((m) => ({ user_id: m.sender_id })));
  const groupMsgCountByUser = countByUser(
    (groupMessages as { sender_id: string }[]).map((m) => ({ user_id: m.sender_id }))
  );

  const lastActivityByUser = new Map<string, string>();
  for (const m of msgList) {
    const prev = lastActivityByUser.get(m.sender_id);
    if (!prev || m.created_at > prev) lastActivityByUser.set(m.sender_id, m.created_at);
  }
  for (const e of events as AnalyticsEvent[]) {
    const prev = lastActivityByUser.get(e.user_id);
    if (!prev || e.created_at > prev) lastActivityByUser.set(e.user_id, e.created_at);
  }

  const daysActiveByUser = new Map<string, Set<string>>();
  for (const [date, users] of dailyUsers) {
    for (const uid of users) {
      if (!daysActiveByUser.has(uid)) daysActiveByUser.set(uid, new Set());
      daysActiveByUser.get(uid)!.add(date);
    }
  }

  const tableData = (profiles as ProfileRow[]).map((p) => ({
    id: p.id,
    name: p.display_name || '(sin nombre)',
    mode: p.mode,
    messagesSent: (msgCountByUser.get(p.id) ?? 0) + (groupMsgCountByUser.get(p.id) ?? 0),
    usedAACBoard: eventsByType.get('aacboard_opened')?.has(p.id) ?? false,
    usedTTS: eventsByType.get('voice_tts_used')?.has(p.id) ?? false,
    contacts: contactsPerUser.get(p.id) ?? 0,
    groups: groupsPerUser.get(p.id) ?? 0,
    lastActive: lastActivityByUser.get(p.id) ?? null,
    daysActive: daysActiveByUser.get(p.id)?.size ?? 0,
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Panel de Métricas</h1>
      <p className="text-sm text-gray-500 mb-8">Piloto — datos en tiempo real</p>

      {/* ── Bloque 1: Overview ─────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Resumen general</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Usuarios activos', value: totalActive },
            { label: 'Cuidadores', value: caregiverCount },
            { label: 'Comunicadores', value: communicatorCount },
            { label: 'Duración sesión (prom.)', value: fmtDuration(avgDurationSec) },
            { label: 'Mensajes texto', value: textMessages },
            { label: 'Mensajes pictograma', value: pictogramMessages },
            { label: 'Mensajes grupales', value: groupMsgCount },
            { label: 'Sesiones registradas', value: sessionEnds.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
              <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bloque 2: DAU chart ────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Usuarios activos por día</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          {dailyChartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos aún</p>
          ) : (
            <div className="space-y-1.5">
              {dailyChartData.map(({ date, count }) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-24 shrink-0">{date.slice(5)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(count / maxDailyCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bloque 3: Feature usage ────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Uso de features</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="space-y-3">
            {featureRows.map(({ label, users }) => {
              const pct = totalActive > 0 ? Math.round((users / totalActive) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-black text-gray-900">{users} usuarios ({pct}%)</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bloque 4: FreemiumSlider ───────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Simulador de límites freemium</h2>
        <FreemiumSlider
          contactDist={contactDist}
          groupDist={groupDist}
          totalUsers={(profiles as ProfileRow[]).length}
        />
      </section>

      {/* ── Bloque 5: UserTable ────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Detalle por usuario</h2>
        <UserTable data={tableData} />
      </section>
    </div>
  );
}
