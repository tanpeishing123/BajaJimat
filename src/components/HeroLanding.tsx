import { ArrowRight, ShieldCheck, BadgeDollarSign, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import bgEmpower from '@/assets/bg-empower.jpg';
import bgFooter from '@/assets/bg-footer.jpg';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scrollReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const bentoBlocks = [
  {
    icon: BadgeDollarSign,
    title_en: '💰 Cut Farming Costs',
    title_bm: '💰 Jimat Kos Pertanian',
    desc_en: 'Find the lowest-cost, most effective fertiliser mix for your field.',
    desc_bm: 'Cari campuran baja paling berkesan dan kos terendah untuk ladang anda.',
  },
  {
    icon: ShieldCheck,
    title_en: '🛡️ Save Cost, Protect Soil',
    title_bm: '🛡️ Jimat Kos, Lindungi Tanah',
    desc_en: 'Use precise weather data to avoid spraying before a storm.',
    desc_bm: 'Gunakan data cuaca tepat untuk elak menyembur sebelum ribut.',
  },
  {
    icon: BarChart3,
    title_en: '🌱 Save Sick Crops',
    title_bm: '🌱 Selamatkan Tanaman Sakit',
    desc_en: 'Identify diseases instantly and follow expert step-by-step treatment steps.',
    desc_bm: 'Kenal pasti penyakit serta-merta dan ikuti langkah rawatan pakar.',
  },
];

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  const headerEn = 'Empowering Farmers. Securing Our Food.';
  const headerBm = 'Memperkasa Petani. Menjamin Makanan Kita.';
  const headerText = t(lang, headerEn, headerBm);
  const headerWords = headerText.split(' ');

  return (
    <div className="min-h-screen flex flex-col overflow-auto bg-background">
      {/* ── Hero Section — Full Immersive ── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Background image */}
        <img
          src={heroBg}
          alt="Lush Malaysian paddy field at golden hour"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-sm font-semibold tracking-[0.25em] uppercase text-emerald-400 mb-5"
          >
            {t(lang, 'Precision Agriculture', 'Pertanian Tepat')}
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight max-w-4xl"
          >
            AgroMate: Farm Smarter,
            <br />
            <span className="text-emerald-400">Harvest More.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-white/75 font-normal leading-relaxed max-w-xl"
          >
            {t(lang, 'Precision farming from soil to harvest.', 'Pertanian tepat dari tanah ke tuaian.')}
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 rounded-full font-semibold text-base flex items-center gap-3
                bg-emerald-500 text-white
                shadow-[0_0_30px_rgba(16,185,129,0.35)]
                hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]
                active:scale-[0.97] transition-all duration-300"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <HowItWorksSection lang={lang} onGetStarted={onGetStarted} />

      {/* ── Empowering Farmers — Bento Grid ── */}
      <section className="relative px-6 md:px-12 py-24 md:py-36 overflow-hidden" style={{ background: '#FAFAF8' }}>
        <img src={bgEmpower} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" loading="lazy" width={1920} height={1080} />
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-3">
              {t(lang, 'Why AgroMate', 'Kenapa AgroMate')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] text-foreground">
              {headerWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: (j: number) => ({
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    }),
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className={`inline-block mr-[0.3em] ${
                    word.includes('.') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {bentoBlocks.map((block, i) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={i}
                  variants={scrollReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
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
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                    {t(lang, block.title_en, block.title_bm)}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t(lang, block.desc_en, block.desc_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative bg-primary px-6 py-10 text-center overflow-hidden">
        <img src={bgFooter} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" loading="lazy" width={1920} height={512} />
        <p className="relative z-10 text-primary-foreground/70 text-xs leading-relaxed max-w-md mx-auto">
          {t(lang,
            'Join thousands of Malaysian farmers already saving on fertiliser costs.',
            'Sertai ribuan petani Malaysia yang sudah jimat kos baja.'
          )}
        </p>
        <p className="relative z-10 text-[10px] text-primary-foreground/40 mt-3">
          © 2026 AgroMate · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}
