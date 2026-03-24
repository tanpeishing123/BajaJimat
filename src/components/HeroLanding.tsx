import { ArrowRight } from 'lucide-react';
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

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="h-screen flex flex-col overflow-auto">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[55vh]">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20 pb-10">
          {/* Dual-language headline */}
          <h1 className="font-serif-display font-bold text-white leading-tight tracking-tight">
            <span className="block text-2xl md:text-4xl lg:text-5xl">
              Jimat Baja, Tingkat Hasil
            </span>
            <span className="block text-sm md:text-lg lg:text-xl text-secondary font-semibold mt-1 opacity-90">
              Save on Fertiliser, Boost Your Yield
            </span>
          </h1>

          <p className="mt-3 text-white/80 font-body text-[11px] md:text-sm max-w-lg leading-relaxed">
            {t(lang,
              'Precise fertiliser recommendations based on real soil science — helping Malaysian farmers save more.',
              'Cadangan baja tepat berdasarkan sains tanah sebenar — membantu petani Malaysia berjimat lebih.'
            )}
          </p>

          {/* Stats row */}
          <div className="mt-4 flex flex-nowrap items-stretch bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 overflow-visible">
            {stats.map((s, i) => (
              <div key={s.value} className={`min-w-[150px] flex-1 text-center px-4 md:px-6 py-2.5 ${i < stats.length - 1 ? 'border-r border-white/15' : ''}`}>
                <span className="block text-secondary font-body font-bold text-sm md:text-base whitespace-nowrap">
                  {s.value} <span className="text-xs md:text-sm font-semibold text-white/80">{lang === 'bm' ? s.label_bm : s.label_en}</span>
                </span>
                <span className="block text-white/50 font-body text-[10px] md:text-xs mt-0.5 whitespace-nowrap">
                  {lang === 'bm' ? s.sub_bm : s.sub_en}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <button
              onClick={onGetStarted}
              className="px-10 py-3.5 rounded-full btn-gradient-primary font-body font-semibold text-sm md:text-base flex items-center gap-2.5 animate-pulse-ring"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Wave separator ── */}
      <div className="relative -mt-4 z-10">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-5 md:h-8" preserveAspectRatio="none">
          <path d="M0 48h1440V18c-120 14-240 22-360 18S840 16 720 12 480 14 360 20 120 36 0 42z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* ── How It Works Section ── */}
      <section className="relative bg-cream-brand px-6 md:px-12 py-6 flex flex-col">
        <div className="w-full flex flex-col items-center">
          <h2 className="font-serif-display text-lg md:text-xl font-bold text-foreground leading-tight tracking-tight text-center">
            {t(lang, 'How It Works', 'Cara Penggunaan')}
          </h2>

          <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 w-full max-w-3xl">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-2xl mb-2">📸</div>
              <p className="font-body font-semibold text-sm text-foreground">
                {t(lang, 'Analyse Your Soil', 'Analisis Tanah')}
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed max-w-[180px]">
                {t(lang,
                  'Upload soil report, enter NPK values, or take a leaf photo',
                  'Muat naik laporan tanah, masukkan nilai NPK, atau ambil foto daun'
                )}
              </p>
            </div>

            {/* Arrow 1 */}
            <span className="text-primary font-bold text-xl md:mx-3 rotate-90 md:rotate-0 select-none">→</span>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-2xl mb-2">🧮</div>
              <p className="font-body font-semibold text-sm text-foreground">
                {t(lang, 'AI Optimisation', 'Pengoptimuman AI')}
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed max-w-[180px]">
                {t(lang,
                  'Our algorithm calculates the cheapest fertiliser combination for your farm',
                  'Algoritma kami mengira kombinasi baja paling murah untuk ladang anda'
                )}
              </p>
            </div>

            {/* Arrow 2 */}
            <span className="text-primary font-bold text-xl md:mx-3 rotate-90 md:rotate-0 select-none">→</span>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-2xl mb-2">💰</div>
              <p className="font-body font-semibold text-sm text-foreground">
                {t(lang, 'Save Money', 'Jimat Wang')}
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed max-w-[180px]">
                {t(lang,
                  'Get precise fertiliser list and save up to 40% compared to premium blends',
                  'Dapatkan senarai baja tepat dan jimat sehingga 40% berbanding baja premium'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full mt-6 pt-4 border-t border-border/40 text-center">
          <p className="text-muted-foreground font-body text-[10px]">
            {t(lang, 'Join thousands of Malaysian farmers already saving on fertiliser costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
          </p>
          <p className="text-[9px] text-muted-foreground/50 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
        </div>
      </section>
    </div>
  );
}
