import { ArrowLeft, Check, Leaf, Volume2, ChevronRight } from 'lucide-react';
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
  npk: { n: number; p: number; k: number };
  profile: { name: string; crop: string; farmSize: string };
  onBack: () => void;
}

function buildResult(npk: { n: number; p: number; k: number }, profile: { name: string; crop: string; farmSize: string }, lang: 'en' | 'bm'): ResultData {
  const n_deficit_kg = Math.max(0, Math.round((2 - npk.n) * 18));
  const p_deficit_kg = Math.max(0, Math.round((2 - npk.p) * 12));
  const k_deficit_kg = Math.max(0, Math.round((2 - npk.k) * 15));

  const recommendations: ResultData['recommendations'] = [];
  if (n_deficit_kg > 0) {
    const bags = Math.ceil(n_deficit_kg / 10);
    recommendations.push({ name: 'Urea (46-0-0)', bags, price_per_bag: 85, subtotal_rm: bags * 85 });
  }
  if (p_deficit_kg > 0) {
    const bags = Math.ceil(p_deficit_kg / 8);
    recommendations.push({ name: 'TSP (0-46-0)', bags, price_per_bag: 110, subtotal_rm: bags * 110 });
  }
  if (k_deficit_kg > 0) {
    const bags = Math.ceil(k_deficit_kg / 12);
    recommendations.push({ name: 'MOP (0-0-60)', bags, price_per_bag: 95, subtotal_rm: bags * 95 });
  }

  const total_cost_rm = recommendations.reduce((s, r) => s + r.subtotal_rm, 0);
  const savings_rm = Math.round((n_deficit_kg + p_deficit_kg + k_deficit_kg) * 2.8 + 45);
  const confidence: ResultData['confidence'] = npk.n <= 1 || npk.p <= 1 || npk.k <= 1 ? 'high' : npk.n <= 2 ? 'medium' : 'low';

  const voice_summary = lang === 'bm'
    ? `${profile.name}, ladang ${profile.crop} anda memerlukan ${n_deficit_kg} kg nitrogen, ${p_deficit_kg} kg fosforus, dan ${k_deficit_kg} kg kalium sehektar. Jumlah kos RM ${total_cost_rm}. Anda boleh jimat RM ${savings_rm} berbanding baja premium.`
    : `${profile.name}, your ${profile.crop} farm needs ${n_deficit_kg} kg nitrogen, ${p_deficit_kg} kg phosphorus, and ${k_deficit_kg} kg potassium per hectare. Total cost RM ${total_cost_rm}. You can save RM ${savings_rm} compared to premium blends.`;

  return {
    recommendations, total_cost_rm, savings_rm,
    n_deficit_kg, p_deficit_kg, k_deficit_kg,
    input_mode: 'manual', confidence, voice_summary,
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

const inputModeLabels: Record<string, Record<'en' | 'bm', string>> = {
  soil_report: { en: 'Soil Report', bm: 'Laporan Tanah' },
  manual: { en: 'Rapid Test Kit', bm: 'Kit Ujian Pantas' },
  leaf_photo: { en: 'Leaf Photo', bm: 'Foto Daun' },
};

export function ResultsDashboard({ lang, npk, profile, onBack }: Props) {
  const { speak, isSpeaking } = useSpeech(lang);
  const result = buildResult(npk, profile, lang);

  const hasDeficit = result.n_deficit_kg > 0 || result.p_deficit_kg > 0 || result.k_deficit_kg > 0;

  const radarData = [
    { nutrient: 'N', value: result.n_deficit_kg },
    { nutrient: 'P', value: result.p_deficit_kg },
    { nutrient: 'K', value: result.k_deficit_kg },
  ];
  const maxVal = Math.max(result.n_deficit_kg, result.p_deficit_kg, result.k_deficit_kg, 1);

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
    <div className="min-h-screen bg-cream-brand relative">
      {/* Subtle leaf sketches */}
      <div className="absolute top-20 right-4 w-32 h-32 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8">
          <path d="M50 90 C50 90 20 60 20 35 C20 15 50 5 50 5 C50 5 80 15 80 35 C80 60 50 90 50 90Z" />
          <path d="M50 85 L50 10" />
          <path d="M50 30 L35 20" /><path d="M50 45 L65 32" /><path d="M50 60 L35 48" />
        </svg>
      </div>

      {/* Header */}
      <header className="border-b border-border/50 px-4 py-3.5 bg-cream-brand/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-serif-display font-bold text-brown-brand">
            {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Section A: Voice Summary Hero */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-card rounded-3xl p-5 shadow-luxe border border-border relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/5" />
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={() => speak(result.voice_summary)}
              className={`w-14 h-14 shrink-0 rounded-full bg-primary flex items-center justify-center shadow-lg ring-2 ring-primary/20 transition-all duration-300 active:scale-95 ${isSpeaking ? 'animate-pulse ring-4 ring-primary/30' : 'hover:ring-4 hover:ring-primary/25'}`}
              aria-label="Hear summary"
            >
              <Volume2 size={22} className="text-primary-foreground" />
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

        {/* Section B: Confidence & Source */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-[11px] font-body font-medium bg-muted text-muted-foreground border border-border">
            {t(lang, 'Source', 'Sumber')}: {inputModeLabels[result.input_mode]?.[lang] || result.input_mode}
          </span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-body font-semibold ${
            result.confidence === 'high'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          }`}>
            {result.confidence === 'high'
              ? t(lang, 'High Accuracy', 'Ketepatan Tinggi')
              : result.confidence === 'medium'
              ? t(lang, 'Medium Accuracy', 'Ketepatan Sederhana')
              : t(lang, 'Low Accuracy', 'Ketepatan Rendah')}
          </span>
          {result.confidence !== 'high' && (
            <p className="text-[10px] italic text-muted-foreground font-body w-full mt-1 flex items-center gap-1">
              <Leaf size={10} className="text-primary/60 shrink-0" />
              {t(lang,
                'Visual analysis result. Field verification recommended.',
                'Hasil analisis visual. Disyorkan verifikasi lapangan.'
              )}
            </p>
          )}
        </motion.div>

        {/* Section C: Radar Chart */}
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
                `Nitrogen deficit ${result.n_deficit_kg} kg, Phosphorus deficit ${result.p_deficit_kg} kg, Potassium deficit ${result.k_deficit_kg} kg`,
                `Kekurangan Nitrogen ${result.n_deficit_kg} kg, Kekurangan Fosforus ${result.p_deficit_kg} kg, Kekurangan Kalium ${result.k_deficit_kg} kg`
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

        {/* Section D: Prescription Cards */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          <h3 className="font-serif-display text-base font-semibold text-brown-brand flex items-center justify-between">
            {t(lang, 'Precision Prescription', 'Preskripsi Tepat')}
            <SpeakerButton
              text={result.recommendations.map(r => `${r.name}, ${r.bags} ${t(lang, 'bags', 'beg')}, RM ${r.subtotal_rm}`).join('. ')}
              lang={lang}
            />
          </h3>
          {result.recommendations.map((rec, i) => (
            <motion.div
              key={rec.name}
              custom={3.5 + i * 0.15}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-beige-brand/60 rounded-2xl p-4 border-l-[3px] border-primary/70 flex items-center justify-between"
            >
              <div>
                <p className="font-body font-semibold text-foreground text-sm">{rec.name}</p>
                <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                  {rec.bags} {t(lang, 'bags', 'beg')} × RM {rec.price_per_bag}
                </p>
              </div>
              <p className="font-body font-bold text-primary text-lg tabular-nums">
                RM {rec.subtotal_rm}
              </p>
            </motion.div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-border/60 px-1">
            <span className="font-body font-semibold text-foreground text-sm">{t(lang, 'Total', 'Jumlah')}</span>
            <span className="font-body font-bold text-primary text-xl tabular-nums">RM {result.total_cost_rm}</span>
          </div>
        </motion.div>

        {/* Section E: Savings Banner */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-primary rounded-3xl p-5 shadow-luxe relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent/15 rounded-full -translate-y-10 translate-x-10" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-primary-foreground/80 font-body text-xs mb-1">
                💰 {t(lang, 'Saved vs Premium Blends', 'Jimat vs Baja Premium')}
              </p>
              <p className="text-3xl font-serif-display font-bold text-accent tabular-nums">
                RM {result.savings_rm}
              </p>
            </div>
            <SpeakerButton
              text={t(lang, `You save RM ${result.savings_rm} compared to premium blends`, `Anda jimat RM ${result.savings_rm} berbanding baja premium`)}
              lang={lang}
            />
          </div>
        </motion.div>

        {/* Section F: Footer */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3 pb-8">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-[#faedcd] text-brown-brand font-body font-semibold text-sm flex items-center justify-center gap-1.5 transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
          >
            <ArrowLeft size={15} />
            {t(lang, 'Re-analyze', 'Analisis Semula')}
          </button>
          <p className="text-[10px] text-muted-foreground font-body text-center leading-relaxed">
            {t(lang,
              'Prices based on market data. Confirm with local suppliers.',
              'Harga berdasarkan data pasaran. Sahkan dengan pembekal.'
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
