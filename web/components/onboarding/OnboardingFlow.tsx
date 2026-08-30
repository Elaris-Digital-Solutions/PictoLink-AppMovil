'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Heart, Building2, ExternalLink, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useProfileStore } from '@/lib/store/useProfileStore';
import { trackEvent } from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';
import type { AuthError } from '@supabase/supabase-js';
import type { Profile, UserType } from '@/types';
import logoPng from '@/assets/favicon.png';
import AvatarUpload from '@/components/ui/AvatarUpload';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'welcome' | 'auth' | 'check-email' | 'new-password' | 'name' | 'user-type' | 'institution';

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
    title: 'Soy familiar, amigo o terapeuta',
    subtitle: 'Soy a una persona usuaria de texto natural',
  },
  {
    id: 'institution',
    Icon: Building2,
    title: 'Somos una institución',
    subtitle: 'Escuelas, clínicas y centros especializados',
  },
];

const BRAND_ORANGE = '#FF8844';

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

/**
 * Traduce un error de Supabase Auth a algo que se le pueda mostrar a una
 * persona, sin filtrar lo que el sistema sabe.
 *
 * DECISION DE PRODUCTO, marcada a proposito — ver el bloque `enumeracion`:
 * distinguir «no confirmaste el correo» de «contraseña incorrecta» le ahorra
 * una llamada a soporte al usuario legitimo, y a la vez le confirma a un
 * desconocido que ESA cuenta existe. El proyecto ya tiene un oraculo de
 * enumeracion abierto (SEC-4), asi que aqui se elige no abrir el segundo.
 */
