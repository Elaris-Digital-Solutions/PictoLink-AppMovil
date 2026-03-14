'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Heart,
  Building2,
} from 'lucide-react';
import { useProfileStore } from '@/lib/store/useProfileStore';
import type { Profile, UserType, Plan } from '@/types';
import logoPng from '@/assets/favicon.png';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'welcome' | 'user-type' | 'plan' | 'institution';

// ─── Data ─────────────────────────────────────────────────────────────────────

const USER_TYPE_OPTIONS: {
  id: UserType;
  Icon: React.ElementType;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'communicator',
    Icon: MessageSquare,
    title: 'Soy quien usa los pictogramas',
    subtitle: 'Comunicación aumentativa y alternativa',
  },
  {
    id: 'companion',
    Icon: Heart,
    title: 'Soy cuidador, familiar o terapeuta',
    subtitle: 'Apoyo a una persona usuaria de AAC',
  },
  {
    id: 'institution',
    Icon: Building2,
    title: 'Somos una institución',
    subtitle: 'Escuelas, clínicas y centros especializados',
  },
];

const PLANS: {
  id: Plan;
  title: string;
  price: string;
  period?: string;
  contacts: string;
  features: string[];
  note: string;
  badge?: string;
}[] = [
  {
    id: 'free',
    title: 'Plan Gratis',
    price: 'Gratis',
    contacts: '1 Contacto',
    features: [
      'Todos los pictogramas base',
      'Síntesis de voz',
      'Historial de frases (7 días)',
      'Tablero principal personalizable',
    ],
    note: 'Ideal para comenzar',
  },
  {
    id: 'basic',
    title: 'Plan 10 Dls',
    price: '$10',
    period: '/mes',
    contacts: '10 Contactos',
    features: [
      'Todos los pictogramas base',
      'Historial ilimitado',
      'Respaldo de perfil en la nube',
      'Favoritos y frases rápidas',
      'Soporte por correo',
    ],
    note: 'Para uso familiar continuo',
  },
  {
    id: 'premium',
    title: 'Plan 15 Dls',
    price: '$15',
    period: '/mes',
    contacts: '20 Contactos',
    features: [
      'Todos los pictogramas base',
      'Pictogramas personalizados',
      'Tableros por rutina',
      'Perfiles múltiples',
      'Exportar e importar tableros',
      'Soporte prioritario',
    ],
    note: 'Máxima personalización y soporte',
    badge: 'Más popular',
  },
];

const BRAND_ORANGE = '#FF8844';

const PLAN_FEATURES_SHOWCASE: Array<{ label: string; includedIn: Plan[] }> = [
  { label: 'Todos los pictogramas base', includedIn: ['free', 'basic', 'premium'] },
  { label: 'Síntesis de voz', includedIn: ['free', 'basic', 'premium'] },
  { label: 'Pictogramas personalizados', includedIn: ['premium'] },
  { label: 'Respaldo de perfil en la nube', includedIn: ['basic', 'premium'] },
  { label: 'Perfiles múltiples', includedIn: ['premium'] },
  { label: 'Soporte prioritario', includedIn: ['premium'] },
];

