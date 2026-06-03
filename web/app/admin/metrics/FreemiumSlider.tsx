'use client';

import { useState } from 'react';

interface DistEntry {
  userId: string;
  count: number;
}

interface FreemiumSliderProps {
  contactDist: DistEntry[];
  groupDist: DistEntry[];
  totalUsers: number;
}

function LimitSimulator({
  label,
  distribution,
  totalUsers,
  max,
}: {
  label: string;
  distribution: DistEntry[];
  totalUsers: number;
  max: number;
}) {
  const [limit, setLimit] = useState(Math.ceil(max / 2));
  const usersAbove = distribution.filter((d) => d.count > limit).length;
  const pct = totalUsers > 0 ? Math.round((usersAbove / totalUsers) * 100) : 0;

  return (
    <div className="p-5 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-gray-800 text-sm">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Si el límite free fuera <span className="font-black text-gray-900">{limit}</span>:
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-orange-500">{usersAbove}</p>
          <p className="text-xs text-gray-400">usuarios ({pct}%) necesitarían premium</p>
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={max}
        value={limit}
        onChange={(e) => setLimit(parseInt(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>1</span>
        <span>{max}</span>
      </div>
      <div className="mt-3 flex gap-1 flex-wrap">
        {distribution
          .sort((a, b) => b.count - a.count)
          .map((d) => (
            <span
              key={d.userId}
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                d.count > limit
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {d.count}
            </span>
          ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-1">Cada número = un usuario. Naranja = superaría el límite.</p>
    </div>
  );
}

export function FreemiumSlider({ contactDist, groupDist, totalUsers }: FreemiumSliderProps) {
  const maxContacts = Math.max(...contactDist.map((d) => d.count), 10);
  const maxGroups = Math.max(...groupDist.map((d) => d.count), 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <LimitSimulator
        label="Límite de contactos"
        distribution={contactDist}
        totalUsers={totalUsers}
        max={maxContacts}
      />
      <LimitSimulator
        label="Límite de grupos"
        distribution={groupDist}
        totalUsers={totalUsers}
        max={maxGroups}
      />
    </div>
  );
}
