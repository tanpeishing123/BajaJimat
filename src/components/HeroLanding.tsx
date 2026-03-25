import { ArrowRight, Scan, BrainCircuit, Sprout, ShieldCheck, BadgeDollarSign, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const steps = [
  {
    icon: Scan,
    title_en: 'Diagnose',
    title_bm: 'Diagnosis',
    desc_en: 'Instantly map soil health via report or photo.',
    desc_bm: 'Peta kesihatan tanah serta-merta melalui laporan atau foto.',
    step: '01',
  },
  {
    icon: BrainCircuit,
    title_en: 'Optimise',
    title_bm: 'Optimumkan',
    desc_en: 'AI prevents chemical waste & finds the exact blend.',
    desc_bm: 'AI elak pembaziran kimia & cari campuran tepat.',
    step: '02',
  },
  {
    icon: Sprout,
    title_en: 'Nourish',
    title_bm: 'Suburkan',
    desc_en: 'Maximize harvest yields to secure local food supply.',
    desc_bm: 'Maksimumkan hasil tuaian untuk jaminan bekalan makanan.',
    step: '03',
  },
];

const bentoBlocks = [
  {
    icon: ShieldCheck,
    title_en: 'Stop Chemical Runoff',
    title_bm: 'Hentikan Larian Kimia',
    desc_en: 'Apply only what the soil needs.',
    desc_bm: 'Gunakan hanya apa yang tanah perlukan.',
    span: 'md:col-span-2',
  },
  {
    icon: BadgeDollarSign,
    title_en: 'Affordable Precision',
    title_bm: 'Ketepatan Mampu Milik',
    desc_en: 'Cut costs by 40% so no field goes unnourished.',
    desc_bm: 'Jimat 40% supaya tiada ladang terbiar.',
    span: 'md:col-span-1',
  },
  {
    icon: BarChart3,
    title_en: 'Boost National Supply',
    title_bm: 'Tingkat Bekalan Negara',
    desc_en: 'Higher yields per hectare for a stronger Malaysia.',
    desc_bm: 'Hasil lebih tinggi sehektar untuk Malaysia lebih kukuh.',
    span: 'md:col-span-1',
  },
];

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-auto bg-background">
      {/* ── Hero Section ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.img
          src={heroBg}
          alt="Lush Malaysian paddy field at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
        {/* Soft gradient overlay behind text only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <div className="relative h-full flex flex-col items-center justify-end pb-20 md:pb-28 text-center px-6">
          {/* Main Title — staggered character-style fade */}
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] leading-[1.05] tracking-tight"
          >
            Jimat Baja,
            <br />
            Tingkat Hasil
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-3 font-body text-lg md:text-2xl text-white/80 font-medium tracking-wide"
          >
            Save on Fertiliser, Boost Your Yield
          </motion.p>

          {/* CTA Button with pulse */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <button
              onClick={onGetStarted}
              className="group relative px-10 py-4 rounded-full bg-primary text-primary-foreground font-body font-bold text-base md:text-lg flex items-center gap-3 shadow-[0_0_30px_hsla(164,90%,30%,0.5)] hover:shadow-[0_0_50px_hsla(164,90%,30%,0.7)] hover:scale-105 active:scale-[0.97] transition-all duration-300 animate-pulse-ring"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>

          {/* Stats ribbon */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex gap-8 md:gap-12"
          >
            {[
              { val: '40%', label: t(lang, 'Cost Savings', 'Penjimatan') },
              { val: '3', label: t(lang, 'Analysis Modes', 'Cara Analisis') },
              { val: '2', label: t(lang, 'Languages', 'Bahasa') },
            ].map((s) => (
              <div key={s.val} className="text-center">
                <span className="block font-serif-display text-2xl md:text-3xl font-bold text-accent">{s.val}</span>
                <span className="block font-body text-[11px] md:text-xs text-white/60 mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16 md:mb-20"
          >
            <p className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2">
              {t(lang, 'Simple Process', 'Proses Mudah')}
            </p>
            <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-foreground">
              {t(lang, 'How It Works', 'Cara Penggunaan')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Floating icon */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_8px_30px_hsla(164,80%,30%,0.2)] transition-all duration-500">
                    <Icon size={36} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="font-body text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 mb-2">{step.step}</span>
                  <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {t(lang, step.title_en, step.title_bm)}
                  </h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-[260px]">
                    {t(lang, step.desc_en, step.desc_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why BajaJimat — Bento Grid ── */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 bg-gradient-landing">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14 md:mb-20"
          >
            <h2 className="font-serif-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
              {t(lang, 'Empowering Farmers.', 'Memperkasa Petani.')}
              <br />
              <span className="text-primary">
                {t(lang, 'Securing Our Food.', 'Menjamin Makanan Kita.')}
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {bentoBlocks.map((block, i) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={i}
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12 }}
                  className={`${block.span} relative overflow-hidden rounded-2xl p-6 md:p-8 cursor-default
                    bg-white/60 backdrop-blur-xl border border-white/70
                    shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)]
                    hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-8px_hsla(164,60%,30%,0.15)]
                    transition-all duration-500 group`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                    <Icon size={24} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif-display text-xl md:text-2xl font-bold text-foreground mb-1.5">
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
      <footer className="bg-primary px-6 py-8 text-center">
        <p className="text-primary-foreground/70 font-body text-xs leading-relaxed max-w-md mx-auto">
          {t(lang,
            'Join thousands of Malaysian farmers already saving on fertiliser costs.',
            'Sertai ribuan petani Malaysia yang sudah jimat kos baja.'
          )}
        </p>
        <p className="text-[10px] text-primary-foreground/40 font-body mt-2">
          © 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}
