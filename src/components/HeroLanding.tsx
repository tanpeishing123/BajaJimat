import { ArrowRight, ShieldCheck, BadgeDollarSign, BarChart3, Leaf, ScanLine, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeUpDelayed = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const wordReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { icon: BadgeDollarSign, value: '40%', label_en: 'Savings', label_bm: 'Penjimatan' },
  { icon: ScanLine, value: '3', label_en: 'Analysis Modes', label_bm: 'Mod Analisis' },
  { icon: Languages, value: '2', label_en: 'Languages', label_bm: 'Bahasa' },
];

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
  const headerWords = headerText.split(' ');

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
        {/* Left-heavy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* 2-column grid */}
        <div className="relative h-full grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-16 lg:px-24 gap-8">
          {/* Left Column — The Hook */}
          <div className="flex flex-col items-start justify-center pt-16 md:pt-0">
            <motion.h1
              custom={0}
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight"
            >
              Jimat Baja,
              <br />
              Tingkat Hasil
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              className="mt-5 font-body text-lg sm:text-xl md:text-2xl text-white/90 font-medium tracking-wide"
            >
              Save on Fertiliser, Boost Your Yield
            </motion.p>

            <motion.div custom={2} variants={fadeLeft} initial="hidden" animate="visible" className="mt-8">
              <button
                onClick={onGetStarted}
                className="group px-10 py-4 rounded-full font-body font-bold text-base md:text-lg flex items-center gap-3
                  bg-primary text-primary-foreground
                  shadow-[0_4px_20px_-4px_hsla(164,90%,20%,0.5)]
                  hover:scale-105 hover:shadow-[0_8px_30px_-4px_hsla(164,90%,20%,0.6)]
                  active:scale-[0.97] transition-all duration-300"
              >
                {t(lang, 'Get Started', 'Mulakan')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </motion.div>
          </div>

          {/* Right Column — Floating Glass Stats */}
          <motion.div
            variants={fadeUpDelayed}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center justify-center"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.3)] w-full max-w-sm">
              <div className="flex flex-col gap-6">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <Icon size={22} className="text-white/80" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white tracking-tight leading-none">{stat.value}</p>
                        <p className="text-sm text-white/60 font-body mt-0.5">{t(lang, stat.label_en, stat.label_bm)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <HowItWorksSection lang={lang} onGetStarted={onGetStarted} />

      {/* ── Empowering Farmers — Bento Grid ── */}
      <section className="relative px-6 md:px-12 py-24 md:py-36 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Split-word header reveal */}
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15]">
          {headerWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`inline-block mr-[0.3em] ${
                    word.includes('.') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {bentoBlocks.map((block, i) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={i}
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative overflow-hidden rounded-2xl p-7 md:p-9 cursor-default
                    bg-card border border-border/30
                    shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06)]
                    hover:-translate-y-2 hover:shadow-[0_16px_50px_-12px_hsla(164,60%,25%,0.18)]
                    transition-all duration-500 group`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/12 group-hover:scale-110 transition-all duration-500">
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
