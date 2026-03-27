import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Globe, Sprout, TrendingDown, Package, Banknote, AlertTriangle, Loader2, MapPin, Share2, Download, Droplets, ShieldAlert, Lightbulb, Sparkles, CheckCircle2, ShieldCheck, Clock, Leaf } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { useSpeech } from '@/hooks/useSpeech';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface ResultData {
  recommendations: { name: string; bags: number; price_per_bag: number; subtotal_rm: number; is_liming?: boolean; is_mg?: boolean; reason?: string }[];
  total_cost_rm: number;
  savings_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  input_mode: 'soil_report' | 'manual' | 'leaf_photo';
  confidence: 'high' | 'medium' | 'low';
  voice_summary: string;
  liming_needed?: boolean;
  liming_recommendation?: { product: string; bags: number; cost_rm: number; reason: string };
  seasonal_advice?: { advice: string };
  crop_requirements_source?: string;
  soil_type?: string;
}

interface Props {
  lang: 'en' | 'bm';
  result: ResultData;
  cropType?: string;
  plotName?: string;
  farmSize?: string;
  onBack: () => void;
  backLabel?: string;
  onToggleLang?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

const RadarDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#34d399" fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill="#34d399" stroke="#065f46" strokeWidth={2} />
    </g>
  );
};