const PLAN_CARD_COLORS: Record<Plan, { header: string; fold: string; text: string }> = {
  free: { header: '#FFB067', fold: '#F39B4D', text: '#7A3310' },
  basic: { header: '#FF8844', fold: '#E56F2C', text: '#FFFFFF' },
  premium: { header: '#C85F27', fold: '#A94E1F', text: '#FFFFFF' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 ml-auto">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? 'w-6 bg-[#FF8844]' : 'w-1.5 bg-[#FFD5BF]'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OnboardingFlow() {
  const router = useRouter();
  const { setProfile, completeOnboarding } = useProfileStore();

  const [step, setStep] = useState<Step>('welcome');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [plan, setPlan] = useState<Plan>('free');

  function handleUserTypeSelect(type: UserType) {
    setUserType(type);
    setStep(type === 'institution' ? 'institution' : 'plan');
  }

  function handleComplete() {
    const profile: Profile = {
      id: '',
      display_name: '',
      avatar_emoji: '😊',
      mode: userType === 'communicator' ? 'communicator' : 'caregiver',
      color_theme: 'blue',
      grid_columns: 4,
      tts_enabled: true,
      tts_rate: 1.0,
      created_at: new Date().toISOString(),
      user_type: userType ?? 'communicator',
      plan,
    };
    setProfile(profile);
    completeOnboarding();
    router.replace('/board');
  }

  // ── Step: Welcome ────────────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div className="flex flex-col h-dvh bg-white text-slate-900 px-6">
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-2 border-[#FFE2D0] bg-[#FFF5EF]">
            <Image
              src={logoPng}
              alt="PictoLink"
              width={60}
              height={60}
              priority
              className="select-none"
            />
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-5xl font-black tracking-tight text-[#FF8844]">PictoLink</h1>
            <p className="text-lg text-slate-500 font-medium leading-snug">
              Comunicación aumentativa<br />y alternativa
            </p>
          </div>

          <p className="text-center text-slate-500 text-sm leading-relaxed max-w-[280px]">
            Conecta pictogramas con palabras. Comunícate con quienes más quieres, sin límites.
          </p>
        </div>

        {/* CTA */}
        <div className="pb-10 space-y-4">
          <button
            onClick={() => setStep('user-type')}
            className="w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform"
            style={{ backgroundColor: BRAND_ORANGE }}
          >
            Comenzar
          </button>
          <p className="text-center text-slate-400 text-xs">
            Al continuar aceptas los Términos de uso y Política de privacidad
          </p>
        </div>
      </div>
    );
  }

  // ── Step: User type ──────────────────────────────────────────────────────────
  if (step === 'user-type') {
    return (
      <div className="flex flex-col h-dvh bg-white px-6">
        {/* Nav */}
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => setStep('welcome')}
            className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ProgressDots current={1} total={2} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col pt-6 gap-6">
          <div>
            <h2 className="text-2xl font-black leading-tight">
              ¿Cómo usarás PictoLink?
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Elige el perfil que mejor te describe
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {USER_TYPE_OPTIONS.map(({ id, Icon, title, subtitle }) => {
              const selected = userType === id;
              return (
                <button
                  key={id}
                  onClick={() => handleUserTypeSelect(id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left active:scale-[0.98] transition-all ${
                    selected
                      ? 'border-[#FF8844] bg-[#FF8844] text-white'
                      : 'border-[#FFD5BF] bg-white text-slate-900'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selected ? 'bg-white/20' : 'bg-[#FFF1E8] text-[#FF8844]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold leading-snug">{title}</p>
                    <p
                      className={`text-sm mt-0.5 ${
                        selected ? 'text-white/70' : 'text-slate-500'
                      }`}
                    >
                      {subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Institution ────────────────────────────────────────────────────────
  if (step === 'institution') {
    return (
      <div className="flex flex-col h-dvh bg-white px-6">
        {/* Nav */}
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => { setUserType(null); setStep('user-type'); }}
            className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center px-4">
          <div className="w-24 h-24 bg-[#FFF1E8] border-2 border-[#FFD5BF] rounded-3xl flex items-center justify-center">
            <Building2 className="w-12 h-12 text-[#FF8844]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black">Planes institucionales</h2>
            <p className="text-slate-500 leading-relaxed max-w-[290px] mx-auto">
              Para escuelas, clínicas y centros especializados tenemos planes con usuarios ilimitados, tableros compartidos y soporte dedicado.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Usuarios ilimitados', 'Tableros compartidos', 'Soporte dedicado', 'Reportes de uso'].map((f) => (
              <span key={f} className="text-xs font-semibold bg-[#FFF1E8] text-[#C85F27] px-3 py-1.5 rounded-full border border-[#FFD5BF]">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pb-10 space-y-3">
          <a
            href="mailto:instituciones@pictolink.app"
            className="flex items-center justify-center gap-2 w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform"
            style={{ backgroundColor: BRAND_ORANGE }}
          >
            <ExternalLink className="w-5 h-5" />
            Contactar al equipo
          </a>
          <button
            onClick={() => { setUserType(null); setStep('user-type'); }}
            className="w-full text-slate-500 font-medium py-3 text-sm"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Plan ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-dvh bg-white px-6">
      {/* Nav */}
      <div className="flex items-center gap-3 pt-4 pb-2">
        <button
          onClick={() => setStep('user-type')}
          className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <ProgressDots current={2} total={2} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 flex flex-col pt-4 gap-5 overflow-y-auto scrollbar-hide">
        <div>
          <h2 className="text-2xl font-black leading-tight">Elige tu plan</h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Puedes cambiar de plan en cualquier momento
          </p>
        </div>

        <div className="pb-4 md:pb-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:overflow-visible md:flex-wrap md:justify-center md:gap-7 md:max-w-[1120px] md:mx-auto">
            {PLANS.map((p) => {
              const selected = plan === p.id;
              const color = PLAN_CARD_COLORS[p.id];
              const darkHeaderText = color.text !== '#FFFFFF';
              const cardLabel = p.id === 'free' ? 'Gratis' : p.id === 'basic' ? 'Basic' : 'Premium';

              return (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`relative min-w-[248px] w-[82vw] max-w-[330px] md:w-[312px] lg:w-[330px] flex-shrink-0 rounded-[28px] overflow-hidden text-left bg-white snap-start transition-all active:scale-[0.98] border-2 ${
                    selected
                      ? 'border-[#FF8844] shadow-[0_14px_30px_rgba(255,136,68,0.28)]'
                      : 'border-[#FFE2D0] shadow-[0_10px_24px_rgba(200,95,39,0.16)]'
                  }`}
                >
                  {/* Top angled banner */}
                  <div className="relative h-[148px]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: color.header,
                        clipPath: 'polygon(0 0, 100% 0, 100% 82%, 0 62%)',
                      }}
                    />
                    <div
                      className="absolute top-0 right-0 h-full w-[88px]"
                      style={{
                        backgroundColor: color.fold,
                        clipPath: 'polygon(0 0, 100% 0, 100% 82%, 22% 66%)',
                      }}
                    />

                    <div className="absolute left-5 top-6" style={{ color: color.text }}>
                      <p
                        className="text-[32px] font-black leading-none uppercase tracking-tight"
                        style={{ textShadow: darkHeaderText ? 'none' : '0 1px 2px rgba(0,0,0,0.24)' }}
                      >
                        {cardLabel}
                      </p>
                      <p
                        className="text-[11px] uppercase font-bold tracking-wide mt-1"
                        style={{ opacity: darkHeaderText ? 0.9 : 0.86, textShadow: darkHeaderText ? 'none' : '0 1px 2px rgba(0,0,0,0.2)' }}
                      >
                        {p.period ? 'por mes' : 'plan inicial'}
                      </p>
                    </div>

                    <p
                      className="absolute right-4 top-[72px] text-[46px] font-black leading-none"
                      style={{ color: color.text, textShadow: darkHeaderText ? 'none' : '0 1px 2px rgba(0,0,0,0.18)' }}
                    >
                      {p.price}
                    </p>

                    {p.badge && (
                      <span className="absolute right-4 top-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#A94E1F]">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="px-5 pt-4 pb-5 bg-white">
                    <div className="rounded-xl border border-[#FFE2D0] bg-[#FFF8F3] px-3 py-2 mb-3">
                      <p className="text-[10px] uppercase tracking-wide font-extrabold text-[#C85F27]">
                        Contactos incluidos
                      </p>
                      <p className="text-base font-black text-slate-900 mt-0.5">{p.contacts}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.note}</p>
                    </div>

                    <ul className="space-y-2.5">
                      {PLAN_FEATURES_SHOWCASE.map((feature) => {
                        const included = feature.includedIn.includes(p.id);
                        return (
                          <li key={feature.label} className="flex items-center gap-2.5">
                            {included ? (
                              <Check className="w-4 h-4 text-[#00B469] flex-shrink-0" strokeWidth={3} />
                            ) : (
                              <X className="w-4 h-4 text-[#E11D48] flex-shrink-0" strokeWidth={3} />
                            )}
                            <span className="text-xs font-semibold text-slate-600 leading-snug">
                              {feature.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-5">
                      <div
                        className={`w-full rounded-full py-2.5 text-center text-xs font-black uppercase tracking-wide text-white ${
                          selected ? 'opacity-100' : 'opacity-90'
                        }`}
                        style={{ backgroundColor: selected ? '#C85F27' : '#E56F2C' }}
                      >
                        {selected ? 'Plan seleccionado' : 'Elegir plan'}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-500 mt-2 px-1 md:hidden">
            Desliza para ver los 3 planes.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pb-10 pt-2">
        <button
          onClick={handleComplete}
          className="w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform"
          style={{ backgroundColor: BRAND_ORANGE }}
        >
          Comenzar con PictoLink
        </button>
      </div>
    </div>
  );
}
