import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, BrainCircuit, Sprout, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react';
import tabAnalyseBg from '@/assets/tab-analyse-bg.jpg';
import tabOptimiseBg from '@/assets/tab-optimise-bg.jpg';
import tabNourishBg from '@/assets/tab-nourish-bg.jpg';

interface Props {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

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
    detail_en: 'Upload soil report, enter NPK manually, or photograph sick leaves. Our AI reads your data instantly.',
    detail_bm: 'Muat naik laporan tanah, masukkan NPK secara manual, atau foto daun yang sakit. AI kami membaca data anda serta-merta.',
    bg: tabAnalyseBg,
  },
  {
    icon: BrainCircuit,
    title_en: 'Optimise',
    title_bm: 'Optimumkan',
    desc_en: 'AI prevents chemical waste & finds the exact blend.',
    desc_bm: 'AI elak pembaziran kimia & cari campuran tepat.',
    step: '02',
    detail_en: 'Our solver engine calculates the cheapest fertiliser blend that matches your soil\'s exact nutritional gap — no waste, no guesswork.',
    detail_bm: 'Enjin pengoptimum kami mengira campuran baja termurah yang sepadan dengan jurang nutrisi tanah anda — tiada pembaziran, tiada tekaan.',
    bg: tabOptimiseBg,
  },
  {
    icon: Sprout,
    title_en: 'Nourish',
    title_bm: 'Suburkan',
    desc_en: 'Maximize harvest yields to secure local food supply.',
    desc_bm: 'Maksimumkan hasil tuaian untuk jaminan bekalan makanan.',
    step: '03',
    detail_en: 'Apply precision-calculated nutrients. Watch yields grow while cutting costs by up to 40%. Stronger harvests, stronger Malaysia.',
    detail_bm: 'Gunakan nutrien yang dikira tepat. Lihat hasil bertambah sambil jimat sehingga 40%. Tuaian lebih kukuh, Malaysia lebih kuat.',
    bg: tabNourishBg,
  },
];

function ScanAnim() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* Leaf icon */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary" strokeWidth="1.5" stroke="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 8.5-3.5 9.5-11.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 14.5S8 12 10 12c2 0 4 1 4 1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Pulsing scan line */}
      <motion.div
        className="absolute left-2 right-2 h-[2px] rounded-full bg-primary/60"
        animate={{ top: ['20%', '80%', '20%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Outer pulse ring */}
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
        className="absolute bottom-0.5 text-xs font-bold text-accent"
        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        💰
      </motion.div>
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
    <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">
      {/* Mint radial gradient bg */}
      <div className="absolute inset-0 bg-gradient-mint pointer-events-none" />
      {/* Circuit pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M60 0v40M60 80v40M0 60h40M80 60h40M60 40a20 20 0 0120 20 20 20 0 01-20 20 20 20 0 01-20-20 20 20 0 0120-20z" fill="none" stroke="hsl(164,60%,30%)" strokeWidth="1" />
            <circle cx="60" cy="60" r="3" fill="hsl(164,60%,30%)" />
            <circle cx="60" cy="0" r="1.5" fill="hsl(164,60%,30%)" />
            <circle cx="0" cy="60" r="1.5" fill="hsl(164,60%,30%)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-3">
            {t(lang, 'Simple Process', 'Proses Mudah')}
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {t(lang, 'How It Works', 'Cara Penggunaan')}
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => {
            const AnimIcon = animIcons[i];
            return (
              <motion.button
                key={step.step}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15 }}
                onClick={() => openDetail(i)}
                className="group relative flex flex-col items-center text-center p-8 md:p-10 rounded-2xl cursor-pointer
                  bg-card border border-border/30
                  shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06)]
                  hover:-translate-y-2 hover:shadow-[0_16px_50px_-12px_hsla(164,60%,25%,0.18)]
                  active:scale-[0.97] transition-all duration-500"
              >
                {/* Animated icon in pale mint circle */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-primary/12 group-hover:scale-110 transition-all duration-500">
                  <AnimIcon />
                </div>
                <span className="font-body text-[10px] font-bold tracking-[0.3em] text-muted-foreground/40 mb-2">
                  {step.step}
                </span>
                <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {t(lang, step.title_en, step.title_bm)}
                </h3>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-[260px]">
                  {t(lang, step.desc_en, step.desc_bm)}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
              {/* Blurred background image */}
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

              {/* Content card — glassmorphism */}
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
                  {/* Close button */}
                  <button
                    onClick={closeDetail}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>

                  {/* Step badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-5">
                    {steps[activeDetail].step} · {t(lang, steps[activeDetail].title_en, steps[activeDetail].title_bm)}
                  </div>

                  <h3 className="font-serif-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {t(lang, steps[activeDetail].title_en, steps[activeDetail].title_bm)}
                  </h3>
                  <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                    {t(lang, steps[activeDetail].detail_en, steps[activeDetail].detail_bm)}
                  </p>

                  {/* CTA */}
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

                  {/* Dot indicators */}
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

              {/* Prev / Next arrows — interactive */}
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
