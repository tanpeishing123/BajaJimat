import { ArrowRight, Scan, BrainCircuit, TrendingUp, Target, Leaf } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import heroBg from '@/assets/hero-paddy.jpg';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const stats = [
  { value: '40%', label_bm: 'Jimat', label_en: 'Savings', sub_bm: 'vs baja premium', sub_en: 'vs premium fertiliser' },
  { value: '3', label_bm: 'Cara Analisis', label_en: 'Analysis Modes', sub_bm: 'Laporan, Manual, Foto', sub_en: 'Report, Manual, Photo' },
  { value: '2', label_bm: 'Bahasa', label_en: 'Languages', sub_bm: 'BM & English', sub_en: 'BM & English' },
];

const steps = [
  { icon: Scan, title_en: 'Analyse', title_bm: 'Analisis', desc_en: 'Upload report or leaf photo.', desc_bm: 'Muat naik laporan atau foto daun.', step: '01' },
  { icon: BrainCircuit, title_en: 'Optimise', title_bm: 'Optimum', desc_en: 'AI finds the cheapest blend.', desc_bm: 'AI cari campuran termurah.', step: '02' },
  { icon: TrendingUp, title_en: 'Save', title_bm: 'Jimat', desc_en: 'Cut fertiliser costs by 40%.', desc_bm: 'Potong kos baja sehingga 40%.', step: '03' },
];

const features = [
  { icon: Target, text_en: 'Pinpoint exact nutrient deficits.', text_bm: 'Kenal pasti kekurangan nutrien dengan tepat.' },
  { icon: Leaf, text_en: 'Get affordable, market-accurate recommendations.', text_bm: 'Dapatkan cadangan berpatutan dan tepat pasaran.' },
  { icon: TrendingUp, text_en: 'Maximize your crop yield & ROI.', text_bm: 'Tingkatkan hasil tanaman & pulangan anda.' },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <div className="min-h-screen flex flex-col overflow-auto bg-background">
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <img
            src={heroBg}
            alt="Sunlit Malaysian paddy field"
            className="w-full h-[125%] object-cover"
            width={1920}
            height={1080}
          />
        </motion.div>
        {/* Warm light overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          {/* Headline — staggered word reveal */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="font-serif-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-foreground drop-shadow-sm"
          >
            {['Jimat', 'Baja,', 'Tingkat', 'Hasil'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-3 font-body text-base md:text-xl lg:text-2xl font-medium text-foreground/70"
          >
            Save on Fertiliser, Boost Your Yield
          </motion.p>

          {/* Glassmorphism stats pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
            className="mt-8 flex flex-nowrap items-stretch bg-white/50 backdrop-blur-xl rounded-full border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
          >
            {stats.map((s, i) => (
              <div key={s.value} className={`min-w-[120px] flex-1 text-center px-4 md:px-6 py-3 ${i < stats.length - 1 ? 'border-r border-foreground/10' : ''}`}>
                <span className="block font-body font-bold text-sm md:text-base text-primary whitespace-nowrap">
                  {s.value}{' '}
                  <span className="text-xs md:text-sm font-semibold text-foreground/70">
                    {lang === 'bm' ? s.label_bm : s.label_en}
                  </span>
                </span>
                <span className="block text-muted-foreground font-body text-[10px] md:text-xs mt-0.5 whitespace-nowrap">
                  {lang === 'bm' ? s.sub_bm : s.sub_en}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 20 }}
            className="mt-8"
          >
            <button
              onClick={onGetStarted}
              className="group btn-gradient-primary px-10 py-4 rounded-full font-body font-bold text-sm md:text-base flex items-center gap-2.5"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
        className="bg-white px-6 md:px-12 py-24 md:py-32"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">
            {t(lang, 'Simple Process', 'Proses Mudah')}
          </p>
          <h2 className="font-serif-display text-2xl md:text-4xl font-bold text-foreground mb-16">
            {t(lang, 'How It Works', 'Cara Penggunaan')}
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-center gap-12 md:gap-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.18, duration: 0.7, ease: 'easeOut' }}
                  className="flex-1 flex flex-col items-center text-center max-w-[200px] mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Icon size={28} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif-display text-lg md:text-xl font-bold text-foreground mb-1">
                    {t(lang, step.title_en, step.title_bm)}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {t(lang, step.desc_en, step.desc_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Why BajaJimat — Elegant Feature Blocks ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
        className="bg-background px-6 md:px-12 py-24 md:py-32"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">
              {t(lang, 'Why Choose Us', 'Mengapa Pilih Kami')}
            </p>
            <h2 className="font-serif-display text-2xl md:text-4xl font-bold text-foreground">
              {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
            </h2>
          </div>

          <div className="flex flex-col gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
                  className="group flex items-center gap-5 md:gap-6"
                >
                  <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_hsla(164,90%,30%,0.25)] group-hover:-translate-y-0.5">
                    <Icon size={26} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
                    {t(lang, feat.text_en, feat.text_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer className="bg-primary px-6 py-6 text-center">
        <p className="text-primary-foreground/60 font-body text-[10px] leading-[1.7]">
          {t(lang, 'Join thousands of Malaysian farmers already saving on fertiliser costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
        </p>
        <p className="text-[9px] text-primary-foreground/40 font-body mt-0.5">
          © 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}
