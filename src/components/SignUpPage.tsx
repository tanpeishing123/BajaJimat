import { useState } from 'react';
import { ArrowRight, ArrowLeft, Leaf } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import signupFarm from '@/assets/signup-farm.jpg';

interface SignUpPageProps {
  lang: 'en' | 'bm';
  onComplete: (data: { name: string; crop: string; farmSize: string; lang: 'en' | 'bm' }) => void;
  onLogin: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function SignUpPage({ lang, onComplete, onLogin }: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crop, setCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');

  const canSubmit = name.trim() && email.trim() && password.trim() && crop.trim() && farmSize;

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

        <div className="relative z-10 flex flex-col justify-end p-10 pb-16">
          <h2 className="font-serif-display text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            {t(lang, 'Grow Smarter.', 'Tanam Pintar.')}
            <br />
            <span className="text-accent">{t(lang, 'Save More.', 'Lebih Jimat.')}</span>
          </h2>

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

        <svg className="absolute right-0 top-0 h-full w-16" viewBox="0 0 64 800" fill="none" preserveAspectRatio="none">
          <path d="M64 0H32C32 0 0 100 16 200S64 300 48 400 0 500 16 600S64 700 48 800H64V0Z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* Right — Form */}
      <div className="w-full md:w-1/2 bg-cream-brand flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <div className="absolute top-12 right-10 opacity-[0.04] pointer-events-none">
          <Leaf size={120} className="text-primary rotate-12" />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="font-serif-display text-3xl md:text-4xl font-bold text-brown-brand leading-tight">
              {t(lang, 'Start Your Journey', 'Mulakan Perjalanan Anda')}
            </h1>
            <p className="mt-2 text-muted-foreground font-body text-sm">
              {t(lang, 'Set up your farm profile in seconds.', 'Sediakan profil ladang anda dalam beberapa saat.')}
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border/60">
            <div className="space-y-4">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] transition-all pointer-events-none">
                  {t(lang, 'Your Name', 'Nama Anda')}
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] transition-all pointer-events-none">
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
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] transition-all pointer-events-none">
                  {t(lang, 'Password', 'Kata Laluan')}
                </label>
              </div>

              {/* Crop Type */}
              <div className="relative">
                <input
                  type="text"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] transition-all pointer-events-none">
                  {t(lang, 'What are you growing?', 'Apa yang anda tanam?')}
                </label>
              </div>

              {/* Farm Size */}
              <div className="relative">
                <input
                  type="number"
                  value={farmSize}
                  onChange={e => setFarmSize(e.target.value)}
                  placeholder=" "
                  min="0.1"
                  step="0.1"
                  className="peer w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 pr-12 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] transition-all pointer-events-none">
                  {t(lang, 'Farm Size', 'Saiz Ladang')}
                </label>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body text-xs font-medium">ha</span>
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={!canSubmit}
              onClick={() => canSubmit && onComplete({ name, crop, farmSize, lang })}
              className="w-full mt-6 rounded-2xl py-3 font-body font-semibold text-sm flex items-center justify-center gap-2 btn-gradient-primary"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} />
            </button>
          </div>

          <p className="mt-4 text-center font-body text-sm text-muted-foreground">
            {t(lang, 'Already have an account?', 'Sudah mempunyai akaun?')}{' '}
            <button onClick={onLogin} className="text-brown-brand font-semibold hover:underline transition-colors">
              {t(lang, 'Log In', 'Log Masuk')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
