import { ArrowRight, ShieldCheck, BadgeDollarSign, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 1, ease: [0.25, 1, 0.5, 1] },
  },
});

const scrollReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

const bentoBlocks = [
  {
    icon: ShieldCheck,
    title_en: 'Stop Chemical Runoff',
    title_bm: 'Hentikan Larian Kimia',
    desc_en: 'Apply only what the soil needs — protecting rivers, soil, and future harvests.',
    desc_bm: 'Gunakan hanya apa yang tanah perlukan — lindungi sungai, tanah, dan tuaian masa depan.',
  },
  {
    icon: BadgeDollarSign,
    title_en: 'Affordable Precision',
    title_bm: 'Ketepatan Mampu Milik',
    desc_en: 'Cut fertiliser costs by 40% so no field goes unnourished.',
    desc_bm: 'Jimat kos baja sehingga 40% supaya tiada ladang terbiar.',
  },
  {
    icon: BarChart3,
    title_en: 'Boost National Supply',
    title_bm: 'Tingkat Bekalan Negara',
    desc_en: 'Higher yields per hectare for a stronger, more food-secure Malaysia.',
    desc_bm: 'Hasil lebih tinggi sehektar untuk Malaysia yang lebih kukuh dan terjamin makanan.',
  },
];

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  const headerEn = 'Empowering Farmers. Securing Our Food.';
  const headerBm = 'Memperkasa Petani. Menjamin Makanan Kita.';
  const headerText = t(lang, headerEn, headerBm);

  return (
    <div className="min-h-screen flex flex-col overflow-auto bg-background">
      {/* ── Hero Section ── */}
      <section className="relative h-[100svh] min-h-[520px] max-h-[900px] overflow-hidden">
        {/* Ken Burns background */}
        <img
          src={heroBg}
          alt="Lush Malaysian paddy field at golden hour"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns will-change-transform"
          width={1920}
          height={1080}
        />
        {/* Centered radial gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_60%,transparent_100%)]" />

        {/* Centered content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            variants={stagger(0)}
            initial="hidden"
            animate="visible"
            className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-snug tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
          >
            Jimat Baja,
            <br />
            Tingkat Hasil
          </motion.h1>

          <motion.p
            variants={stagger(1)}
            initial="hidden"
            animate="visible"
            className="mt-5 text-lg sm:text-xl md:text-2xl text-white font-medium tracking-wide"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Save on Fertiliser, Boost Your Yield
          </motion.p>

          {/* Glass Stats Bar */}
          <motion.div
            variants={stagger(2)}
            initial="hidden"
            animate="visible"
            className="mt-8 flex items-center gap-0 rounded-2xl overflow-hidden
              bg-black/30 backdrop-blur-xl border border-white/15
              shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)]"
          >
            {[
              { value: '40%', label: t(lang, 'Savings', 'Penjimatan') },
              { value: '3', label: t(lang, 'Analysis Modes', 'Mod Analisis') },
              { value: '2', label: t(lang, 'Languages', 'Bahasa') },
            ].map((stat, i) => (
              <div
                key={i}
                className={`px-6 py-4 md:px-8 md:py-5 flex flex-col items-center gap-1 ${
                  i < 2 ? 'border-r border-white/10' : ''
                }`}
              >
                <span className="text-white font-bold text-xl md:text-2xl tracking-tight">{stat.value}</span>
                <span className="text-white/70 text-[11px] md:text-xs font-medium tracking-wide uppercase">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Get Started Button */}
          <motion.div variants={stagger(3)} initial="hidden" animate="visible" className="mt-8">
            <button
              onClick={onGetStarted}
              className="group px-10 py-4 rounded-full font-body font-bold text-base md:text-lg inline-flex items-center gap-3
                bg-primary text-primary-foreground
                shadow-[0_4px_20px_-4px_hsla(164,90%,20%,0.5)]
                hover:scale-105 hover:shadow-[0_8px_30px_-4px_hsla(164,90%,20%,0.6),0_0_40px_-4px_hsla(164,90%,30%,0.3)]
                active:scale-[0.97] transition-all duration-300"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <HowItWorksSection lang={lang} onGetStarted={onGetStarted} />

      {/* ── Empowering Farmers — Bento Grid ── */}
      <section className="relative px-6 md:px-12 py-24 md:py-36 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15]">
              {headerText}
            </h2>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {bentoBlocks.map((block, i) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={i}
                  variants={scrollReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.15 }}
                  className="relative overflow-hidden rounded-2xl p-7 md:p-9 cursor-default
                    bg-card border border-border/30
                    shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06)]
                    hover:-translate-y-2 hover:shadow-[0_16px_50px_-12px_hsla(164,60%,25%,0.18)]
                    transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-500">
                    <Icon size={26} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif-display text-xl md:text-2xl font-bold text-foreground mb-2">
                    {t(lang, block.title_en, block.title_bm)}
                  </h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t(lang, block.desc_en, block.desc_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary px-6 py-10 text-center">
        <p className="text-primary-foreground/70 font-body text-xs leading-relaxed max-w-md mx-auto">
          {t(lang,
            'Join thousands of Malaysian farmers already saving on fertiliser costs.',
            'Sertai ribuan petani Malaysia yang sudah jimat kos baja.'
          )}
        </p>
        <p className="text-[10px] text-primary-foreground/40 font-body mt-3">
          © 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}
