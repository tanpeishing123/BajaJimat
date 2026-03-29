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
    icon: ShieldCheck,
    title_en: 'Stop Chemical Runoff',
    title_bm: 'Hentikan Larian Kimia',
    desc_en: 'Apply only what the soil needs.',
    desc_bm: 'Gunakan hanya apa yang tanah perlukan.',
  },
  {
    icon: BadgeDollarSign,
    title_en: 'Affordable Precision',
    title_bm: 'Ketepatan Mampu Milik',
    desc_en: 'Cut costs by up to 40%.',
    desc_bm: 'Jimat kos sehingga 40%.',
  },
  {
    icon: BarChart3,
    title_en: 'Boost National Supply',
    title_bm: 'Tingkat Bekalan Negara',
    desc_en: 'Higher yields for a stronger Malaysia.',
    desc_bm: 'Hasil lebih tinggi untuk Malaysia lebih kukuh.',
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
      <section className="relative h-[100svh] min-h-[520px] max-h-[900px] overflow-hidden flex items-center justify-center">
        <img
          src={heroBg}
          alt="Lush Malaysian paddy field at golden hour"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns will-change-transform"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <motion.h1
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight"
            >
              Jimat Baja,
              <br />
              Tingkat Hasil
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="font-sans italic text-white/90 text-lg md:text-xl font-medium tracking-wide drop-shadow-md"
            >
              Smart fertiliser decisions made easy.
            </motion.p>
          </div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="mt-8 md:mt-10">
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
            <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.15]">
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
      <footer className="relative bg-primary px-6 py-10 text-center overflow-hidden">
        <img src={bgFooter} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" loading="lazy" width={1920} height={512} />
        <p className="relative z-10 text-primary-foreground/70 font-body text-xs leading-relaxed max-w-md mx-auto">
          {t(lang,
            'Join thousands of Malaysian farmers already saving on fertiliser costs.',
            'Sertai ribuan petani Malaysia yang sudah jimat kos baja.'
          )}
        </p>
        <p className="relative z-10 text-[10px] text-primary-foreground/40 font-body mt-3">
          © 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}
