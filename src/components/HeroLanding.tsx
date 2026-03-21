import { ArrowRight, Leaf, Award } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import healthyLeaves from '@/assets/healthy-leaves.jpg';
import farmerApp from '@/assets/farmer-app.jpg';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative h-[56vh] min-h-[380px]">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

        <div className="relative h-full flex items-end pb-12 md:pb-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto w-full">
            <span className="inline-block text-accent font-body font-semibold text-[11px] uppercase tracking-[0.22em] mb-2">
              {t(lang, 'Smart Agriculture', 'Pertanian Pintar')}
            </span>
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
            <div className="mt-5">
              <button
                onClick={onGetStarted}
                className="px-7 py-3 bg-primary text-primary-foreground rounded-2xl font-body font-semibold text-sm flex items-center gap-2 shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Get Started Free', 'Mulakan Percuma')}
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
      <section className="relative bg-cream-brand pb-16 pt-6 md:pt-10 px-6 md:px-12">
        {/* Subtle decorative leaves */}
        <div className="absolute top-4 left-6 opacity-[0.04] pointer-events-none">
          <Leaf size={80} className="text-primary -rotate-12" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-[0.03] pointer-events-none">
          <Leaf size={100} className="text-primary rotate-45" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-start">
            {/* Left — Text */}
            <div className="md:w-[42%] pt-2 md:pt-6">
              <span className="inline-block text-accent font-body font-semibold text-[10px] uppercase tracking-[0.2em] mb-3">
                {t(lang, 'Our Mission', 'Misi Kami')}
              </span>
              <h2 className="font-serif-display text-2xl md:text-3xl lg:text-[2.2rem] font-bold text-brown-brand leading-[1.12] tracking-tight">
                {t(lang, 'Strengthen Your Harvest', 'Perkasa Hasil Tani Anda')}
              </h2>
              <p className="mt-4 text-muted-foreground font-body text-sm leading-relaxed max-w-sm">
                {t(lang,
                  'We combine soil science with smart algorithms to deliver the most cost-effective fertilizer plans — tailored to your land, your crop, and your budget.',
                  'Kami menggabungkan sains tanah dengan algoritma pintar untuk memberikan pelan baja paling kos efektif — disesuaikan untuk tanah, tanaman, dan bajet anda.'
                )}
              </p>

              {/* Hand-drawn arrow sketch accent */}
              <svg className="mt-4 w-24 h-6 text-accent opacity-50" viewBox="0 0 96 24" fill="none">
                <path d="M2 18C20 6 50 4 80 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
                <path d="M74 8l8 4-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right — Overlapping image cluster */}
            <div className="md:w-[58%] relative min-h-[320px] md:min-h-[380px]">
              {/* Image 1: Healthy leaves — large, with beige border */}
              <div className="absolute top-0 left-0 w-[60%] z-10 rounded-3xl overflow-hidden border-[5px] border-beige-brand shadow-luxe">
                <img
                  src={healthyLeaves}
                  alt={t(lang, 'Healthy palm leaves', 'Daun sawit sihat')}
                  className="w-full h-48 md:h-56 object-cover"
                />
              </div>

              {/* Image 2: Farmer with app — offset, organic mask */}
              <div className="absolute top-20 md:top-16 right-0 w-[55%] z-20 rounded-[2rem] overflow-hidden shadow-luxe-hover" style={{ borderRadius: '2rem 2rem 3rem 1rem' }}>
                <img
                  src={farmerApp}
                  alt={t(lang, 'Farmer using BajaJimat app', 'Petani menggunakan aplikasi BajaJimat')}
                  className="w-full h-52 md:h-64 object-cover"
                />
              </div>

              {/* "Professional Guidance" help card — overlapping */}
              <div className="absolute bottom-0 left-[10%] z-30 bg-card rounded-2xl p-4 shadow-luxe border border-border/60 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award size={16} className="text-accent" />
                  <span className="font-serif-display text-sm font-semibold text-brown-brand">
                    {t(lang, 'Professional Guidance', 'Bimbingan Profesional')}
                  </span>
                </div>
                <p className="text-muted-foreground font-body text-[11px] leading-relaxed">
                  {t(lang, 'AI-powered recommendations backed by DOA research data.', 'Cadangan berkuasa AI disokong data penyelidikan DOA.')}
                </p>
                <button className="mt-2 text-accent font-body text-[11px] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  {t(lang, 'See How It Works', 'Lihat Cara Ia Berfungsi')}
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Tractor sketch accent */}
              <svg className="absolute -bottom-2 right-4 w-14 h-10 opacity-[0.06] pointer-events-none" viewBox="0 0 56 40" fill="none">
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
        <div className="max-w-6xl mx-auto mt-12 pt-4 border-t border-border/40 flex items-center justify-between">
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
