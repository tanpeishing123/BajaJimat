import { ArrowRight, Scan, BrainCircuit, TrendingUp, Search, DollarSign, Sprout } from 'lucide-react';
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

const benefits = [
  {
    icon: Search,
    text_en: 'Identify soil nutrient deficiencies',
    text_bm: 'Kenal pasti kekurangan nutrien tanah',
    desc_en: 'Pinpoint exactly what your soil is missing for optimal crop growth.',
    desc_bm: 'Kenal pasti dengan tepat apa yang kurang dalam tanah anda.',
  },
  {
    icon: DollarSign,
    text_en: 'Most affordable recommendations',
    text_bm: 'Cadangan paling berpatutan',
    desc_en: 'Get the cheapest fertiliser mix tailored to your soil\'s needs.',
    desc_bm: 'Dapatkan campuran baja paling murah mengikut keperluan tanah anda.',
  },
  {
    icon: Sprout,
    text_en: 'Save up to 40%',
    text_bm: 'Jimat sehingga 40%',
    desc_en: 'Compared to premium blends — same results, lower cost.',
    desc_bm: 'Berbanding baja premium — hasil sama, kos lebih rendah.',
  },
];

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* ── Hero Section ── */}
      <section className="relative h-screen min-h-screen overflow-hidden">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
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

      {/* ── Light airy lower sections ── */}
      <div className="bg-gradient-landing">

        {/* ── How It Works ── */}
        <section className="relative px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
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
                    viewport={{ once: true, margin: '-40px' }}
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

        {/* ── Why BajaJimat — Bento Grid ── */}
        <section className="relative px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-serif-display text-3xl md:text-4xl font-bold text-foreground">
                {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
              </h2>
              <p className="mt-3 font-body text-base md:text-lg text-muted-foreground leading-[1.8] max-w-xl mx-auto">
                {t(lang,
                  'Every year, Malaysian farmers waste money buying the wrong or overpriced fertilisers.',
                  'Setiap tahun, petani Malaysia membazir wang membeli baja yang salah atau terlalu mahal.'
                )}
              </p>
            </motion.div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {/* Large feature card — spans 2 cols */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="md:col-span-2 group"
              >
                <div className="h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-8 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={farmerImg}
                    alt="Malaysian farmer working in a lush green field"
                    loading="lazy"
                    className="w-full md:w-48 h-40 md:h-48 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Search size={20} className="text-primary" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-body font-bold text-lg text-foreground leading-tight">
                      {t(lang, 'Localised for Malaysian Soil', 'Khusus untuk Tanah Malaysia')}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mt-2 leading-[1.8]">
                      {t(lang,
                        'Identify soil nutrient deficiencies with analysis built specifically for Malaysian crop conditions and soil types.',
                        'Kenal pasti kekurangan nutrien tanah dengan analisis yang dibina khusus untuk keadaan tanaman dan jenis tanah Malaysia.'
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Tall card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:row-span-2 group"
              >
                <div className="h-full bg-primary rounded-2xl p-8 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Sprout size={20} className="text-accent" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-body font-bold text-lg text-primary-foreground leading-tight">
                      {t(lang, 'Save Up to 40%', 'Jimat Sehingga 40%')}
                    </h3>
                    <p className="font-body text-sm text-primary-foreground/70 mt-2 leading-[1.8]">
                      {t(lang,
                        'Compared to premium blends — same results, lower cost. Our optimizer finds the cheapest combination that meets your soil\'s exact needs.',
                        'Berbanding baja premium — hasil sama, kos lebih rendah. Pengoptimum kami mencari kombinasi termurah yang memenuhi keperluan tepat tanah anda.'
                      )}
                    </p>
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-body font-extrabold text-5xl text-accent">40%</span>
                    <span className="font-body text-sm text-primary-foreground/60">{t(lang, 'avg. savings', 'purata jimat')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Bottom-left cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="group"
              >
                <div className="h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BrainCircuit size={20} className="text-primary" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-body font-bold text-sm text-foreground">
                    {t(lang, 'AI-Driven Precision', 'Ketepatan Dipacu AI')}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-1.5 leading-[1.7]">
                    {t(lang,
                      'Smart algorithms optimise fertiliser ratios for maximum yield at minimum cost.',
                      'Algoritma pintar mengoptimumkan nisbah baja untuk hasil maksimum pada kos minimum.'
                    )}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="group"
              >
                <div className="h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <DollarSign size={20} className="text-primary" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-body font-bold text-sm text-foreground">
                    {t(lang, 'Maximised ROI', 'ROI Dimaksimumkan')}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-1.5 leading-[1.7]">
                    {t(lang,
                      'Get the most affordable fertiliser recommendations tailored to your farm.',
                      'Dapatkan cadangan baja paling berpatutan yang disesuaikan untuk ladang anda.'
                    )}
                  </p>
                </div>
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
