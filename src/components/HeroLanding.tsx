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
      {/* ── Hero Section — Split Screen ── */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[hsl(40,33%,98%)]">
        {/* Content grid */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — Text Panel */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="flex flex-col gap-6 md:gap-8 order-2 md:order-1"
            >
              <div>
                <motion.p
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4"
                >
                  {t(lang, 'Precision Agriculture', 'Pertanian Tepat')}
                </motion.p>
                <motion.h1
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight"
                >
                  AgroMate: Farm Smarter,
                  <br />
                  <span className="text-primary">Harvest More.</span>
                </motion.h1>
              </div>

              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed max-w-md"
              >
                {t(lang, 'Precision farming from soil to harvest.', 'Pertanian tepat dari tanah ke tuaian.')}
              </motion.p>

              <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 rounded-full font-semibold text-base flex items-center gap-3
                    bg-primary text-primary-foreground
                    shadow-[0_4px_20px_-4px_hsla(164,90%,20%,0.4)]
                    hover:scale-105 hover:shadow-[0_8px_30px_-4px_hsla(164,90%,20%,0.5)]
                    active:scale-[0.97] transition-all duration-300"
                >
                  {t(lang, 'Get Started', 'Mulakan')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right — Photo Card */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="order-1 md:order-2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)]">
                <img
                  src={heroBg}
                  alt="Lush Malaysian paddy field at golden hour"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px] object-cover"
                  width={1920}
                  height={1080}
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Floating stat badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-5 left-5 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t(lang, 'AI-Powered', 'Dikuasai AI')}</p>
                    <p className="text-[10px] text-muted-foreground">{t(lang, 'Soil · Leaf · Weather', 'Tanah · Daun · Cuaca')}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
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
