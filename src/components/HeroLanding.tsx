import { ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import healthyLeaves from '@/assets/healthy-leaves.jpg';
import farmerApp from '@/assets/farmer-app.jpg';

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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative flex-[50] min-h-0">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20 pb-6">
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
          <div className="mt-4 flex items-stretch gap-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 overflow-hidden">
            {stats.map((s, i) => (
              <div key={s.value} className={`flex-1 text-center px-4 md:px-6 py-2.5 ${i < stats.length - 1 ? 'border-r border-white/15' : ''}`}>
                <span className="block text-secondary font-body font-bold text-base md:text-lg">
                  {s.value} <span className="text-[10px] md:text-xs font-semibold text-white/80">{lang === 'bm' ? s.label_bm : s.label_en}</span>
                </span>
                <span className="block text-white/50 font-body text-[9px] md:text-[10px] mt-0.5">
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

      {/* ── Why BajaJimat Section ── */}
      <section className="relative bg-cream-brand flex-[50] min-h-0 px-6 md:px-12 pb-4 pt-1 flex flex-col overflow-hidden">
        <div className="w-full flex-1 min-h-0 flex flex-col">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start flex-1 min-h-0">
            {/* Left — Text */}
            <div className="md:w-[50%] pt-1 flex flex-col">
              <span className="inline-block text-accent font-body font-semibold text-[9px] uppercase tracking-[0.2em] mb-0.5">
                {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
              </span>
              <h2 className="font-serif-display text-lg md:text-xl font-bold text-foreground leading-tight tracking-tight">
                {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
              </h2>
              <div className="mt-2 text-muted-foreground font-body text-[11px] md:text-xs leading-relaxed max-w-md space-y-1.5">
                <p>
                  {t(lang,
                    'Every year, Malaysian farmers waste money buying the wrong or overpriced fertilisers.',
                    'Setiap tahun, petani Malaysia membazir wang membeli baja yang salah atau terlalu mahal.'
                  )}
                </p>
                <p className="font-medium text-foreground">
                  {t(lang, 'BajaJimat helps you:', 'BajaJimat membantu anda:')}
                </p>
                <ul className="space-y-0.5">
                  <li>✅ {t(lang, 'Identify soil nutrient deficiencies', 'Kenal pasti kekurangan nutrien tanah')}</li>
                  <li>✅ {t(lang, 'Get the most affordable fertiliser recommendations', 'Dapatkan cadangan baja paling jimat')}</li>
                  <li>✅ {t(lang, 'Save up to 40% compared to premium blends', 'Jimat sehingga 40% berbanding baja premium')}</li>
                </ul>
              </div>
            </div>

            {/* Right — Images */}
            <div className="md:w-[50%] flex gap-3 min-h-0 h-full items-start pt-1">
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-border shadow-luxe">
                <img
                  src={healthyLeaves}
                  alt={t(lang, 'Healthy palm leaves', 'Daun sawit sihat')}
                  className="w-full h-28 md:h-36 object-contain bg-muted"
                />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-border shadow-luxe">
                <img
                  src={farmerApp}
                  alt={t(lang, 'Farmer using BajaJimat', 'Petani menggunakan BajaJimat')}
                  className="w-full h-28 md:h-36 object-contain bg-muted"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full pt-2 border-t border-border/40 text-center">
          <p className="text-muted-foreground font-body text-[10px]">
            {t(lang, 'Join thousands of Malaysian farmers already saving on fertiliser costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
          </p>
          <p className="text-[9px] text-muted-foreground/50 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
        </div>
      </section>
    </div>
  );
}
const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const stats = [
  { value: '40% Jimat', sub_bm: 'vs baja premium', sub_en: 'vs premium fertiliser' },
  { value: '3 Cara Analisis', sub_bm: 'Laporan, Manual, Foto', sub_en: 'Report, Manual, Photo' },
  { value: '2 Bahasa', sub_bm: 'BM & English', sub_en: 'BM & English' },
];

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative flex-[55] min-h-0">
        <img
          src={heroBg}
          alt="Malaysian palm oil plantation at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

        <div className="relative h-full flex items-end pb-8 md:pb-10 pt-[88px] px-6 md:px-12">
          <div className="w-full max-w-2xl">
            {/* Dual-language headline */}
            <h1
              className="font-serif-display font-bold text-white leading-[1.06] tracking-tight"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
            >
              <span className="block text-[1.8rem] md:text-[2.6rem] lg:text-[3.2rem]">
                Jimat Baja, Tingkat Hasil
              </span>
              <span className="block text-base md:text-xl lg:text-2xl text-secondary font-semibold mt-0.5 opacity-90">
                Save on Fertiliser, Boost Your Yield
              </span>
            </h1>

            <p className="mt-2.5 text-white/85 font-body text-[11px] md:text-sm max-w-lg leading-relaxed">
              {t(lang,
                'Precise fertiliser recommendations based on real soil science — helping Malaysian farmers save more.',
                'Cadangan baja tepat berdasarkan sains tanah sebenar — membantu petani Malaysia berjimat lebih.'
              )}
            </p>

            {/* Stats row */}
            <div className="flex gap-4 md:gap-6 mt-3">
              {stats.map((s) => (
                <div key={s.value} className="text-center">
                  <span className="block text-secondary font-body font-bold text-xs md:text-sm">{s.value}</span>
                  <span className="block text-white/60 font-body text-[9px] md:text-[10px] mt-0.5">
                    {lang === 'bm' ? s.sub_bm : s.sub_en}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                onClick={onGetStarted}
                className="px-8 py-3 rounded-full btn-gradient-primary font-body font-semibold text-sm md:text-base flex items-center gap-2.5 animate-pulse-ring"
              >
                {t(lang, 'Get Started', 'Mulakan')}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wave separator ── */}
      <div className="relative -mt-5 z-10">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 md:h-10" preserveAspectRatio="none">
          <path d="M0 48h1440V18c-120 14-240 22-360 18S840 16 720 12 480 14 360 20 120 36 0 42z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>

      {/* ── Why BajaJimat Section ── */}
      <section className="relative bg-cream-brand flex-[45] min-h-0 px-6 md:px-12 pb-8 pt-1 flex flex-col">
        <div className="absolute top-2 left-4 opacity-[0.04] pointer-events-none">
          <Leaf size={48} className="text-primary -rotate-12" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-[0.03] pointer-events-none">
          <Leaf size={56} className="text-primary rotate-45" />
        </div>

        <div className="w-full flex-1 min-h-0">
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start h-full">
            {/* Left — Text */}
            <div className="md:w-[42%] pt-1">
              <span className="inline-block text-accent font-body font-semibold text-[9px] uppercase tracking-[0.2em] mb-1">
                {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
              </span>
              <h2 className="font-serif-display text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-[1.12] tracking-tight">
                {t(lang, 'Why BajaJimat?', 'Mengapa BajaJimat?')}
              </h2>
              <p className="mt-2 text-muted-foreground font-body text-xs leading-relaxed max-w-sm">
                {t(lang,
                  'Malaysian farmers waste thousands of ringgit every year buying the wrong or overpriced fertilisers. BajaJimat uses AI and mathematical optimization to recommend the cheapest fertiliser combination based on your actual soil nutrient content.',
                  'Petani Malaysia membazir ribuan ringgit setiap tahun membeli baja yang salah atau terlalu mahal. BajaJimat menggunakan AI dan pengoptimum matematik untuk mencadangkan kombinasi baja paling murah berdasarkan kandungan nutrien tanah sebenar anda.'
                )}
              </p>
              <svg className="mt-2 w-16 h-4 text-accent opacity-50" viewBox="0 0 96 24" fill="none">
                <path d="M2 18C20 6 50 4 80 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
                <path d="M74 8l8 4-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right — Images */}
            <div className="md:w-[58%] relative min-h-[140px] md:min-h-[180px]">
              <div className="absolute top-0 left-0 w-[54%] z-10 rounded-2xl overflow-hidden border-[3px] border-beige-brand shadow-luxe">
                <img
                  src={healthyLeaves}
                  alt={t(lang, 'Healthy palm leaves', 'Daun sawit sihat')}
                  className="w-full h-24 md:h-32 object-cover"
                />
              </div>
              <div className="absolute top-6 md:top-5 right-0 w-[50%] z-20 rounded-[1.2rem] overflow-hidden shadow-luxe-hover" style={{ borderRadius: '1.2rem 1.2rem 1.6rem 0.6rem' }}>
                <img
                  src={farmerApp}
                  alt={t(lang, 'Farmer using BajaJimat', 'Petani menggunakan BajaJimat')}
                  className="w-full h-28 md:h-36 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full pt-2 border-t border-border/40 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground font-body text-[10px]">
              {t(lang, 'Join thousands of Malaysian farmers already saving on fertiliser costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
            </p>
            <p className="text-[9px] text-muted-foreground/50 font-body mt-0.5">© 2026 BajaJimat · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
          </div>
        </div>
      </section>
    </div>
  );
}