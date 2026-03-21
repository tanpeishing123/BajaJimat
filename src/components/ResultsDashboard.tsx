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
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
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
      <div className="min-h-screen bg-cream-brand flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card rounded-3xl p-8 shadow-luxe border border-border max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Check className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-serif-display text-brown-brand font-bold mb-2">
            {t(lang, 'No Deficits Detected!', 'Tiada Kekurangan Dikesan!')}
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            {t(lang, 'Your soil is balanced. Keep up the great work!', 'Tanah anda seimbang. Teruskan usaha!')}
          </p>
          <button onClick={onBack} className="text-primary font-body font-medium flex items-center gap-1 mx-auto hover:underline active:scale-95 transition-transform">
            <ArrowLeft size={16} /> {t(lang, 'Back', 'Kembali')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-cream-brand relative flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-4 py-3.5 bg-cream-brand/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 md:px-6 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-serif-display font-bold text-brown-brand">
            {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full px-4 py-4 space-y-4">

        {/* 1. Voice Summary — large speaker */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-card rounded-3xl p-5 shadow-luxe border border-border"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => speak(result.voice_summary)}
              className={`w-16 h-16 shrink-0 rounded-full bg-primary flex items-center justify-center shadow-lg ring-2 ring-primary/20 transition-all duration-300 active:scale-95 ${isSpeaking ? 'animate-pulse ring-4 ring-primary/30' : 'hover:ring-4 hover:ring-primary/25'}`}
              aria-label="Hear summary"
            >
              <Volume2 size={26} className="text-primary-foreground" />
            </button>
            <div>
              <h2 className="font-serif-display text-base font-bold text-brown-brand leading-tight">
                {t(lang, 'Hear Summary', 'Dengar Ringkasan')}
              </h2>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                {t(lang, 'Tap to listen to your full analysis', 'Ketuk untuk mendengar analisis penuh anda')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2. Confidence badge */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1">
          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-body font-semibold ${confidenceClass}`}>
            {confidenceLabel}
          </span>
          {result.confidence !== 'high' && (
            <p className="text-[10px] italic text-muted-foreground font-body">
              {t(lang,
                'Visual analysis result. Field verification recommended.',
                'Hasil analisis visual. Disyorkan verifikasi lapangan.'
              )}
            </p>
          )}
        </motion.div>

        {/* 3. Radar Chart */}
        <motion.div
          custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-card rounded-3xl p-5 shadow-luxe border border-border"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif-display text-base font-semibold text-brown-brand">
              {t(lang, 'Nutrient Deficit', 'Defisit Nutrien')}
            </h3>
            <SpeakerButton
              text={t(lang,
                `Nitrogen deficit ${result.n_deficit_kg} kg, phosphorus ${result.p_deficit_kg} kg, potassium ${result.k_deficit_kg} kg.`,
                `Defisit nitrogen ${result.n_deficit_kg} kg, fosforus ${result.p_deficit_kg} kg, kalium ${result.k_deficit_kg} kg.`
              )}
              lang={lang}
            />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="nutrient"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 600 }}
                />
                <PolarRadiusAxis domain={[0, maxVal]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="hsl(160, 84%, 19%)"
                  fill="hsl(160, 84%, 19%)"
                  fillOpacity={0.35}
                  strokeWidth={2.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-1">
            {radarData.map(d => (
              <div key={d.nutrient} className="text-center">
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{d.nutrient}</p>
                <p className="text-sm font-semibold text-foreground font-body tabular-nums">{d.value} kg/ha</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4. Recommendation cards */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <motion.div
              key={rec.name}
              custom={3 + i * 0.15}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-beige-brand/60 rounded-2xl p-4 border-l-[3px] border-primary/70 flex items-center justify-between"
            >
              <div>
                <p className="font-body font-semibold text-foreground text-sm">{rec.name}</p>
                <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                  {rec.bags} {t(lang, 'bags', 'beg')} @ RM {rec.price_per_bag}/{t(lang, 'bag', 'beg')} = RM {rec.subtotal_rm}
                </p>
              </div>
              <p className="font-body font-bold text-primary text-lg tabular-nums">
                RM {rec.subtotal_rm}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 5. Total cost */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="flex justify-between items-center px-1 pt-2 border-t border-border/60"
        >
          <span className="font-body font-semibold text-foreground text-sm">{t(lang, 'Total Cost', 'Jumlah Kos')}</span>
          <span className="font-body font-bold text-primary text-xl tabular-nums">RM {result.total_cost_rm}</span>
        </motion.div>

        {/* 6. Savings banner */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-primary rounded-3xl p-5 shadow-luxe relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent/15 rounded-full -translate-y-10 translate-x-10" />
          <p className="text-primary-foreground/80 font-body text-xs mb-1">
            💰 {t(lang, 'Savings', 'Penjimatan')}
          </p>
          <p className="text-3xl font-serif-display font-bold text-accent tabular-nums relative z-10">
            RM {result.savings_rm}
          </p>
          <div className="mt-2 flex justify-center">
            <SpeakerButton
              text={t(lang, `You save RM ${result.savings_rm} compared to premium blends`, `Anda jimat RM ${result.savings_rm} berbanding baja premium`)}
              lang={lang}
            />
          </div>
        </motion.div>

        {/* 7. Back button */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3 pb-8">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-[hsl(40,55%,90%)] text-brown-brand font-body font-semibold text-sm flex items-center justify-center gap-1.5 transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
          >
            <ArrowLeft size={15} />
            {t(lang, 'Back', 'Kembali')}
          </button>

          {/* 8. Footnote */}
          <p className="text-[10px] text-muted-foreground font-body text-center leading-relaxed">
            {t(lang,
              'Prices based on current market data.\nConfirm with your local supplier.',
              'Harga berdasarkan data pasaran semasa.\nSahkan dengan pembekal tempatan anda.'
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
