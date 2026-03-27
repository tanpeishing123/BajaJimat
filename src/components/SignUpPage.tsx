import { useState } from 'react';
import { ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import signupFarm from '@/assets/signup-farm.jpg';
import signupBajaBg from '@/assets/signup-baja-bg.jpg';

interface SignUpPageProps {
  lang: 'en' | 'bm';
  onComplete: (data: { name: string; lang: 'en' | 'bm' }) => void;
  onBack: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function SignUpPage({ lang: initialLang, onComplete, onBack }: SignUpPageProps) {
  const [lang, setLang] = useState<'en' | 'bm'>(initialLang);
  const [name, setName] = useState('');

  const canSubmit = name.trim().length > 0;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left — Visual */}
      <div className="hidden md:flex w-1/2 relative">
        <img src={signupFarm} alt="Malaysian palm oil plantation" className="absolute inset-0 w-full h-full object-cover" />
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
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/80 flex items-center justify-center text-xs font-body font-semibold text-white" style={{ backgroundColor: ['#065f46', '#f59e0b', '#7c3aed', '#059669'][i] }}>
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-white/90 font-body text-sm">
              {t(lang, '30k+ Malaysian Farmers', '30k+ Petani Malaysia')}
            </span>
          </div>
        </div>
        <svg className="absolute right-0 top-0 h-full w-16" viewBox="0 0 64 800" fill="none" preserveAspectRatio="none">
          <path d="M64 0H32C32 0 0 100 16 200S64 300 48 400 0 500 16 600S64 700 48 800H64V0Z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* Right — Form */}
      <div className="w-full md:w-1/2 bg-cream-brand flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <img src={signupBajaBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" loading="lazy" width={1920} height={1080} />
        <button onClick={onBack} className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-brown-brand transition-colors z-10">
          <ArrowLeft size={16} />
          {t(lang, 'Home', 'Utama')}
        </button>

        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="font-serif-display text-3xl md:text-4xl font-bold text-brown-brand leading-tight">
              {t(lang, 'Welcome to BajaJimat', 'Selamat Datang ke BajaJimat')}
            </h1>
            <p className="mt-2 text-muted-foreground font-body text-sm">
              {t(lang, 'Tell us your name to get started.', 'Beritahu nama anda untuk bermula.')}
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border/60">
            <div className="space-y-4">
              {/* Language Selector */}
              <div>
                <label className="text-[10px] text-muted-foreground font-body font-medium mb-1.5 block flex items-center gap-1">
                  <Globe size={12} />
                  {t(lang, 'Language', 'Bahasa')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLang('bm')}
                    className={`flex-1 rounded-2xl py-2.5 font-body text-sm font-medium transition-all duration-200 active:scale-[0.97] ${lang === 'bm' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-beige-brand/40 border border-border text-muted-foreground hover:border-primary/40'}`}
                  >
                    Bahasa Malaysia
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`flex-1 rounded-2xl py-2.5 font-body text-sm font-medium transition-all duration-200 active:scale-[0.97] ${lang === 'en' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-beige-brand/40 border border-border text-muted-foreground hover:border-primary/40'}`}
                  >
                    English
                  </button>
                </div>
              </div>

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
            </div>

            {/* Submit */}
            <button
              disabled={!canSubmit}
              onClick={() => canSubmit && onComplete({ name, lang })}
              className="w-full mt-6 rounded-2xl py-3 font-body font-semibold text-sm flex items-center justify-center gap-2 btn-gradient-primary"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
