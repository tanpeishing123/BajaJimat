import { ArrowRight, Scan, BrainCircuit, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import farmerImg from '@/assets/farmer-field.jpg';

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
  {
    icon: Scan,
    title_en: 'Analyse Your Soil',
    title_bm: 'Analisis Tanah',
    desc_en: 'Upload soil report, enter NPK values, or take a leaf photo',
    desc_bm: 'Muat naik laporan tanah, masukkan nilai NPK, atau ambil foto daun',
    step: '01',
  },
  {
    icon: BrainCircuit,
    title_en: 'AI Optimisation',
    title_bm: 'Pengoptimuman AI',
    desc_en: 'Our algorithm calculates the cheapest fertiliser combination for your farm',
    desc_bm: 'Algoritma kami mengira kombinasi baja paling murah untuk ladang anda',
    step: '02',
  },
  {
    icon: TrendingUp,
    title_en: 'Save Money',
    title_bm: 'Jimat Wang',
    desc_en: 'Get precise fertiliser list and save up to 40% compared to premium blends',
    desc_bm: 'Dapatkan senarai baja tepat dan jimat sehingga 40% berbanding baja premium',
    step: '03',
  },
];


export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* ── Hero Section ── */}
      <section className="relative h-screen min-h-screen overflow-hidden">
        {/* Animated background image with zoom-out */}
        <motion.img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          {/* Headline */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="block text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg font-serif-display font-bold leading-[1.1] tracking-tight"
          >
            Jimat Baja, Tingkat Hasil
          </motion.span>

          {/* Subtitle */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="block text-base md:text-xl lg:text-2xl font-body font-medium mt-2 text-accent/90"
          >
            Save on Fertiliser, Boost Your Yield
          </motion.span>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-4 text-white/75 font-body text-xs md:text-sm max-w-md leading-relaxed"
          >
            {t(lang,
              'Precise fertiliser recommendations based on real soil science — helping Malaysian farmers save more.',
              'Cadangan baja tepat berdasarkan sains tanah sebenar — membantu petani Malaysia berjimat lebih.'
            )}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-5 flex flex-nowrap items-stretch bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"
          >
            {stats.map((s, i) => (
              <div key={s.value} className={`min-w-[130px] flex-1 text-center px-4 md:px-6 py-3 ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}>
                <span className="block font-body font-bold text-sm md:text-base text-accent whitespace-nowrap">
                  {s.value} <span className="text-xs md:text-sm font-semibold text-white/80">{lang === 'bm' ? s.label_bm : s.label_en}</span>
                </span>
                <span className="block text-white/45 font-body text-[10px] md:text-xs mt-0.5 whitespace-nowrap">
                  {lang === 'bm' ? s.sub_bm : s.sub_en}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA with spring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, type: 'spring', stiffness: 260, damping: 20 }}
            className="mt-6"
          >
            <button
              onClick={onGetStarted}
              className="group px-10 py-4 rounded-full bg-accent text-foreground font-body font-bold text-sm md:text-base flex items-center gap-2.5 shadow-[0_0_24px_hsla(38,92%,50%,0.4)] hover:shadow-[0_0_36px_hsla(38,92%,50%,0.55)] hover:scale-105 active:scale-[0.97] transition-all duration-200"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Light airy lower sections ── */}
      <div className="bg-gradient-landing">

        {/* ── How It Works ── */}
        <section className="relative px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-accent mb-1">
                {t(lang, 'Simple Process', 'Proses Mudah')}
              </p>
              <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground">
                {t(lang, 'How It Works', 'Cara Penggunaan')}
              </h2>
            </motion.div>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-40px' }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="group flex-1 relative"
                  >
                    {/* Arrow connector */}
                    {i < steps.length - 1 && (
                      <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-primary/10 items-center justify-center">
                        <ArrowRight size={12} className="text-primary" />
                      </div>
                    )}

                    <div className="h-full flex flex-col items-center text-center bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <span className="font-body text-[10px] font-bold tracking-widest text-muted-foreground/40 mb-3">{step.step}</span>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Icon size={26} className="text-primary" strokeWidth={1.5} />
                      </div>
                      <p className="font-body font-semibold text-sm text-foreground">
                        {t(lang, step.title_en, step.title_bm)}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1.5 leading-[1.7] max-w-[200px]">
                        {t(lang, step.desc_en, step.desc_bm)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why BajaJimat — Two-Column Split ── */}
        <section className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Left — Farmer Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: '-60px' }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={farmerImg}
                  alt="Malaysian farmer working in a lush green field"
                  loading="lazy"
                  className="w-full h-[320px] md:h-[440px] object-cover rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]"
                />
              </motion.div>

              {/* Right — Copy & Checklist */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col justify-center space-y-6"
              >
                <h2 className="font-serif-display text-3xl md:text-4xl font-bold text-foreground leading-[1.15]">
                  {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
                </h2>

                <p className="font-body text-base md:text-lg text-muted-foreground leading-[1.9] max-w-md">
                  {t(lang,
                    'Every year, Malaysian farmers waste money buying the wrong or overpriced fertilisers.',
                    'Setiap tahun, petani Malaysia membazir wang membeli baja yang salah atau terlalu mahal.'
                  )}
                </p>

                <p className="font-body font-bold text-sm text-foreground">
                  {t(lang, 'BajaJimat helps you:', 'BajaJimat membantu anda:')}
                </p>

                <ul className="space-y-4">
                  {[
                    { en: 'Identify soil nutrient deficiencies', bm: 'Kenal pasti kekurangan nutrien tanah' },
                    { en: 'Get the most affordable fertiliser recommendations', bm: 'Dapatkan cadangan baja paling berpatutan' },
                    { en: 'Save up to 40% compared to premium blends', bm: 'Jimat sehingga 40% berbanding baja premium' },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: '-30px' }}
                      transition={{ delay: 0.25 + i * 0.1, duration: 0.45 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary">
                          <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="font-body text-sm md:text-base text-foreground leading-[1.7]">
                        {t(lang, item.en, item.bm)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

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
