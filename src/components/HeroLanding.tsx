import { ArrowRight, Leaf, BarChart3, Coins } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Hero — top ~60% with clear image, no heavy fog */}
      <section className="relative flex-[60] min-h-0">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gentle left-side gradient only — keeps image vivid on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

        {/* Hero content — left-aligned, vertically centered */}
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

      {/* Wave separator — organic transition from dark hero to light cards */}
      <div className="relative -mt-6 z-10">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12" preserveAspectRatio="none">
          <path d="M0 48h1440V18c-120 14-240 22-360 18S840 16 720 12 480 14 360 20 120 36 0 42z" fill="hsl(40 33% 97%)" />
        </svg>
      </div>

      {/* Bottom section — feature cards on warm off-white */}
      <section className="relative flex-[40] min-h-0" style={{ backgroundColor: '#fdfbf7' }}>
        {/* Subtle leaf outlines bleeding from hero */}
        <div className="absolute -top-4 left-8 w-16 h-16 opacity-[0.06] pointer-events-none">
          <Leaf className="w-full h-full text-primary rotate-[-20deg]" />
        </div>
        <div className="absolute -top-2 right-12 w-12 h-12 opacity-[0.05] pointer-events-none">
          <Leaf className="w-full h-full text-primary rotate-[30deg]" />
        </div>

        <div className="h-full max-w-5xl mx-auto px-6 md:px-12 py-5 md:py-6 flex flex-col justify-between">
          {/* Compact feature cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              {
                icon: <Leaf size={18} className="text-primary" />,
                title: t(lang, 'Test Your Soil', 'Uji Tanah Anda'),
                desc: t(lang, 'Rapid test kit color matching or upload your DOA soil report.', 'Padanan warna kit ujian pantas atau muat naik laporan tanah DOA.'),
              },
              {
                icon: <BarChart3 size={18} className="text-primary" />,
                title: t(lang, 'AI Analysis', 'Analisis AI'),
                desc: t(lang, 'Find the cheapest local fertilizer combination for your deficits.', 'Cari kombinasi baja tempatan termurah untuk kekurangan anda.'),
              },
              {
                icon: <Coins size={18} className="text-primary" />,
                title: t(lang, 'Save Money', 'Jimat Wang'),
                desc: t(lang, 'Save RM 500–1,200 per hectare per season with precision.', 'Jimat RM 500–1,200 sehektar semusim dengan ketepatan.'),
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 shadow-luxe border border-border/60 hover:shadow-luxe-hover transition-shadow duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-2">
                  {feat.icon}
                </div>
                <h3 className="font-serif-display text-sm font-semibold text-brown-brand mb-1 leading-snug">{feat.title}</h3>
                <p className="text-muted-foreground font-body text-xs leading-relaxed line-clamp-2">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer tagline */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div>
              <p className="text-muted-foreground font-body text-xs">
                {t(lang, 'Join thousands of Malaysian farmers already saving on fertilizer costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
              </p>
              <p className="text-[10px] text-muted-foreground/50 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
