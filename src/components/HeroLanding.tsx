import { ArrowRight, Leaf, BarChart3, Coins } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import farmSketch from '@/assets/farm-sketch.png';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="h-screen flex flex-col bg-cream-brand overflow-hidden">
      {/* Hero — top 55% */}
      <section className="relative flex-[55] min-h-0">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

        {/* Hero text — bottom-left of the image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8 md:pb-10">
          <div className="max-w-6xl mx-auto">
            <span className="inline-block text-accent font-body font-semibold text-xs uppercase tracking-[0.2em] mb-3">
              {t(lang, 'Smart Agriculture', 'Pertanian Pintar')}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-[3.4rem] font-serif-display font-bold text-white leading-[1.08] tracking-tight max-w-2xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              {t(lang, 'Precision Fertilizer,', 'Baja Tepat,')}
              <br />
              <span className="text-secondary">
                {t(lang, 'Maximum Savings', 'Jimat Maksimum')}
              </span>
            </h1>
            <p className="mt-3 text-white/80 font-body text-sm md:text-base max-w-lg leading-relaxed">
              {t(lang,
                'AI-driven nutrient analysis for Malaysian farmers. Reduce waste, cut costs by up to 40%.',
                'Analisis nutrien berteraskan AI untuk petani Malaysia. Kurangkan pembaziran, jimat sehingga 40%.'
              )}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={onGetStarted}
                className="px-7 py-3 bg-primary text-primary-foreground rounded-2xl font-body font-semibold text-sm flex items-center gap-2 shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Get Started Free', 'Mulakan Percuma')}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onGetStarted}
                className="px-7 py-3 rounded-2xl font-body font-medium text-sm text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Learn More', 'Ketahui Lagi')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom section — 45% with features + CTA */}
      <section className="relative flex-[45] min-h-0 bg-beige-brand">
        {/* Decorative sketch */}
        <img
          src={farmSketch}
          alt=""
          className="absolute bottom-2 right-4 w-28 md:w-36 opacity-[0.12] pointer-events-none"
        />

        <div className="h-full max-w-6xl mx-auto px-6 md:px-12 py-6 md:py-8 flex flex-col justify-between">
          {/* Feature cards row */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: <Leaf size={22} className="text-primary" />,
                title: t(lang, 'Test Your Soil', 'Uji Tanah Anda'),
                desc: t(lang, 'Rapid test kit color matching or upload your DOA soil report for instant analysis.', 'Padanan warna kit ujian pantas atau muat naik laporan tanah DOA untuk analisis segera.'),
              },
              {
                icon: <BarChart3 size={22} className="text-primary" />,
                title: t(lang, 'AI Analysis', 'Analisis AI'),
                desc: t(lang, 'Our optimizer finds the cheapest local fertilizer combination for your exact deficits.', 'Pengoptimum kami mencari kombinasi baja tempatan termurah untuk kekurangan tepat anda.'),
              },
              {
                icon: <Coins size={22} className="text-primary" />,
                title: t(lang, 'Save Money', 'Jimat Wang'),
                desc: t(lang, 'Most farmers save RM 500–1,200 per hectare per season with precise recommendations.', 'Kebanyakan petani jimat RM 500–1,200 sehektar semusim dengan cadangan tepat.'),
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-card rounded-3xl p-5 md:p-6 shadow-luxe border border-border hover:shadow-luxe-hover transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-serif-display text-base md:text-lg font-semibold text-brown-brand mb-1.5 leading-tight">{feat.title}</h3>
                <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed line-clamp-3">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom bar: tagline + CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <div>
              <p className="text-muted-foreground font-body text-xs md:text-sm">
                {t(lang, 'Join thousands of Malaysian farmers already saving on fertilizer costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
              </p>
              <p className="text-xs text-muted-foreground/60 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
            </div>
            <button
              onClick={onGetStarted}
              className="flex-shrink-0 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-body font-semibold text-sm flex items-center gap-2 shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
            >
              {t(lang, 'Start Now', 'Mulakan')}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
