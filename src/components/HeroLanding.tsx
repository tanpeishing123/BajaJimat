import { ArrowRight, Leaf, Zap, ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import healthyLeaves from '@/assets/healthy-leaves.jpg';
import farmerApp from '@/assets/farmer-app.jpg';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  const scrollToMission = () => {
    document.getElementById('mission-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative h-[44vh] min-h-[300px]">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Clean gradient — not foggy */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="relative h-full flex items-end pb-10 md:pb-12 pt-24 md:pt-28 px-4 md:px-6">
          <div className="w-full">
            <h1
              className="text-3xl md:text-5xl lg:text-[3.6rem] font-serif-display font-bold text-white leading-[1.06] tracking-tight max-w-xl"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}
            >
              {t(lang, 'Precision Fertilizer,', 'Baja Tepat,')}
              <br />
              <span className="text-secondary">
                {t(lang, 'Maximum Savings', 'Jimat Maksimum')}
              </span>
            </h1>
            <p className="mt-3 text-white/85 font-body text-sm md:text-[15px] max-w-md leading-relaxed">
              {t(lang,
                'AI-driven nutrient analysis for Malaysian farmers. Reduce waste, cut costs by up to 40%.',
                'Analisis nutrien berteraskan AI untuk petani Malaysia. Kurangkan pembaziran, jimat sehingga 40%.'
              )}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-7 py-3 bg-primary text-primary-foreground rounded-2xl font-body font-semibold text-sm flex items-center gap-2 shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Get Started', 'Mulakan')}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wave separator ── */}
      <div className="relative -mt-6 z-10">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12" preserveAspectRatio="none">
          <path d="M0 48h1440V18c-120 14-240 22-360 18S840 16 720 12 480 14 360 20 120 36 0 42z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* ── Asymmetrical Storytelling Section ── */}
      <section id="mission-section" className="relative bg-cream-brand pb-6 pt-2 md:pt-4 px-6 md:px-12">
        {/* Subtle decorative leaves */}
        <div className="absolute top-4 left-6 opacity-[0.04] pointer-events-none">
          <Leaf size={64} className="text-primary -rotate-12" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-[0.03] pointer-events-none">
          <Leaf size={80} className="text-primary rotate-45" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
            {/* Left — Text */}
            <div className="md:w-[42%] pt-2 md:pt-4">
              <span className="inline-block text-accent font-body font-semibold text-[10px] uppercase tracking-[0.2em] mb-2">
                {t(lang, 'Our Mission', 'Misi Kami')}
              </span>
              <h2 className="font-serif-display text-xl md:text-2xl lg:text-[1.9rem] font-bold text-brown-brand leading-[1.12] tracking-tight">
                {t(lang, 'Strengthen Your Harvest', 'Perkasa Hasil Tani Anda')}
              </h2>
              <p className="mt-3 text-muted-foreground font-body text-sm leading-relaxed max-w-sm">
                {t(lang,
                  'We combine soil science with smart algorithms to deliver the most cost-effective fertilizer plans — tailored to your land, your crop, and your budget.',
                  'Kami menggabungkan sains tanah dengan algoritma pintar untuk memberikan pelan baja paling kos efektif — disesuaikan untuk tanah, tanaman, dan bajet anda.'
                )}
              </p>

              {/* Hand-drawn arrow sketch */}
              <svg className="mt-3 w-20 h-5 text-accent opacity-50" viewBox="0 0 96 24" fill="none">
                <path d="M2 18C20 6 50 4 80 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
                <path d="M74 8l8 4-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right — Overlapping image cluster */}
            <div className="md:w-[58%] relative min-h-[200px] md:min-h-[240px]">
              {/* Image 1: Healthy leaves — beige border */}
              <div className="absolute top-0 left-0 w-[54%] z-10 rounded-2xl overflow-hidden border-[3px] border-beige-brand shadow-luxe">
                <img
                  src={healthyLeaves}
                  alt={t(lang, 'Healthy palm leaves', 'Daun sawit sihat')}
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>

              {/* Image 2: Farmer with app — organic mask */}
              <div className="absolute top-10 md:top-8 right-0 w-[50%] z-20 rounded-[1.5rem] overflow-hidden shadow-luxe-hover" style={{ borderRadius: '1.5rem 1.5rem 2rem 0.8rem' }}>
                <img
                  src={farmerApp}
                  alt={t(lang, 'Farmer using BajaJimat app', 'Petani menggunakan aplikasi BajaJimat')}
                  className="w-full h-36 md:h-44 object-cover"
                />
              </div>


              {/* Tractor sketch */}
              <svg className="absolute -bottom-2 right-4 w-12 h-8 opacity-[0.06] pointer-events-none" viewBox="0 0 56 40" fill="none">
                <rect x="8" y="14" width="28" height="14" rx="3" stroke="hsl(24 30% 16%)" strokeWidth="1.5" />
                <circle cx="14" cy="32" r="6" stroke="hsl(24 30% 16%)" strokeWidth="1.5" />
                <circle cx="34" cy="32" r="4" stroke="hsl(24 30% 16%)" strokeWidth="1.5" />
                <rect x="36" y="10" width="12" height="10" rx="2" stroke="hsl(24 30% 16%)" strokeWidth="1.5" />
                <line x1="42" y1="10" x2="42" y2="4" stroke="hsl(24 30% 16%)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto mt-4 pt-2 border-t border-border/40 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground font-body text-xs">
              {t(lang, 'Join thousands of Malaysian farmers already saving on fertilizer costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
          </div>
        </div>
      </section>
    </div>
  );
}
