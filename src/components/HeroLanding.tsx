import { ArrowRight, Scan, BrainCircuit, TrendingUp, Search, DollarSign, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';

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

const benefits = [
  {
    icon: Search,
    text_en: 'Identify soil nutrient deficiencies',
    text_bm: 'Kenal pasti kekurangan nutrien tanah',
  },
  {
    icon: DollarSign,
    text_en: 'Get the most affordable fertiliser recommendations',
    text_bm: 'Dapatkan cadangan baja paling berpatutan',
  },
  {
    icon: Sprout,
    text_en: 'Save up to 40% compared to premium blends',
    text_bm: 'Jimat sehingga 40% berbanding baja premium',
  },
];
export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-primary/30" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-24 pb-14">
          {/* Dual-language headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-serif-display font-bold leading-[1.1] tracking-tight"
          >
            <span className="block text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg">
              Jimat Baja, Tingkat Hasil
            </span>
            <span className="block text-base md:text-xl lg:text-2xl font-body font-medium mt-2 text-accent/90">
              Save on Fertiliser, Boost Your Yield
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-white/75 font-body text-xs md:text-sm max-w-md leading-relaxed"
          >
            {t(lang,
              'Precise fertiliser recommendations based on real soil science — helping Malaysian farmers save more.',
              'Cadangan baja tepat berdasarkan sains tanah sebenar — membantu petani Malaysia berjimat lebih.'
            )}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
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

      {/* ── Elegant wave separator ── */}
      <div className="relative -mt-6 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12" preserveAspectRatio="none">
          <path d="M0 80h1440V40c-180 20-360 32-540 28S540 40 360 32 120 44 0 56z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* ── How It Works ── */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-primary/70 mb-1">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group flex-1 relative"
                >
                  {/* Connector arrow (desktop only) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-primary/10 items-center justify-center">
                      <ArrowRight size={12} className="text-primary" />
                    </div>
                  )}

                  <div className="h-full flex flex-col items-center text-center bg-card rounded-2xl p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                    {/* Step number */}
                    <span className="font-body text-[10px] font-bold tracking-widest text-primary/40 mb-3">{step.step}</span>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                      <Icon size={26} className="text-primary" strokeWidth={1.5} />
                    </div>

                    <p className="font-body font-semibold text-sm text-foreground">
                      {t(lang, step.title_en, step.title_bm)}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[200px]">
                      {t(lang, step.desc_en, step.desc_bm)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why BajaJimat ── */}
      <section className="bg-[hsl(40_33%_96%)] px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — The Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
            </h2>
            <p className="mt-4 font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              {t(lang,
                'Every year, Malaysian farmers waste money buying the wrong or overpriced fertilisers.',
                'Setiap tahun, petani Malaysia membazir wang membeli baja yang salah atau terlalu mahal.'
              )}
            </p>
          </motion.div>

          {/* Right — Benefits */}
          <div className="flex flex-col gap-3">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-200"
                >
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" strokeWidth={1.8} />
                  </div>
                  <p className="font-body font-medium text-sm text-foreground">
                    {t(lang, item.text_en, item.text_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-cream-brand px-6 py-6 border-t border-border/30 text-center">
        <p className="text-muted-foreground font-body text-[10px]">
          {t(lang, 'Join thousands of Malaysian farmers already saving on fertiliser costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
        </p>
        <p className="text-[9px] text-muted-foreground/50 font-body mt-0.5">
          © 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}
