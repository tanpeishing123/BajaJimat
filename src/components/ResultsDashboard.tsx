import { ArrowLeft, Check, Volume2 } from 'lucide-react';
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
}

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ResultsDashboard({ lang, result, onBack }: Props) {
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
      {/* Organic accents */}
      <svg className="absolute top-16 -right-10 w-48 h-48 opacity-[0.025] pointer-events-none rotate-12" viewBox="0 0 200 200" fill="none">
        <path d="M60 180C20 140 10 80 50 40s90-20 120 20c30 40 10 100-30 120S100 220 60 180z" stroke="hsl(var(--accent))" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-20 -left-10 w-40 h-40 opacity-[0.02] pointer-events-none -rotate-20" viewBox="0 0 160 160" fill="none">
        <path d="M40 120C15 90 20 40 60 25s80 5 90 45c10 40-10 70-40 75S65 150 40 120z" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      </svg>

      {/* Header */}
      <header className="border-b border-border/40 px-4 md:px-8 py-2.5 flex-shrink-0 z-50" style={{ backgroundColor: 'rgba(253,251,247,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-sm font-serif-display font-bold text-foreground">
            {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-3 space-y-2.5">

        {/* Row 1: Voice + Confidence side by side */}
        <div className="flex gap-2.5">
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-1 bg-card p-3 shadow-luxe border border-border/60 relative overflow-hidden"
            style={{ borderRadius: '1.8rem 1rem 1.6rem 0.8rem' }}
          >
            <div className="absolute top-0 left-4 right-6 h-[1px] bg-accent/20" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => speak(result.voice_summary)}
                className={`w-11 h-11 shrink-0 rounded-full bg-primary flex items-center justify-center shadow-md ring-2 ring-primary/20 transition-all duration-300 active:scale-95 ${isSpeaking ? 'animate-pulse-ring ring-4 ring-primary/30' : 'hover:ring-4 hover:ring-primary/20'}`}
                aria-label="Hear summary"
              >
                <Volume2 size={18} className="text-primary-foreground" />
              </button>
              <div>
                <h2 className="font-serif-display text-sm font-bold text-foreground leading-tight">
                  {t(lang, 'Hear Summary', 'Dengar Ringkasan')}
                </h2>
                <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                  {t(lang, 'Tap to listen', 'Ketuk untuk dengar')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={0.3} variants={fadeUp} initial="hidden" animate="visible"
            className="w-32 md:w-40 flex flex-col justify-center items-start p-3 bg-card shadow-luxe border border-border/60"
            style={{ borderRadius: '0.8rem 1.6rem 1rem 1.8rem' }}
          >
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-body font-semibold ${confidenceClass}`}>
              {confidenceLabel}
            </span>
            {result.confidence !== 'high' && (
              <p className="text-[9px] italic text-muted-foreground font-body mt-1 leading-tight">
                {t(lang, 'Field verification recommended.', 'Disyorkan verifikasi lapangan.')}
              </p>
            )}
          </motion.div>
        </div>

        {/* Row 2: Radar + Recommendations */}
        <div className="flex gap-2.5 min-h-0">
          {/* Radar */}
          <motion.div
            custom={0.8} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-[3] bg-card p-3 shadow-luxe border border-border/60 relative flex flex-col"
            style={{ borderRadius: '1rem 2rem 0.8rem 1.6rem' }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif-display text-xs font-semibold text-foreground">
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
            <div className="flex-1 min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, maxVal]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-0.5">
              {radarData.map(d => (
                <div key={d.nutrient} className="text-center">
                  <p className="text-[9px] text-muted-foreground font-body uppercase tracking-wider">{d.nutrient}</p>
                  <p className="text-xs font-semibold text-foreground font-body tabular-nums">{d.value} kg</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations — full-width cards */}
          <motion.div
            custom={1.2} variants={fadeUp} initial="hidden" animate="visible"
            className="flex-[2] flex flex-col gap-2"
          >
            {result.recommendations.map((rec, i) => (
              <motion.div
                key={rec.name}
                custom={1.4 + i * 0.12}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="w-full px-4 py-2.5 border-l-[3px] border-primary/60 shadow-luxe flex items-center justify-between"
                style={{
                  backgroundColor: '#faedcd',
                  borderRadius: i % 2 === 0 ? '0.6rem 1.4rem 0.8rem 1rem' : '1rem 0.6rem 1.2rem 0.8rem',
                }}
              >
                <div>
                  <p className="font-body font-semibold text-foreground text-xs">{rec.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body">
                    {rec.bags} {t(lang, 'bags', 'beg')} @ RM{rec.price_per_bag}/{t(lang, 'bag', 'beg')}
                  </p>
                </div>
                <p className="font-body font-bold text-primary text-base tabular-nums shrink-0 ml-3">
                  RM {rec.subtotal_rm}
                </p>
              </motion.div>
            ))}

            {/* Total */}
            <div className="flex justify-between items-center px-2 pt-1.5 border-t border-border/50">
              <span className="font-body font-semibold text-foreground text-xs">{t(lang, 'Total Cost', 'Jumlah Kos')}</span>
              <span className="font-body font-bold text-primary text-lg tabular-nums">RM {result.total_cost_rm}</span>
            </div>
          </motion.div>
        </div>

        {/* Savings Banner */}
        <motion.div
          custom={2.2} variants={fadeUp} initial="hidden" animate="visible"
          className="w-full bg-primary px-6 py-3.5 shadow-luxe relative overflow-hidden flex items-center justify-between"
          style={{ borderRadius: '1.4rem 2rem 1rem 2.2rem' }}
        >
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 -translate-y-10 translate-x-10" style={{ background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)' }} />
          <div>
            <p className="text-primary-foreground/70 font-body text-[10px]">
              💰 {t(lang, 'Savings vs Premium Blends', 'Penjimatan vs Baja Premium')}
            </p>
            <p className="text-2xl font-serif-display font-bold text-accent tabular-nums relative z-10">
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
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 pb-4">
          <button
            onClick={onBack}
            className="flex-1 py-2 font-body font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
            style={{ backgroundColor: '#faedcd', color: '#2d1a12', borderRadius: '1rem 1.6rem 0.8rem 1.4rem' }}
          >
            <ArrowLeft size={13} />
            {t(lang, 'Re-analyze', 'Analisis Semula')}
          </button>
          <p className="flex-1 text-[9px] text-muted-foreground font-body text-center leading-relaxed">
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
