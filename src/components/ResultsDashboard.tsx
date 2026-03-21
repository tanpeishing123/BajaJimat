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
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ResultsDashboard({ lang, result, onBack, onToggleLang }: Props) {
  const { speak, isSpeaking } = useSpeech(lang);

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
    <div className="h-screen flex flex-col bg-background">
      {/* Clean Header */}
      <header className="bg-white border-b border-border/60 px-6 py-4 flex-shrink-0">
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-6 space-y-5">

          {/* Title + Badges */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${confidenceColor}`}>
                {confidenceLabel}
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-sans font-medium">
                {modeLabel}
              </span>
            </div>
            <h1 className="font-sans text-2xl font-bold text-foreground">
              {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
            </h1>
            {result.confidence !== 'high' && (
              <p className="text-xs text-muted-foreground font-sans mt-1">
                {t(lang, 'Visual analysis result. Field verification recommended.', 'Hasil analisis visual. Disyorkan verifikasi lapangan.')}
              </p>
            )}
          </motion.div>

          {/* Voice Summary Card */}
          <motion.div
            custom={0.5} variants={fadeUp} initial="hidden" animate="visible"
            className="bg-primary rounded-2xl p-5 flex items-center gap-4"
          >
            <button
              onClick={() => speak(result.voice_summary)}
              className={`w-12 h-12 shrink-0 rounded-xl bg-white/20 flex items-center justify-center transition-all duration-300 active:scale-95 ${isSpeaking ? 'animate-pulse-ring' : 'hover:bg-white/30'}`}
              aria-label="Hear summary"
            >
              <Volume2 size={20} className="text-white" />
            </button>
            <div>
              <h2 className="font-sans text-base font-bold text-white">
                {t(lang, 'Hear Your Prescription', 'Dengar Preskripsi Anda')}
              </h2>
              <p className="text-sm text-white/70 font-sans mt-0.5">
                {t(lang, 'Tap to listen in your language', 'Ketuk untuk dengar dalam bahasa anda')}
              </p>
            </div>
          </motion.div>

          {/* Two Column: Radar + Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Radar Chart */}
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingDown size={16} className="text-primary" />
                  </div>
                  <h3 className="font-sans text-sm font-bold text-foreground">
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
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis domain={[0, maxVal]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                {radarData.map(d => (
                  <div key={d.nutrient} className="text-center">
                    <p className="text-xs text-muted-foreground font-sans">{d.nutrient}</p>
                    <p className="text-sm font-bold text-foreground font-sans tabular-nums">{d.value} kg</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              custom={1.2} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-white rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package size={16} className="text-primary" />
                </div>
                <h3 className="font-sans text-sm font-bold text-foreground">
                  {t(lang, 'Fertilizer Prescription', 'Preskripsi Baja')}
                </h3>
              </div>

              <div className="space-y-2.5 flex-1">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={rec.name}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30"
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

              <div className="flex justify-between items-center pt-3 mt-3 border-t border-border/50">
                <span className="font-sans font-semibold text-foreground text-sm">{t(lang, 'Total Cost', 'Jumlah Kos')}</span>
                <span className="font-sans font-bold text-foreground text-lg tabular-nums">RM{result.total_cost_rm}</span>
              </div>
            </motion.div>
          </div>

          {/* Savings Banner */}
          <motion.div
            custom={1.8} variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-2xl p-5 btn-gradient-primary flex items-center justify-between"
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
                  RM{result.savings_rm}
                </p>
              </div>
            </div>
            <SpeakerButton
              text={t(lang, `You save RM ${result.savings_rm}`, `Anda jimat RM ${result.savings_rm}`)}
              lang={lang}
              size="sm"
            />
          </motion.div>

          {/* Footer Actions */}
          <motion.div custom={2.2} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 pb-4">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 btn-secondary-outline"
            >
              <ArrowLeft size={14} />
              {t(lang, 'New Analysis', 'Analisis Baharu')}
            </button>
            <p className="flex-1 text-xs text-muted-foreground font-sans text-center leading-relaxed">
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