function mensajeDeAuth(error: AuthError): string {
  switch (error.code) {
    // ── enumeracion ─────────────────────────────────────────────────────────
    // Los dos devuelven el MISMO texto a proposito. Si se separan, cualquiera
    // puede averiguar que correos tienen cuenta probandolos de a uno.
    case 'invalid_credentials':
    case 'email_not_confirmed':
      return 'Correo o contraseña incorrectos, o falta confirmar el correo.';
    // ─────────────────────────────────────────────────────────────────────────

    case 'weak_password':
      return 'La contraseña es muy corta: usá al menos 6 caracteres.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Probaste varias veces seguidas. Esperá un minuto.';
    case 'validation_failed':
      return 'Revisá que el correo esté bien escrito.';
    default:
      // Nada de `error.message`: el texto de Supabase describe el sistema.
      return 'No pudimos completar la operación. Volvé a intentarlo.';
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OnboardingFlow() {
  const router = useRouter();
  const { setProfile, completeOnboarding } = useProfileStore();

  const [step, setStep] = useState<Step>('welcome');
  const [userType, setUserType] = useState<UserType | null>(null);

  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  // Que estamos esperando que llegue por correo: el alta o el cambio de clave.
  const [motivoCorreo, setMotivoCorreo] = useState<'alta' | 'reset'>('alta');

  // Aterrizaje de /auth/confirm. Se lee de window y no con useSearchParams
  // para no tener que envolver la pagina en un Suspense por el prerender.
  /* eslint-disable react-hooks/set-state-in-effect --
     La URL solo existe en el cliente: un inicializador de useState que lea
     window daria un HTML distinto al del servidor. El render extra ocurre una
     sola vez y solo al volver desde un enlace de correo. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('recovery') === '1') {
      setStep('new-password');
    } else if (params.get('auth_error') === 'enlace') {
      setStep('auth');
      setIsLogin(true);
      setAuthError('Ese enlace no sirve o ya venció. Pedí uno nuevo.');
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Recuperacion de contraseña. El mensaje es el mismo exista la cuenta o no:
  // decir «ese correo no está registrado» es el mismo oraculo que se evita
  // en mensajeDeAuth.
  async function handleReset() {
    if (!email.trim()) {
      setAuthError('Escribí tu correo arriba y volvé a tocar «Olvidé mi contraseña».');
      return;
    }
    setIsLoading(true);
    setAuthError('');
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });
    setIsLoading(false);
    setMotivoCorreo('reset');
    setStep('check-email');
  }

  // Contraseña nueva, ya con la sesion que dejo verifyOtp en las cookies.
  async function handleNuevaPassword(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      setAuthError(mensajeDeAuth(error));
      return;
    }
    setPassword('');
    router.replace('/');
  }

  // User-type selection → immediately completes onboarding (no plan step)
  async function handleUserTypeSelect(type: UserType) {
    setUserType(type);
    if (type === 'institution') {
      setStep('institution');
      return;
    }
    await handleComplete(type);
  }

  async function handleComplete(type: UserType) {
    setIsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Sin sesion no hay perfil que crear: RLS lo rechaza. Antes esto le
      // explicaba al usuario final como apagar la confirmacion de correo en un
      // panel de Supabase que no es suyo.
      setAuthError('Tenés que confirmar tu correo antes de terminar de crear la cuenta. Revisá tu bandeja de entrada.');
      setStep('check-email');
      setIsLoading(false);
      return;
    }

    const profile: Profile = {
      id: user.id,
      display_name: displayName.trim() || 'Usuario',
      avatar_url: avatarUrl ?? undefined,
      mode: type === 'communicator' ? 'communicator' : 'caregiver',
      color_theme: 'blue',
      grid_columns: 4,
      tts_enabled: true,
      tts_rate: 1.0,
      created_at: new Date().toISOString(),
      user_type: type,
      plan_type: 'free',
    };

    // Save profile to Supabase (upsert via REST)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?on_conflict=id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${session?.access_token}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          ...profile,
          name: profile.display_name
        })
      });

      if (!res.ok) {
        // El cuerpo de PostgREST trae tabla, columna y constraint: al usuario
        // le va el id de correlacion y nada mas.
        const ref = crypto.randomUUID().slice(0, 8);
        console.error('[onboarding] perfil rechazado', ref, res.status, await res.text());
        setAuthError(`No pudimos guardar tu perfil. Volvé a intentarlo. (ref ${ref})`);
        setIsLoading(false);
        return;
      }
    } catch (e: unknown) {
      // Antes esto solo logueaba y seguia: el usuario entraba a la app sin
      // perfil creado, convencido de que el alta habia funcionado.
      const ref = crypto.randomUUID().slice(0, 8);
      console.error('[onboarding] fallo de red al crear el perfil', ref, e);
      setAuthError(`No pudimos guardar tu perfil. Revisá tu conexión. (ref ${ref})`);
      setIsLoading(false);
      return;
    }

    setProfile(profile);
    trackEvent('onboarding_completed', { role: type });
    completeOnboarding();

    const dest = type === 'communicator' ? '/chat' : '/cuidador';
    router.replace(dest);
  }

  // ── Step: Welcome ────────────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div className="flex flex-col min-h-dvh bg-white text-slate-900 px-6">
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
        <div className="pb-8 space-y-3">
          <button
            onClick={() => { setStep('auth'); setIsLogin(false); }}
            className="w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform"
            style={{ backgroundColor: BRAND_ORANGE }}
          >
            Crear nueva cuenta
          </button>

          <button
            onClick={() => { setStep('auth'); setIsLogin(true); }}
            className="w-full text-slate-600 font-bold text-base py-3.5 rounded-2xl border-2 border-[#FFE2D0] bg-[#FFF8F3] active:scale-95 transition-transform"
          >
            Ya tengo una cuenta
          </button>
          <p className="text-center text-slate-400 text-[11px] leading-snug pt-2">
            Al continuar aceptas los Términos de uso<br/>y Política de privacidad
          </p>
        </div>
      </div>
    );
  }

  // ── Step: Auth ──────────────────────────────────────────────────────────────
  if (step === 'auth') {
    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setAuthError('');
      const supabase = createClient();

      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setAuthError(mensajeDeAuth(error));
        } else if (data.user) {
          // maybeSingle() avoids a noisy 406 when the user just signed up and the
          // profile row hasn't been created yet (the next onboarding step creates it).
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile) {
            setProfile(profile);
            completeOnboarding();
            const dest = profile.mode === 'caregiver' ? '/cuidador' : '/chat';
            router.replace(dest);
            return;
          } else {
            setStep('name');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
          }
        });
        if (error) {
          setAuthError(mensajeDeAuth(error));
        } else if (data.session) {
          // Confirmacion de correo desactivada: signUp ya devuelve sesion.
          setStep('name');
        } else {
          // Confirmacion activada: signUp devuelve session: null a proposito.
          // Sin sesion, RLS rechaza crear el perfil, asi que el flujo se
          // detiene aqui hasta que el usuario vuelva desde el correo.
          setMotivoCorreo('alta');
          setStep('check-email');
        }
      }
      setIsLoading(false);
    };

    return (
      <div className="flex flex-col min-h-dvh bg-white px-6">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => setStep('welcome')}
            className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
            disabled={isLoading}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col pt-6 gap-6">
          <div>
            <h2 className="text-3xl font-black leading-tight text-[#FF8844]">
              {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              {isLogin ? 'Ingresa tus datos para continuar' : 'Usa tu correo para guardar tu progreso'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4 mt-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#FFD5BF] bg-white text-slate-900 focus:border-[#FF8844] focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#FFD5BF] bg-white text-slate-900 focus:border-[#FF8844] focus:outline-none transition-colors"
              required
              disabled={isLoading}
              minLength={6}
            />

            {authError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium leading-snug">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ backgroundColor: BRAND_ORANGE }}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? 'Ingresar' : 'Registrarme'}
            </button>

            {isLogin && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="text-sm text-slate-500 font-medium underline underline-offset-4 py-2 disabled:opacity-50"
              >
                Olvidé mi contraseña
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ── Step: Check email ───────────────────────────────────────────────────────
  // Se llega aca cuando Supabase NO devolvio sesion: o el alta necesita
  // confirmacion, o se pidio recuperar la contraseña. En los dos casos lo
  // unico que se puede hacer es esperar el correo.
  if (step === 'check-email') {
    const esReset = motivoCorreo === 'reset';
    return (
      <div className="flex flex-col min-h-dvh bg-white px-6">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => { setStep('auth'); setAuthError(''); }}
            className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 pb-16">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: '#FFF1E8' }}
          >
            <Mail className="w-10 h-10" style={{ color: BRAND_ORANGE }} />
          </div>

          <div>
            <h2 className="text-3xl font-black leading-tight" style={{ color: BRAND_ORANGE }}>
              Revisá tu correo
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-xs">
              {esReset
                ? 'Si ese correo tiene una cuenta, te mandamos un enlace para poner una contraseña nueva.'
                : 'Te mandamos un enlace a tu correo. Abrilo para terminar de crear la cuenta.'}
            </p>
          </div>

          <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
            Puede tardar un par de minutos. Mirá también la carpeta de spam.
          </p>

          <button
            onClick={() => { setStep('auth'); setIsLogin(true); setAuthError(''); }}
            className="text-sm font-bold underline underline-offset-4 mt-2"
            style={{ color: BRAND_ORANGE }}
          >
            Volver a ingresar
          </button>
        </div>
      </div>
    );
  }

  // ── Step: New password ──────────────────────────────────────────────────────
  // Se llega desde /auth/confirm con ?recovery=1: verifyOtp ya dejo la sesion
  // en las cookies, pero la contraseña sigue siendo la que el usuario olvido.
  if (step === 'new-password') {
    return (
      <div className="flex flex-col min-h-dvh bg-white px-6">
        <div className="flex-1 flex flex-col pt-16 gap-6">
          <div>
            <h2 className="text-3xl font-black leading-tight" style={{ color: BRAND_ORANGE }}>
              Poné una contraseña nueva
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              Vas a usarla la próxima vez que ingreses
            </p>
          </div>

          <form onSubmit={handleNuevaPassword} className="flex flex-col gap-4 mt-2">
            <input
              type="password"
              placeholder="Contraseña nueva"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#FFD5BF] bg-white text-slate-900 focus:border-[#FF8844] focus:outline-none transition-colors"
              required
              disabled={isLoading}
              minLength={6}
              autoFocus
            />

            {authError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium leading-snug">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ backgroundColor: BRAND_ORANGE }}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              Guardar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Step: Name ──────────────────────────────────────────────────────────────
  if (step === 'name') {
    return (
      <div className="flex flex-col min-h-dvh bg-white px-6">
        {/* Nav */}
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => setStep('auth')}
            className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ProgressDots current={1} total={2} />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col pt-6 gap-6 overflow-y-auto">
          <div>
            <h2 className="text-3xl font-black leading-tight text-[#FF8844]">
              ¿Cómo te llamas?
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              Este nombre y foto serán visibles para tus contactos
            </p>
          </div>

          {/* Photo upload */}
          <div className="flex flex-col items-center gap-2">
            <AvatarUpload
              currentUrl={avatarUrl}
              displayName={displayName}
              onUpload={setAvatarUrl}
              size={100}
            />
            <p className="text-xs text-slate-400">
              {avatarUrl ? 'Toca la foto para cambiarla' : 'Agrega una foto de perfil (opcional)'}
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); if (displayName.trim()) setStep('user-type'); }}
            className="flex flex-col gap-4 mt-2"
          >
            <input
              type="text"
              placeholder="Escribe tu nombre o apodo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#FFD5BF] bg-white text-slate-900 focus:border-[#FF8844] focus:outline-none transition-colors"
              required
              minLength={2}
            />

            <button
              type="submit"
              disabled={!displayName.trim()}
              className="w-full text-white font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform mt-4 disabled:opacity-70 flex items-center justify-center"
              style={{ backgroundColor: BRAND_ORANGE }}
            >
              Continuar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Step: User type ──────────────────────────────────────────────────────────
  if (step === 'user-type') {
    return (
      <div className="flex flex-col min-h-dvh bg-white px-6">
        {/* Nav */}
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => setStep('name')}
            className="p-2 -ml-2 rounded-xl active:scale-95 transition-transform"
            disabled={isLoading}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ProgressDots current={2} total={2} />
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
                  disabled={isLoading}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left active:scale-[0.98] transition-all disabled:opacity-70 ${
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
                    {isLoading && selected
                      ? <Loader2 className="w-6 h-6 animate-spin" />
                      : <Icon className="w-6 h-6" />
                    }
                  </div>
                  <div>
                    <p className="font-bold leading-snug">{title}</p>
                    <p className={`text-sm mt-0.5 ${selected ? 'text-white/70' : 'text-slate-500'}`}>
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
      <div className="flex flex-col min-h-dvh bg-white px-6">
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

  return null;
}
