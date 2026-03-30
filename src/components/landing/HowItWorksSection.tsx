import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, BrainCircuit, Sprout, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react';
import tabAnalyseBg from '@/assets/tab-analyse-bg.jpg';
import tabOptimiseBg from '@/assets/tab-optimise-bg.jpg';
import tabNourishBg from '@/assets/tab-nourish-bg.jpg';
import bgProcess from '@/assets/bg-process.jpg';

interface Props {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const steps = [
  {
    icon: Scan,
    title_en: 'Diagnose & Detect',
    title_bm: 'Diagnosis & Kesan',
    desc_en: 'Identify plant health through soil reports, NPK entry, and a single photo.',
    desc_bm: 'Kenal pasti kesihatan tanaman melalui laporan, kemasukan NPK, dan satu foto.',
    step: '01',
    detail_en: 'Upload a soil report, enter NPK values manually, or snap a photo of a sick leaf. Our AI reads your data instantly and identifies issues.',
    detail_bm: 'Muat naik laporan tanah, masukkan nilai NPK secara manual, atau tangkap foto daun yang sakit. AI kami membaca data anda serta-merta dan mengenal pasti masalah.',
    bg: tabAnalyseBg,
  },
  {
    icon: BrainCircuit,
    title_en: 'Optimise & Save',
    title_bm: 'Optimum & Jimat',
    desc_en: 'Get the exact, cost-optimised fertiliser blend your soil needs.',
    desc_bm: 'Dapatkan campuran tepat dan kos optimum yang diperlukan tanah anda.',
    step: '02',
    detail_en: 'Our AI calculates your exact nutrient needs and generates a cost-saving fertiliser shopping list — no waste, no guesswork.',
    detail_bm: 'AI kami mengira keperluan nutrisi tepat anda dan menjana senarai beli baja yang menjimatkan kos — tiada pembaziran, tiada tekaan.',
    bg: tabOptimiseBg,
  },
  {
    icon: Sprout,
    title_en: 'Treat & Time',
    title_bm: 'Rawat & Masa',
    desc_en: 'Access precise, weather-optimised treatment and spraying plans.',
    desc_bm: 'Akses pelan rawatan dan semburan yang tepat dan dioptimumkan mengikut cuaca.',
    step: '03',
    detail_en: 'Get instant disease treatment plans and real-time weather advice on exactly when to apply them. Stronger harvests, stronger Malaysia.',
    detail_bm: 'Dapatkan pelan rawatan penyakit segera dan nasihat cuaca masa nyata tentang bila untuk menggunakannya. Tuaian lebih kukuh, Malaysia lebih kuat.',
    bg: tabNourishBg,
  },
];

function ScanAnim() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <Scan size={28} className="text-primary" strokeWidth={1.5} />
      <motion.div
        className="absolute left-2 right-2 h-[2px] rounded-full bg-primary/60"
        animate={{ top: ['20%', '80%', '20%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
    </div>
  );
}

function OptimiseAnim() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <BrainCircuit size={28} className="text-primary" strokeWidth={1.5} />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/15"
        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
      />
    </div>
  );
}

function NourishAnim() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <Sprout size={28} className="text-primary" strokeWidth={1.5} />
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      />
    </div>
  );
}

const animIcons = [ScanAnim, OptimiseAnim, NourishAnim];

export function HowItWorksSection({ lang, onGetStarted }: Props) {
  const [activeDetail, setActiveDetail] = useState<number | null>(null);
  const [swipeDir, setSwipeDir] = useState<1 | -1>(1);
  const touchStart = useRef<number | null>(null);

  const openDetail = (i: number) => {
    setSwipeDir(1);
    setActiveDetail(i);
  };

  const closeDetail = () => setActiveDetail(null);

  const goTo = useCallback(
    (dir: 1 | -1) => {
      if (activeDetail === null) return;
      const next = activeDetail + dir;
      if (next < 0 || next >= steps.length) return;
      setSwipeDir(dir);
      setActiveDetail(next);
    },
    [activeDetail]
  );

  useEffect(() => {
    if (activeDetail === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(1);
      else if (e.key === 'ArrowLeft') goTo(-1);
      else if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeDetail, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 60) goTo(diff < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative px-6 md:px-12 py-28 md:py-36 overflow-hidden">
      <img src={bgProcess} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none" loading="lazy" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-xs font-body font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            {t(lang, 'Simple Process', 'Proses Mudah')}
          </p>
          <h2 className="font-body text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
            {t(lang, 'How It Works', 'Cara Penggunaan')}
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, i) => {
            const AnimIcon = animIcons[i];
            return (
              <motion.button
                key={step.step}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: i * 0.15 }}
                onClick={() => openDetail(i)}
                className="group relative flex flex-col items-center text-center p-10 md:p-12 rounded-3xl cursor-pointer
                  bg-card border border-border/20
                  shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)]
                  hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_hsla(164,60%,25%,0.15)]
                  active:scale-[0.97] transition-all duration-500"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/8 flex items-center justify-center mb-7 group-hover:bg-primary/12 group-hover:scale-110 transition-all duration-500">
                  <AnimIcon />
                </div>
                <span className="text-[10px] font-body font-bold tracking-[0.3em] text-muted-foreground/40 mb-3">
                  {step.step}
                </span>
                <h3 className="font-body text-xl md:text-2xl font-bold text-foreground mb-3">
                  {t(lang, step.title_en, step.title_bm)}
                </h3>
                <p className="text-sm md:text-base font-body text-muted-foreground leading-relaxed max-w-[280px]">
                  {t(lang, step.desc_en, step.desc_bm)}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-body font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t(lang, 'Learn more', 'Ketahui lagi')}
                  <ArrowRight size={12} />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Detail overlay */}
        <AnimatePresence>
          {activeDetail !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              onClick={closeDetail}
            >
              <motion.div
                key={`bg-${activeDetail}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img
                  src={steps[activeDetail].bg}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
              </motion.div>

              <AnimatePresence mode="wait" custom={swipeDir}>
                <motion.div
                  key={activeDetail}
                  custom={swipeDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-2xl
                    bg-white/80 backdrop-blur-xl border border-white/50"
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <button
                    onClick={closeDetail}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-body font-bold mb-5">
                    {steps[activeDetail].step} · {t(lang, steps[activeDetail].title_en, steps[activeDetail].title_bm)}
                  </div>

                  <h3 className="font-body text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {t(lang, steps[activeDetail].title_en, steps[activeDetail].title_bm)}
                  </h3>
                  <p className="text-base md:text-lg font-body text-muted-foreground leading-relaxed mb-8">
                    {t(lang, steps[activeDetail].detail_en, steps[activeDetail].detail_bm)}
                  </p>

                  <button
                    onClick={() => {
                      closeDetail();
                      onGetStarted();
                    }}
                    className="w-full py-3.5 rounded-xl btn-gradient-primary font-body font-bold text-base flex items-center justify-center gap-2"
                  >
                    {t(lang, 'Get Started', 'Mulakan')}
                    <ArrowRight size={18} />
                  </button>

                  <div className="flex items-center justify-center gap-2.5 mt-6">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSwipeDir(i > (activeDetail ?? 0) ? 1 : -1);
                          setActiveDetail(i);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === activeDetail
                            ? 'w-7 bg-primary'
                            : 'w-2 bg-muted-foreground/25 hover:bg-muted-foreground/40'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {activeDetail > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(-1);
                  }}
                  className="nav-arrow absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <ChevronLeft size={22} className="text-white" />
                </button>
              )}
              {activeDetail < steps.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(1);
                  }}
                  className="nav-arrow absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <ChevronRight size={22} className="text-white" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
