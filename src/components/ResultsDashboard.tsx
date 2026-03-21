import { ArrowLeft, Volume2, Globe, Sprout, TrendingDown, Package, Banknote } from 'lucide-react';
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
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* Custom dot for radar vertices */
const RadarDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={4} fill="#34d399" stroke="#065f46" strokeWidth={2} />
  );
};

export function ResultsDashboard({ lang, result, onBack, onToggleLang }: Props) {
  const { speak, isSpeaking } = useSpeech(lang);

  const radarData = [
    { nutrient: 'N', value: result.n_deficit_kg, fullMark: Math.max(result.n_deficit_kg, result.p_deficit_kg, result.k_deficit_kg, 1) },
    { nutrient: 'P', value: result.p_deficit_kg, fullMark: Math.max(result.n_deficit_kg, result.p_deficit_kg, result.k_deficit_kg, 1) },
    { nutrient: 'K', value: result.k_deficit_kg, fullMark: Math.max(result.n_deficit_kg, result.p_deficit_kg, result.k_deficit_kg, 1) },
  ];
  const maxVal = Math.max(result.n_deficit_kg, result.p_deficit_kg, result.k_deficit_kg, 1);

  const confidenceLabel = result.confidence === 'high'
    ? t(lang, 'High Accuracy', 'Ketepatan Tinggi')
    : result.confidence === 'medium'
    ? t(lang, 'Medium Accuracy', 'Ketepatan Sederhana')
    : t(lang, 'Low Accuracy', 'Ketepatan Rendah');

  const confidenceColor = result.confidence === 'high'
    ? 'bg-emerald-100 text-emerald-700'
    : result.confidence === 'medium'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-orange-100 text-orange-700';

  const modeLabel = result.input_mode === 'soil_report'
    ? t(lang, 'Soil Report', 'Laporan Tanah')
    : result.input_mode === 'manual'
    ? t(lang, 'Test Kit', 'Kit Ujian')
    : t(lang, 'Leaf Photo', 'Foto Daun');

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border/60 px-6 md:px-12 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95">
              <ArrowLeft size={16} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <span className="font-sans text-base font-bold text-foreground">BajaJimat</span>
          </div>
          <div className="flex items-center gap-2">
            {onToggleLang && (
              <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
                <Globe size={12} />
                {lang === 'en' ? 'BM' : 'EN'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Full-width content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-4">
        <div className="w-full space-y-4">

          {/* Title row + Voice Summary inline */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${confidenceColor}`}>
                  {confidenceLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-sans font-medium">
                  {modeLabel}
                </span>
              </div>
              <h1 className="font-sans text-xl font-bold text-foreground">
                {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
              </h1>
            </div>
            {/* Compact voice summary */}
            <button
              onClick={() => speak(result.voice_summary)}
              className={`flex items-center gap-3 bg-primary rounded-2xl px-5 py-3 transition-all duration-300 active:scale-97 shrink-0 ${isSpeaking ? 'animate-pulse-ring' : 'hover:brightness-110'}`}
              aria-label="Hear summary"
            >
              <Volume2 size={18} className="text-primary-foreground shrink-0" />
              <span className="font-sans text-sm font-semibold text-primary-foreground">
                {t(lang, 'Hear Summary', 'Dengar Ringkasan')}
              </span>
            </button>
          </motion.div>

          {/* Two Column: Dark Radar + Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Radar Chart - dark themed like reference */}
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="md:col-span-2 rounded-2xl p-5 shadow-sm relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #0a1f1a 0%, #0d2b23 50%, #061a15 100%)' }}
            >
              {/* Subtle radial glow behind chart */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)' }} />
              </div>

              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingDown size={14} className="text-emerald-400" />
                  </div>
                  <h3 className="font-sans text-sm font-bold text-emerald-50">
                    {t(lang, 'Nutrient Deficit', 'Defisit Nutrien')}
                  </h3>
                </div>
                <SpeakerButton
                  text={t(lang,
                    `Nitrogen deficit ${result.n_deficit_kg} kg, phosphorus ${result.p_deficit_kg} kg, potassium ${result.k_deficit_kg} kg.`,
                    `Defisit nitrogen ${result.n_deficit_kg} kg, fosforus ${result.p_deficit_kg} kg, kalium ${result.k_deficit_kg} kg.`
                  )}
                  lang={lang}
                  size="sm"
                />
              </div>

              <div className="h-[200px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="nutrient"
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis domain={[0, maxVal]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} />
                    <Radar
                      dataKey="value"
                      stroke="#34d399"
                      fill="url(#radarGradient)"
                      fillOpacity={0.4}
                      strokeWidth={2.5}
                      dot={<RadarDot />}
                    />
                    <defs>
                      <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#065f46" stopOpacity={0.2} />
                      </radialGradient>
                    </defs>
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Nutrient stats row */}
              <div className="flex justify-center gap-6 mt-1 relative z-10">
                {radarData.map(d => (
                  <div key={d.nutrient} className="text-center">
                    <p className="text-[10px] text-emerald-400/70 font-sans uppercase tracking-wider">{d.nutrient}</p>
                    <p className="text-sm font-bold text-emerald-50 font-sans tabular-nums">{d.value} kg</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations - wider */}
            <motion.div
              custom={1.2} variants={fadeUp} initial="hidden" animate="visible"
              className="md:col-span-3 bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package size={14} className="text-primary" />
                </div>
                <h3 className="font-sans text-sm font-bold text-foreground">
                  {t(lang, 'Fertilizer Prescription', 'Preskripsi Baja')}
                </h3>
              </div>

              <div className="space-y-2 flex-1">
                {result.recommendations.map((rec) => (
                  <div
                    key={rec.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/30 hover:border-primary/20 transition-colors"
                  >
                    <div>
                      <p className="font-sans font-semibold text-foreground text-sm">{rec.name}</p>
                      <p className="text-xs text-muted-foreground font-sans mt-0.5">
                        {rec.bags} {t(lang, 'bags', 'beg')} × RM{rec.price_per_bag}
                      </p>
                    </div>
                    <p className="font-sans font-bold text-primary text-base tabular-nums">
                      RM{rec.subtotal_rm}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 mt-2 border-t border-border/50">
                <span className="font-sans font-semibold text-foreground text-sm">{t(lang, 'Total Cost', 'Jumlah Kos')}</span>
                <span className="font-sans font-bold text-foreground text-lg tabular-nums">RM{result.total_cost_rm}</span>
              </div>
            </motion.div>
          </div>

          {/* Savings Banner - full width */}
          <motion.div
            custom={1.8} variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-2xl px-6 py-4 btn-gradient-primary flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Banknote size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 font-sans text-xs">
                  {t(lang, 'Estimated Savings vs Premium Blends', 'Anggaran Penjimatan vs Baja Premium')}
                </p>
                <p className="text-2xl font-sans font-bold text-white tabular-nums">
                  💰 RM{result.savings_rm} {t(lang, 'Saved!', 'Dijimat!')}
                </p>
              </div>
            </div>
            <SpeakerButton
              text={t(lang, `You saved RM ${result.savings_rm} compared to premium blends.`, `Anda jimat RM ${result.savings_rm} berbanding baja premium.`)}
              lang={lang}
              size="md"
            />
          </motion.div>

          {/* Footer */}
          <motion.div custom={2.2} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 pb-2">
            <button
              onClick={onBack}
              className="flex-1 py-2.5 rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 btn-secondary-outline border-primary/60"
            >
              <ArrowLeft size={14} />
              {t(lang, 'New Analysis', 'Analisis Baharu')}
            </button>
            <p className="flex-1 text-[11px] text-muted-foreground font-sans text-center leading-relaxed">
              {t(lang,
                'Prices based on current market data. Confirm with your local supplier.',
                'Harga berdasarkan data pasaran semasa. Sahkan dengan pembekal tempatan anda.'
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
