import { ArrowRight, Leaf } from 'lucide-react';
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative flex-[55] min-h-0">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="relative h-full flex items-end pb-8 md:pb-10 pt-[88px] px-6 md:px-12">
          <div className="w-full">
            <h1
              className="text-[1.7rem] md:text-4xl lg:text-[3rem] font-serif-display font-bold text-white leading-[1.06] tracking-tight max-w-xl"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}
            >
              {t(lang, 'Precision Fertilizer,', 'Baja Tepat,')}
              <br />
              <span className="text-secondary">
                {t(lang, 'Maximum Savings', 'Jimat Maksimum')}
              </span>
            </h1>
            <p className="mt-2 text-white/85 font-body text-xs md:text-sm max-w-md leading-relaxed">
              {t(lang,
                'AI-driven nutrient analysis for Malaysian farmers. Reduce waste, cut costs by up to 40%.',
                'Analisis nutrien berteraskan AI untuk petani Malaysia. Kurangkan pembaziran, jimat sehingga 40%.'
              )}
            </p>
            <div className="mt-4">
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-body font-semibold text-sm flex items-center gap-2 shadow-luxe hover:shadow-luxe-hover hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Get Started', 'Mulakan')}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wave separator ── */}
      <div className="relative -mt-5 z-10">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 md:h-10" preserveAspectRatio="none">
          <path d="M0 48h1440V18c-120 14-240 22-360 18S840 16 720 12 480 14 360 20 120 36 0 42z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* ── Storytelling Section ── */}
      <section className="relative bg-cream-brand flex-[45] min-h-0 px-6 md:px-12 pb-8 pt-1 flex flex-col">
        {/* Decorative leaves */}
        <div className="absolute top-2 left-4 opacity-[0.04] pointer-events-none">
          <Leaf size={48} className="text-primary -rotate-12" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-[0.03] pointer-events-none">
          <Leaf size={56} className="text-primary rotate-45" />
        </div>

        <div className="w-full flex-1 min-h-0">
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start h-full">
            {/* Left — Text */}
            <div className="md:w-[42%] pt-1">
              <span className="inline-block text-accent font-body font-semibold text-[9px] uppercase tracking-[0.2em] mb-1">
                {t(lang, 'Our Mission', 'Misi Kami')}
              </span>
              <h2 className="font-serif-display text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-[1.12] tracking-tight">
                {t(lang, 'Strengthen Your Harvest', 'Perkasa Hasil Tani Anda')}
              </h2>
              <p className="mt-2 text-muted-foreground font-body text-xs leading-relaxed max-w-sm">
                {t(lang,
                  'We combine soil science with smart algorithms to deliver the most cost-effective fertilizer plans — tailored to your land, your crop, and your budget.',
                  'Kami menggabungkan sains tanah dengan algoritma pintar untuk memberikan pelan baja paling kos efektif — disesuaikan untuk tanah, tanaman, dan bajet anda.'
                )}
              </p>
              <svg className="mt-2 w-16 h-4 text-accent opacity-50" viewBox="0 0 96 24" fill="none">
                <path d="M2 18C20 6 50 4 80 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
                <path d="M74 8l8 4-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right — Images */}
            <div className="md:w-[58%] relative min-h-[140px] md:min-h-[180px]">
              <div className="absolute top-0 left-0 w-[54%] z-10 rounded-2xl overflow-hidden border-[3px] border-beige-brand shadow-luxe">
                <img
                  src={healthyLeaves}
                  alt={t(lang, 'Healthy palm leaves', 'Daun sawit sihat')}
                  className="w-full h-24 md:h-32 object-cover"
                />
              </div>
              <div className="absolute top-6 md:top-5 right-0 w-[50%] z-20 rounded-[1.2rem] overflow-hidden shadow-luxe-hover" style={{ borderRadius: '1.2rem 1.2rem 1.6rem 0.6rem' }}>
                <img
                  src={farmerApp}
                  alt={t(lang, 'Farmer using BajaJimat', 'Petani menggunakan BajaJimat')}
                  className="w-full h-28 md:h-36 object-cover"
                />
              </div>
              <svg className="absolute -bottom-1 right-3 w-10 h-6 opacity-[0.06] pointer-events-none" viewBox="0 0 56 40" fill="none">
                <rect x="8" y="14" width="28" height="14" rx="3" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                <circle cx="14" cy="32" r="6" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                <circle cx="34" cy="32" r="4" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full pt-2 border-t border-border/40 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground font-body text-[10px]">
              {t(lang, 'Join thousands of Malaysian farmers already saving on fertilizer costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
            </p>
            <p className="text-[9px] text-muted-foreground/50 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
          </div>
        </div>
      </section>
    </div>
  );
}