/* Radial progress gauge for NPK */
function NutrientGauge({ value, maxVal, color, label }: { value: number; maxVal: number; color: string; label: string }) {
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = maxVal > 0 ? Math.min(value / maxVal, 1) : 0;
  const progress = pct * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} opacity={0.3} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</span>
      </div>
      <span className="text-[10px] font-extrabold text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function ResultsDashboard({ lang, result, cropType, plotName, farmSize, onBack, backLabel, onToggleLang }: Props) {
  const { speak, isSpeaking } = useSpeech(lang);
  const [farmTip, setFarmTip] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(false);

  const limingItems = result.recommendations.filter(r => r.is_liming);
  const mgItems = result.recommendations.filter(r => r.is_mg);
  const fertItems = result.recommendations.filter(r => !r.is_liming && !r.is_mg);
  const fertTotalCost = fertItems.reduce((sum, r) => sum + r.subtotal_rm, 0);
  const mgTotalCost = mgItems.reduce((sum, r) => sum + r.subtotal_rm, 0);
  const displayTotalCost = fertTotalCost + mgTotalCost;

  const defaultTip = lang === 'bm'
    ? 'Periksa kelembapan tanah secara berkala untuk hasil optimum.'
    : 'Check soil moisture regularly for optimal yield.';

  useEffect(() => {
    const fetchTip = async () => {
      setTipLoading(true);
      try {
        const crop = localStorage.getItem('crop_type') || cropType || 'general crop';
        const month = new Date().toLocaleString('en', { month: 'long' });
        const tipLang = localStorage.getItem('baja_lang') || lang;
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/farm-tip`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ crop_type: crop, lang: tipLang, month }),
        });
        if (res.ok) {
          const data = await res.json();
          setFarmTip(data.tip || defaultTip);
        } else {
          setFarmTip(defaultTip);
        }
      } catch {
        setFarmTip(defaultTip);
      } finally {
        setTipLoading(false);
      }
    };
    fetchTip();
  }, [cropType, lang]);

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

  const currentDate = new Date().toLocaleDateString(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const buildWhatsAppText = () => {
    const allItems = [...fertItems, ...mgItems];
    const itemLines = allItems.map(r =>
      `• ${r.name}: ${r.bags} ${t(lang, 'bags (25kg)', 'beg (25kg)')} × RM${r.price_per_bag} = RM${r.subtotal_rm}`
    );
    const message = lang === 'bm'
      ? [`*Senarai Baja BajaJimat*`, ``, `Ladang: ${plotName || '-'} | Tanaman: ${cropType || '-'} | ${farmSize || '-'} hektar`, ``, `*Baja Diperlukan:*`, ...itemLines, ``, `Jumlah Kos NPK: RM${fertTotalCost.toFixed(2)}`, `Jimat: RM${result.savings_rm} vs baja premium`, ``, `_Dijana oleh BajaJimat — bajajimat.lovable.app_`]
      : [`*BajaJimat Fertiliser List*`, ``, `Plot: ${plotName || '-'} | Crop: ${cropType || '-'} | ${farmSize || '-'} ha`, ``, `*Fertilisers Needed:*`, ...itemLines, ``, `NPK Cost: RM${fertTotalCost.toFixed(2)}`, `Saved: RM${result.savings_rm} vs premium blend`, ``, `_Generated by BajaJimat — bajajimat.lovable.app_`];
    return encodeURIComponent(message.join('\n'));
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${buildWhatsAppText()}`, '_blank');
  };

  const npkCards = [
    { nutrient: 'N', label: t(lang, 'Nitrogen', 'Nitrogen'), value: result.n_deficit_kg, color: '#3b82f6', bgClass: 'from-blue-50 to-blue-100/50', borderClass: 'border-blue-200/60' },
    { nutrient: 'P', label: t(lang, 'Phosphorus', 'Fosforus'), value: result.p_deficit_kg, color: '#f59e0b', bgClass: 'from-amber-50 to-amber-100/50', borderClass: 'border-amber-200/60' },
    { nutrient: 'K', label: t(lang, 'Potassium', 'Kalium'), value: result.k_deficit_kg, color: '#ef4444', bgClass: 'from-red-50 to-red-100/50', borderClass: 'border-red-200/60' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Print-only content */}
      <div className="hidden print:block p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">🌿 BajaJimat</h1>
          <p className="text-sm text-muted-foreground">{t(lang, 'Smart Fertilizer Optimizer', 'Pengoptimum Baja Pintar')}</p>
        </div>
        <div className="mb-4 text-sm">
          <p><strong>{t(lang, 'Plot', 'Ladang')}:</strong> {plotName || '-'}</p>
          <p><strong>{t(lang, 'Crop', 'Tanaman')}:</strong> {cropType || '-'}</p>
          <p><strong>{t(lang, 'Farm Size', 'Saiz Ladang')}:</strong> {farmSize || '-'} {t(lang, 'ha', 'hektar')}</p>
          <p><strong>{t(lang, 'Date', 'Tarikh')}:</strong> {currentDate}</p>
        </div>
        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr className="border-b-2 border-foreground">
              <th className="text-left py-2">{t(lang, 'Fertiliser', 'Baja')}</th>
              <th className="text-center py-2">{t(lang, 'Bags', 'Beg')}</th>
              <th className="text-right py-2">{t(lang, 'Price/Bag', 'Harga/Beg')}</th>
              <th className="text-right py-2">{t(lang, 'Subtotal', 'Jumlah')}</th>
            </tr>
          </thead>
          <tbody>
            {[...fertItems, ...mgItems].map(r => (
              <tr key={r.name} className="border-b border-muted">
                <td className="py-2">{r.name}</td>
                <td className="text-center py-2">{r.bags}</td>
                <td className="text-right py-2">RM{r.price_per_bag}</td>
                <td className="text-right py-2 font-semibold">RM{r.subtotal_rm}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-foreground font-extrabold">
              <td colSpan={3} className="py-2">{t(lang, 'Total', 'Jumlah')}</td>
              <td className="text-right py-2">RM{displayTotalCost.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-sm font-semibold">💰 {t(lang, 'Saved', 'Jimat')}: RM{result.savings_rm} {t(lang, 'vs premium blends', 'vs baja premium')}</p>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>BajaJimat — {t(lang, 'Smart Fertilizer Optimizer', 'Pengoptimum Baja Pintar')}</p>
          <p>bajajimat.lovable.app</p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border/60 px-4 md:px-8 py-3 flex-shrink-0 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95">
              <ArrowLeft size={16} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <span className="text-base font-extrabold text-foreground">BajaJimat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speak(result.voice_summary)}
              className={`flex items-center gap-2 btn-gradient-primary rounded-xl px-4 py-2 transition-all duration-300 active:scale-97 shrink-0 ${isSpeaking ? 'animate-pulse-ring' : ''}`}
              aria-label="Hear summary"
            >
              <Volume2 size={16} className="text-white shrink-0" />
              <span className="text-xs font-extrabold text-white hidden sm:inline">
                {t(lang, 'Hear Summary', 'Dengar Ringkasan')}
              </span>
            </button>
            {onToggleLang && (
              <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
                <Globe size={12} />
                {lang === 'en' ? 'BM' : 'EN'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabbed Content */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden print:hidden">
        <div className="px-4 md:px-8 pt-3 flex-shrink-0 border-b-2 border-primary/30">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-none bg-transparent gap-0 p-0">
            {[
              { value: 'summary', label: t(lang, '📊 Summary', '📊 Ringkasan') },
              { value: 'shopping', label: t(lang, '🛒 Shopping', '🛒 Senarai') },
              { value: 'advice', label: t(lang, '💡 Advice', '💡 Nasihat') },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-t-xl rounded-b-none text-sm sm:text-base font-extrabold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:tab-neon-active data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
          {/* ========== TAB 1: Summary ========== */}
          <TabsContent value="summary" className="mt-0 space-y-4">
            {/* Confidence + Farm Info */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-extrabold ${confidenceColor}`}>
                  {confidenceLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                  🌱 {cropType || ''} · {farmSize || ''} ha · {result.soil_type || ''}
                </span>
                {result.crop_requirements_source === 'ai' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">✨ AI</span>
                )}
              </div>
              <SpeakerButton
                text={t(lang,
                  `Crop ${cropType || 'unknown'}, size ${farmSize || 'unknown'} hectares. Nitrogen deficit ${result.n_deficit_kg} kg, phosphorus ${result.p_deficit_kg} kg, potassium ${result.k_deficit_kg} kg.`,
                  `Tanaman ${cropType || 'tidak diketahui'}, keluasan ${farmSize || 'tidak diketahui'} hektar. Defisit nitrogen ${result.n_deficit_kg} kg, fosforus ${result.p_deficit_kg} kg, kalium ${result.k_deficit_kg} kg.`
                )}
                lang={lang}
                size="sm"
              />
            </motion.div>

            {/* NPK Bento Grid — 3 columns */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-3 gap-2 sm:gap-3">
              {npkCards.map(card => (
                <div key={card.nutrient} className={`relative rounded-2xl bg-gradient-to-br ${card.bgClass} border ${card.borderClass} p-3 sm:p-4 flex flex-col items-center text-center shadow-sm`}>
                  <span className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: card.color }}>{card.nutrient}</span>
                  <span className="text-2xl sm:text-3xl font-extrabold tabular-nums" style={{ color: card.color }}>{card.value}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">kg {t(lang, 'deficit', 'defisit')}</span>
                  {/* Mini gauge */}
                  <div className="relative mt-2">
                    <NutrientGauge value={card.value} maxVal={maxVal} color={card.color} label={card.label} />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Radar Chart Bento */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl bg-card border border-border/40 shadow-lg p-4 overflow-hidden"
              style={{ background: 'linear-gradient(160deg, rgba(10,31,26,0.95) 0%, rgba(13,43,35,0.9) 50%, rgba(6,26,21,0.95) 100%)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingDown size={14} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-extrabold text-emerald-50 tracking-tight">
                  {t(lang, 'Nutrient Deficit Radar', 'Radar Defisit Nutrien')}
                </h3>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 800, fontFamily: 'Inter, sans-serif' }} />
                    <PolarRadiusAxis domain={[0, maxVal]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} />
                    <Radar dataKey="value" stroke="#34d399" fill="url(#radarGrad)" fillOpacity={0.5} strokeWidth={2.5} dot={<RadarDot />} />
                    <defs>
                      <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#065f46" stopOpacity={0.2} />
                      </radialGradient>
                    </defs>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* pH Warning Bento */}
            {result.liming_needed && limingItems.length > 0 && (
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl border border-amber-200/60 bg-card shadow-lg p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-extrabold text-amber-800 mb-1">
                      ⚠️ {t(lang, 'Low Soil pH — Liming Required', 'pH Tanah Rendah — Pengapuran Diperlukan')}
                    </p>
                    {limingItems[0].reason && (
                      <p className="text-sm text-amber-700 mb-2">{limingItems[0].reason}</p>
                    )}
                    {limingItems.map((lim) => (
                      <div key={lim.name} className="flex items-center gap-3 text-sm text-amber-700 mb-1">
                        <span className="font-extrabold">{lim.name}</span>
                        <span>{lim.bags} {t(lang, 'bags (25kg)', 'beg (25kg)')} × RM{lim.price_per_bag}</span>
                        <span className="font-extrabold">= RM{lim.subtotal_rm}</span>
                      </div>
                    ))}
                    <p className="text-xs text-amber-600/70 mt-2">
                      {t(lang, 'One-time cost, not in annual total', 'Kos sekali sahaja, tidak dalam jumlah tahunan')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* ========== TAB 2: Shopping List ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-4">
            <div className="flex justify-end">
              <SpeakerButton text={result.voice_summary} lang={lang} size="sm" />
            </div>

            {/* Receipt Bento */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl bg-card shadow-lg border border-border/40 overflow-hidden"
            >
              <div className="px-5 pt-5 pb-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    {t(lang, 'NPK Fertiliser Cost', 'Kos Baja NPK')}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {plotName || ''} · {cropType || ''} · {farmSize || ''} ha
                  </p>
                </div>
              </div>

              <div className="px-5">
                {fertItems.map((rec, i) => (
                  <div key={rec.name} className={`flex items-center justify-between py-4 ${i < fertItems.length - 1 ? 'border-b border-border/30' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                        <Package size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-extrabold text-foreground text-lg">{rec.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {rec.bags} {t(lang, 'bags (25kg)', 'beg (25kg)')} × RM{rec.price_per_bag}
                        </p>
                      </div>
                    </div>
                    <p className="font-extrabold text-foreground text-xl tabular-nums shrink-0">RM{rec.subtotal_rm}</p>
                  </div>
                ))}

                {mgItems.map((mg) => (
                  <div key={mg.name} className="flex items-center justify-between py-4 border-t border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <span className="text-base">💊</span>
                      </div>
                      <div>
                        <p className="font-extrabold text-foreground text-lg">{mg.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {mg.bags} {t(lang, 'bags (25kg)', 'beg (25kg)')} × RM{mg.price_per_bag}
                          {mg.reason && <span className="ml-1 text-blue-500 font-semibold">· {t(lang, 'Optional', 'Pilihan')}</span>}
                        </p>
                      </div>
                    </div>
                    <p className="font-extrabold text-foreground text-xl tabular-nums shrink-0">RM{mg.subtotal_rm}</p>
                  </div>
                ))}
              </div>

              {/* Grand Total — Frosted Bento */}
              <div className="mx-5 border-t-2 border-foreground/15" />
              <div className="px-5 py-5 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent rounded-b-2xl" style={{ boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)' }}>
                <div>
                  <p className="text-lg font-extrabold text-foreground">{t(lang, 'Grand Total', 'Jumlah Keseluruhan')}</p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t(lang, `${[...fertItems, ...mgItems].length} products`, `${[...fertItems, ...mgItems].length} produk`)}
                  </p>
                </div>
                <p className="text-3xl font-extrabold text-foreground tabular-nums" style={{ textShadow: '0 2px 12px hsla(164,90%,20%,0.15)' }}>
                  RM{displayTotalCost.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>

            {/* Savings Pill */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 border border-emerald-200 shadow-sm">
                <Sparkles size={16} className="text-emerald-600" />
                <span className="text-lg font-extrabold text-emerald-800 tabular-nums">
                  💰 RM{result.savings_rm} {t(lang, 'Saved!', 'Dijimat!')}
                </span>
              </div>
            </motion.div>

            {/* WhatsApp + PDF */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
              <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-extrabold text-base hover:bg-[#1fb855] transition-colors active:scale-97 shadow-md">
                <Share2 size={18} />
                {t(lang, 'Share to WhatsApp', 'Kongsi ke WhatsApp')}
              </button>
              <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-primary text-primary font-extrabold text-base hover:bg-primary/5 transition-colors active:scale-97">
                <Download size={18} />
                {t(lang, 'Download PDF', 'Muat Turun PDF')}
              </button>
            </motion.div>
          </TabsContent>

          {/* ========== TAB 3: Advice ========== */}
          <TabsContent value="advice" className="mt-0 space-y-4">
            <div className="flex justify-end">
              <SpeakerButton
                text={t(lang,
                  `This month's advice: ${farmTip || result.seasonal_advice?.advice || ''}.`,
                  `Nasihat bulan ini: ${farmTip || result.seasonal_advice?.advice || ''}.`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Seasonal Advice Bento */}
            {result.seasonal_advice?.advice && (
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-card rounded-2xl shadow-lg border border-border/40 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Leaf size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-primary mb-1.5 uppercase tracking-wider">
                      {t(lang, "This Season's Advice", 'Nasihat Musim Ini')}
                    </p>
                    <p className="text-base text-foreground leading-relaxed font-medium">
                      {result.seasonal_advice.advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Farm Tip Bento */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-card rounded-2xl shadow-lg border border-border/40 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                  <Lightbulb size={18} className="text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-xs font-extrabold text-sky-600 uppercase tracking-wider">
                      {t(lang, "Farm Tip", 'Tip Ladang')}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold">✨ AI</span>
                  </div>
                  {tipLoading ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 size={16} className="animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground font-medium">{t(lang, 'Loading...', 'Memuatkan...')}</span>
                    </div>
                  ) : farmTip ? (
                    <p className="text-base text-foreground leading-relaxed font-medium">{farmTip}</p>
                  ) : (
                    <p className="text-base text-muted-foreground italic">{t(lang, 'No tip available', 'Tiada tip tersedia')}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Liming Advice Bento */}
            {result.liming_needed && (
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-card rounded-2xl shadow-lg border border-border/40 border-l-4 border-l-amber-400 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-amber-600 mb-1.5 uppercase tracking-wider">
                      {t(lang, 'Liming Method', 'Cara Pengapuran')}
                    </p>
                    <ul className="text-sm text-foreground space-y-1 font-medium">
                      <li>• {t(lang, 'Spread lime evenly across the field.', 'Tabur kapur secara sekata di seluruh ladang.')}</li>
                      <li>• {t(lang, 'Wait 2-4 weeks before fertilising.', 'Biarkan 2-4 minggu sebelum membaja.')}</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Nearby Shops Bento */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <a
                href="https://www.google.com/maps/search/kedai+baja+pertanian+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-card rounded-2xl shadow-lg border border-border/40 p-5 hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-emerald-600" />
                </div>
                <span className="font-extrabold text-lg text-foreground">
                  {t(lang, '📍 Find Nearby Shops', '📍 Cari Kedai Berdekatan')}
                </span>
              </a>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-center text-sm text-muted-foreground italic">
                ⚠️ {t(lang, 'AI-generated advice. Verify with an expert.', 'Nasihat dijana AI. Sahkan dengan pakar.')}
              </p>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <footer className="bg-card border-t border-border/60 px-4 md:px-8 py-3 flex-shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-2.5 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 btn-secondary-outline border-primary/60"
          >
            <ArrowLeft size={14} />
            {backLabel || t(lang, 'Back to My Plots', 'Kembali ke Ladang Saya')}
          </button>
          <p className="flex-1 text-xs text-muted-foreground text-center leading-relaxed">
            {t(lang, 'Prices based on current market data.', 'Harga berdasarkan data pasaran semasa.')}
          </p>
        </div>
      </footer>
    </div>
  );
}
