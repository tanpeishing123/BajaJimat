import { useState } from 'react';
import { ArrowRight, ArrowLeft, Leaf } from 'lucide-react';
import signupFarm from '@/assets/signup-farm.jpg';

interface LoginPageProps {
  lang: 'en' | 'bm';
  onLogin: () => void;
  onSignup: () => void;
  onBack: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function LoginPage({ lang, onLogin, onSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim() && password.trim();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left — Visual Impact */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={signupFarm}
          alt="Malaysian palm oil plantation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Slogan */}
        <div className="relative z-10 flex flex-col justify-end p-10 pb-16">
          <h2 className="font-serif-display text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            {t(lang, 'Welcome Back.', 'Selamat Kembali.')}
            <br />
            <span className="text-accent">{t(lang, 'Keep Growing.', 'Terus Berkembang.')}</span>
          </h2>

          {/* Social proof badge */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['A', 'R', 'M', 'S'].map((initial, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center text-xs font-body font-semibold text-white"
                  style={{ backgroundColor: ['#065f46', '#f59e0b', '#7c3aed', '#059669'][i] }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-white/90 font-body text-sm">
              {t(lang, 'Join 30k+ Malaysian Farmers', 'Sertai 30k+ Petani Malaysia')}
            </span>
          </div>
        </div>

        {/* Organic wave bleeding into right side */}
        <svg className="absolute right-0 top-0 h-full w-16" viewBox="0 0 64 800" fill="none" preserveAspectRatio="none">
          <path d="M64 0H32C32 0 0 100 16 200S64 300 48 400 0 500 16 600S64 700 48 800H64V0Z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* Right — Form */}
      <div className="w-full md:w-1/2 bg-cream-brand flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-12 right-10 opacity-[0.04] pointer-events-none">
          <Leaf size={120} className="text-primary rotate-12" />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif-display text-3xl md:text-4xl font-bold text-brown-brand leading-tight">
              {t(lang, 'Welcome Back', 'Selamat Kembali')}
            </h1>
            <p className="mt-2 text-muted-foreground font-body text-sm">
              {t(lang, 'Log in to continue optimizing your farm.', 'Log masuk untuk terus mengoptimumkan ladang anda.')}
            </p>
          </div>

          {/* Form card */}
          <div className="bg-card rounded-3xl p-7 shadow-luxe border border-border/60">
            <div className="space-y-5">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-6 pb-2 font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-2 text-[11px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px] transition-all pointer-events-none">
                  {t(lang, 'Email Address', 'Alamat E-mel')}
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-6 pb-2 font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-2 text-[11px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px] transition-all pointer-events-none">
                  {t(lang, 'Password', 'Kata Laluan')}
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={!canSubmit}
              onClick={() => canSubmit && onLogin()}
              className="w-full mt-7 rounded-2xl py-3.5 font-body font-semibold text-[15px] flex items-center justify-center gap-2 btn-gradient-primary"
            >
              {t(lang, 'Log In', 'Log Masuk')}
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Secondary link */}
          <p className="mt-5 text-center font-body text-sm text-muted-foreground">
            {t(lang, "Don't have an account?", 'Belum mempunyai akaun?')}{' '}
            <button onClick={onSignup} className="text-brown-brand font-semibold hover:underline transition-colors">
              {t(lang, 'Sign Up', 'Daftar')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
