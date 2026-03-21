import { ArrowLeft, Check, Volume2, Globe, Sprout } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { useSpeech } from '@/hooks/useSpeech';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface ResultData {
  recommendations: { name: string; bags: number; price_per_bag: number; subtotal_rm: number }[];
  total_cost_rm: number;
  savings_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  input_mode: 'soil_report' | 'manual' | 'leaf_photo';
  confidence: 'high' | 'medium' | 'low';
  voice_summary: string;
}

interface Props {
  lang: 'en' | 'bm';
  result: ResultData;
  onBack: () => void;
  onToggleLang?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ResultsDashboard({ lang, result, onBack, onToggleLang }: Props) {
  const { speak, isSpeaking } = useSpeech(lang);

  const hasDeficit = result.n_deficit_kg > 0 || result.p_deficit_kg > 0 || result.k_deficit_kg > 0;

  const radarData = [
    { nutrient: 'N', value: result.n_deficit_kg },
    { nutrient: 'P', value: result.p_deficit_kg },
    { nutrient: 'K', value: result.k_deficit_kg },
  ];
  const maxVal = Math.max(result.n_deficit_kg, result.p_deficit_kg, result.k_deficit_kg, 1);

  const confidenceLabel = result.confidence === 'high'
    ? t(lang, 'High Accuracy', 'Ketepatan Tinggi')
    : result.confidence === 'medium'
    ? t(lang, 'Medium Accuracy', 'Ketepatan Sederhana')
    : t(lang, 'Low Accuracy', 'Ketepatan Rendah');

  const confidenceClass = result.confidence === 'high'
    ? 'bg-primary text-primary-foreground'
    : result.confidence === 'medium'
    ? 'bg-yellow-400 text-yellow-900'
    : 'bg-orange-400 text-orange-900';

  const modeLabel = result.input_mode === 'soil_report'
    ? t(lang, 'Soil Report', 'Laporan Tanah')
    : result.input_mode === 'manual'
    ? t(lang, 'Test Kit', 'Kit Ujian')
    : t(lang, 'Leaf Photo', 'Foto Daun');

  if (!hasDeficit) {
    return (
      <div className="h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fdfbf7' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card p-8 shadow-luxe border border-border w-full max-w-md text-center"
          style={{ borderRadius: '2rem 1.2rem 2.4rem 1rem' }}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Check className="text-primary" size={28} />
          </div>
          <h2 className="text-xl font-serif-display text-foreground font-bold mb-2">
            {t(lang, 'No Deficits Detected!', 'Tiada Kekurangan Dikesan!')}
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-4">
            {t(lang, 'Your soil is balanced.', 'Tanah anda seimbang.')}
          </p>
          <button onClick={onBack} className="text-primary font-body font-medium flex items-center gap-1 mx-auto hover:underline active:scale-95 transition-transform text-sm">
            <ArrowLeft size={14} /> {t(lang, 'Back', 'Kembali')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#fdfbf7' }}>
      {/* Mini-Hero Header — mirrors homepage emerald hero */}
      <div className="relative flex-shrink-0" style={{ backgroundColor: '#065f46' }}>
        {/* Navbar */}
        <nav className="relative z-20 w-full px-4 md:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button onClick={onBack} className="text-white/70 hover:text-white transition-colors active:scale-95 mr-1">
              <ArrowLeft size={16} />
            </button>
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
              <Sprout className="text-white" size={14} />
            </div>
            <span className="font-serif-display text-sm font-bold text-white tracking-tight">BajaJimat</span>
          </div>
          <div className="flex items-center gap-2">
            {onToggleLang && (
              <button onClick={onToggleLang} className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/30 text-[10px] font-body font-medium text-white/80 hover:text-white hover:border-white/50 transition-all duration-200 active:scale-95">
                <Globe size={10} />
                {lang === 'en' ? 'BM' : 'EN'}
              </button>
            )}
          </div>
        </nav>

        {/* Title area */}
        <div className="relative z-20 px-4 md:px-8 pb-8 pt-1">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-display text-lg md:text-xl font-bold text-white"
          >
            {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
          </motion.h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-white/60 font-body">{t(lang, 'Source', 'Sumber')}: {modeLabel}</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-body font-semibold ${confidenceClass}`}>
              {confidenceLabel}
            </span>
          </div>
          {result.confidence !== 'high' && (
            <p className="text-[9px] italic text-white/50 font-body mt-1">
              {t(lang, 'Visual analysis result. Field verification recommended.', 'Hasil analisis visual. Disyorkan verifikasi lapangan.')}
            </p>
          )}
        </div>

        {/* Wavy divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-[1px]">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-[30px] md:h-[40px]">
            <path d="M0,20 C240,45 480,0 720,25 C960,50 1200,5 1440,20 L1440,50 L0,50 Z" fill="#fdfbf7" />
          </svg>
        </div>
      </div>

      {/* Content below wave */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 relative z-20">
        {/* Organic leaf accents */}
        <svg className="absolute bottom-8 -right-6 w-36 h-36 opacity-[0.025] pointer-events-none rotate-12" viewBox="0 0 200 200" fill="none">
          <path d="M60 180C20 140 10 80 50 40s90-20 120 20c30 40 10 100-30 120S100 220 60 180z" stroke="#faedcd" strokeWidth="1.5" />
        </svg>
        <svg className="absolute bottom-4 -left-8 w-28 h-28 opacity-[0.02] pointer-events-none -rotate-20" viewBox="0 0 160 160" fill="none">
          <path d="M40 120C15 90 20 40 60 25s80 5 90 45c10 40-10 70-40 75S65 150 40 120z" stroke="#065f46" strokeWidth="1.5" />
        </svg>

        {/* Voice Summary — overlapping the wave */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="relative -mt-5 mb-2.5 bg-card p-3 shadow-luxe border border-border/60"
          style={{ borderRadius: '1.8rem 1rem 1.6rem 0.8rem' }}
        >
          <div className="absolute top-0 left-4 right-6 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, #faedcd80, transparent)' }} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => speak(result.voice_summary)}
              className={`w-11 h-11 shrink-0 rounded-full bg-primary flex items-center justify-center shadow-md ring-2 ring-primary/20 transition-all duration-300 active:scale-95 ${isSpeaking ? 'animate-pulse ring-4 ring-primary/30' : 'hover:ring-4 hover:ring-primary/20'}`}
              aria-label="Hear summary"
            >
              <Volume2 size={18} className="text-primary-foreground" />
            </button>
            <div>
              <h2 className="font-serif-display text-sm font-bold text-foreground leading-tight">
                {t(lang, 'Hear Summary', 'Dengar Ringkasan')}
              </h2>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                {t(lang, 'Tap to listen to your prescription', 'Ketuk untuk dengar preskripsi anda')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Row: Radar (left) + Recommendations (right) */}
        <div className="flex gap-2.5 mb-2.5 min-h-0">
          {/* Radar Chart */}
          <motion.div
            custom={0.8} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-[3] bg-card p-2.5 shadow-luxe border border-border/60 relative flex flex-col"
            style={{ borderRadius: '1rem 2rem 0.8rem 1.6rem' }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="font-serif-display text-[11px] font-semibold text-foreground">
                {t(lang, 'Nutrient Deficit', 'Defisit Nutrien')}
              </h3>
              <SpeakerButton
                text={t(lang,
                  `Nitrogen deficit ${result.n_deficit_kg} kg, phosphorus ${result.p_deficit_kg} kg, potassium ${result.k_deficit_kg} kg.`,
                  `Defisit nitrogen ${result.n_deficit_kg} kg, fosforus ${result.p_deficit_kg} kg, kalium ${result.k_deficit_kg} kg.`
                )}
                lang={lang}
                size="sm"
              />
            </div>
            <div className="flex-1 min-h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'hsl(var(--foreground))', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, maxVal]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#065f46" fill="#065f46" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-5 mt-0.5">
              {radarData.map(d => (
                <div key={d.nutrient} className="text-center">
                  <p className="text-[8px] text-muted-foreground font-body uppercase tracking-wider">{d.nutrient}</p>
                  <p className="text-[11px] font-semibold text-foreground font-body tabular-nums">{d.value} kg</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            custom={1.2} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-[2] flex flex-col gap-1.5"
          >
            <h3 className="font-serif-display text-[11px] font-semibold text-foreground mb-0.5">
              {t(lang, 'Prescription', 'Preskripsi')}
            </h3>
            {result.recommendations.map((rec, i) => (
              <motion.div
                key={rec.name}
                custom={1.4 + i * 0.12}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full px-3 py-2 border-l-[3px] border-primary/60 shadow-luxe flex items-center justify-between"
                style={{
                  backgroundColor: '#faedcd',
                  borderRadius: i % 2 === 0 ? '0.6rem 1.4rem 0.8rem 1rem' : '1rem 0.6rem 1.2rem 0.8rem',
                }}
              >
                <div>
                  <p className="font-body font-semibold text-foreground text-[11px]">{rec.name}</p>
                  <p className="text-[9px] text-muted-foreground font-body">
                    {rec.bags} {t(lang, 'bags', 'beg')} @ RM{rec.price_per_bag}/{t(lang, 'bag', 'beg')}
                  </p>
                </div>
                <p className="font-body font-bold text-primary text-sm tabular-nums shrink-0 ml-2">
                  RM {rec.subtotal_rm}
                </p>
              </motion.div>
            ))}

            <div className="flex justify-between items-center px-1.5 pt-1 border-t border-border/50">
              <span className="font-body font-semibold text-foreground text-[10px]">{t(lang, 'Total', 'Jumlah')}</span>
              <span className="font-body font-bold text-primary text-base tabular-nums">RM {result.total_cost_rm}</span>
            </div>
          </motion.div>
        </div>

        {/* Savings Banner */}
        <motion.div
          custom={2.2} variants={fadeUp} initial="hidden" animate="visible"
          className="w-full px-5 py-2.5 shadow-luxe relative overflow-hidden flex items-center justify-between mb-2"
          style={{ backgroundColor: '#065f46', borderRadius: '1.4rem 2rem 1rem 2.2rem' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-15 -translate-y-8 translate-x-8" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
          <div>
            <p className="text-white/60 font-body text-[9px]">
              💰 {t(lang, 'Savings vs Premium Blends', 'Penjimatan vs Baja Premium')}
            </p>
            <p className="text-xl font-serif-display font-bold tabular-nums relative z-10" style={{ color: '#f59e0b' }}>
              RM {result.savings_rm}
            </p>
          </div>
          <SpeakerButton
            text={t(lang, `You save RM ${result.savings_rm}`, `Anda jimat RM ${result.savings_rm}`)}
            lang={lang}
            size="sm"
          />
        </motion.div>

        {/* Footer */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 pb-3">
          <button
            onClick={onBack}
            className="flex-1 py-2 font-body font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
            style={{ backgroundColor: '#faedcd', color: '#2d1a12', borderRadius: '1rem 1.6rem 0.8rem 1.4rem' }}
          >
            <ArrowLeft size={12} />
            {t(lang, 'Re-analyze', 'Analisis Semula')}
          </button>
          <p className="flex-1 text-[8px] text-muted-foreground font-body text-center leading-relaxed">
            {t(lang,
              'Prices based on current market data. Confirm with your local supplier.',
              'Harga berdasarkan data pasaran semasa. Sahkan dengan pembekal tempatan anda.'
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
