'use client';

import { useState } from 'react';

interface UserRow {
  id: string;
  name: string;
  mode: string;
  messagesSent: number;
  usedAACBoard: boolean;
  usedTTS: boolean;
  contacts: number;
  groups: number;
  lastActive: string | null;
  daysActive: number;
}

type SortKey = keyof Omit<UserRow, 'id' | 'usedAACBoard' | 'usedTTS' | 'lastActive'>;

export function UserTable({ data }: { data: UserRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('messagesSent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  function ColHeader({ label, sortable }: { label: string; sortable?: SortKey }) {
    const active = sortable && sortKey === sortable;
    return (
      <th
        className={`px-3 py-2 text-left text-[10px] font-black uppercase tracking-wide text-gray-400 whitespace-nowrap ${sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
        onClick={() => sortable && handleSort(sortable)}
      >
        {label} {active ? (sortDir === 'desc' ? '↓' : '↑') : ''}
      </th>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100">
          <tr>
            <ColHeader label="Nombre" sortable="name" />
            <ColHeader label="Rol" sortable="mode" />
            <ColHeader label="Mensajes" sortable="messagesSent" />
            <ColHeader label="Features" />
            <ColHeader label="Contactos" sortable="contacts" />
            <ColHeader label="Grupos" sortable="groups" />
            <ColHeader label="Días activo" sortable="daysActive" />
            <ColHeader label="Última actividad" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2.5 font-semibold text-gray-800">{row.name}</td>
              <td className="px-3 py-2.5">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  row.mode === 'caregiver'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-orange-50 text-orange-700'
                }`}>
                  {row.mode === 'caregiver' ? 'Cuidador' : 'Comunicador'}
                </span>
              </td>
              <td className="px-3 py-2.5 font-bold text-gray-900 text-center">{row.messagesSent}</td>
              <td className="px-3 py-2.5">
                <div className="flex gap-1">
                  <span title="AACBoard" className={`text-xs px-1.5 py-0.5 rounded font-bold ${row.usedAACBoard ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-300'}`}>
                    AAC
                  </span>
                  <span title="TTS" className={`text-xs px-1.5 py-0.5 rounded font-bold ${row.usedTTS ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-300'}`}>
                    TTS
                  </span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-center text-gray-700">{row.contacts}</td>
              <td className="px-3 py-2.5 text-center text-gray-700">{row.groups}</td>
              <td className="px-3 py-2.5 text-center font-bold text-gray-900">{row.daysActive}</td>
              <td className="px-3 py-2.5 text-xs text-gray-400">
                {row.lastActive ? row.lastActive.slice(0, 10) : '—'}
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-400">
                Sin datos aún
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
