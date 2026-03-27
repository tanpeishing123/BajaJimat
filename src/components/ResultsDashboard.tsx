import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Globe, Sprout, TrendingDown, Package, Banknote, AlertTriangle, Loader2, MapPin, Share2, Download, Droplets, ShieldAlert, Lightbulb } from 'lucide-react';
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
  onUploadSoil?: () => void;
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

/* Circular progress ring */
function SoilHealthRing({ score, label }: { score: number; label: string }) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
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
        <span className="text-3xl font-extrabold font-sans text-foreground">{score}</span>
        <span className="text-[10px] font-sans text-muted-foreground font-medium">/100</span>
      </div>
      <span className="text-xs font-sans font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

/* Glassmorphism card class */
const glassCard = "bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl";
const glassCardHover = `${glassCard} hover:bg-white/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out`;

export function ResultsDashboard({ lang, result, cropType, plotName, farmSize, onBack, backLabel, onToggleLang, onUploadSoil }: Props) {
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

  // Soil Health Score
  let soilScore = 100;
  if (result.n_deficit_kg > 100) soilScore -= 25;
  if (result.p_deficit_kg > 50) soilScore -= 25;
  if (result.k_deficit_kg > 200) soilScore -= 25;
  if (result.liming_needed) soilScore -= 25;

  const soilLabel = soilScore >= 80
    ? t(lang, 'Healthy Soil', 'Tanah Sihat')
    : soilScore >= 60
    ? t(lang, 'Fair', 'Sederhana')
    : soilScore >= 40
    ? t(lang, 'Poor', 'Lemah')
    : t(lang, 'Critical', 'Kritikal');

  const currentDate = new Date().toLocaleDateString(lang === 'bm' ? 'ms-MY' : 'en-MY', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const buildWhatsAppText = () => {
    const allItems = [...fertItems, ...mgItems];
    const itemLines = allItems.map(r =>
      `• ${r.name}: ${r.bags} ${t(lang, 'bags (25kg)', 'beg (25kg)')} × RM${r.price_per_bag} = RM${r.subtotal_rm}`
    );

    const message = lang === 'bm'
      ? [
          `*Senarai Baja BajaJimat*`,
          ``,
          `Ladang: ${plotName || '-'} | Tanaman: ${cropType || '-'} | ${farmSize || '-'} hektar`,
          ``,
          `*Baja Diperlukan:*`,
          ...itemLines,
          ``,
          `Jumlah Kos NPK: RM${fertTotalCost.toFixed(2)}`,
          `Jimat: RM${result.savings_rm} vs baja premium`,
          ``,
          `_Dijana oleh BajaJimat — bajajimat.lovable.app_`,
        ]
      : [
          `*BajaJimat Fertiliser List*`,
          ``,
          `Plot: ${plotName || '-'} | Crop: ${cropType || '-'} | ${farmSize || '-'} ha`,
          ``,
          `*Fertilisers Needed:*`,
          ...itemLines,
          ``,
          `NPK Cost: RM${fertTotalCost.toFixed(2)}`,
          `Saved: RM${result.savings_rm} vs premium blend`,
          ``,
          `_Generated by BajaJimat — bajajimat.lovable.app_`,
        ];

    return encodeURIComponent(message.join('\n'));
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${buildWhatsAppText()}`, '_blank');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #6ee7b7 0%, #f0fdfa 40%, #86efac 70%, #ccfbf1 100%)' }}>
      {/* Print-only content */}
      <div className="hidden print:block p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">BajaJimat</h1>
          <p className="text-sm text-muted-foreground">{t(lang, 'Smart Fertiliser Optimiser', 'Pengoptimum Baja Pintar')}</p>
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
            <tr className="border-t-2 border-foreground font-bold">
              <td colSpan={3} className="py-2">{t(lang, 'Total', 'Jumlah')}</td>
              <td className="text-right py-2">RM{displayTotalCost.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-sm font-semibold">💰 {t(lang, 'Saved', 'Jimat')}: RM{result.savings_rm} {t(lang, 'vs premium blends', 'vs baja premium')}</p>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>BajaJimat — {t(lang, 'Smart Fertiliser Optimiser', 'Pengoptimum Baja Pintar')}</p>
          <p>bajajimat.lovable.app</p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-b border-white/50 px-4 md:px-8 py-3 flex-shrink-0 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl border border-white/50 bg-white/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all active:scale-95">
              <ArrowLeft size={16} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <span className="font-sans text-base font-bold text-gray-900">BajaJimat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speak(result.voice_summary)}
              className={`flex items-center gap-2 btn-gradient-primary rounded-xl px-4 py-2 transition-all duration-300 active:scale-97 shrink-0 ${isSpeaking ? 'animate-pulse-ring' : ''}`}
              aria-label="Hear summary"
            >
              <Volume2 size={16} className="text-white shrink-0" />
              <span className="font-sans text-xs font-semibold text-white hidden sm:inline">
                {t(lang, 'Hear Summary', 'Dengar Ringkasan')}
              </span>
            </button>
            {onToggleLang && (
              <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/50 bg-white/30 text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-white/50 transition-all duration-200 active:scale-95">
                <Globe size={12} />
                {lang === 'en' ? 'BM' : 'EN'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabbed Content */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden print:hidden">
        <div className="px-4 md:px-8 pt-4 pb-2 flex-shrink-0">
          <TabsList className="w-full grid grid-cols-3 h-11 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 p-1 gap-0">
            <TabsTrigger value="summary" className="rounded-lg text-sm font-sans font-semibold transition-all duration-200 text-muted-foreground data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
              {t(lang, '📊 Summary', '📊 Ringkasan')}
            </TabsTrigger>
            <TabsTrigger value="shopping" className="rounded-lg text-sm font-sans font-semibold transition-all duration-200 text-muted-foreground data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
              {t(lang, '🛒 Shopping List', '🛒 Senarai')}
            </TabsTrigger>
            <TabsTrigger value="advice" className="rounded-lg text-sm font-sans font-semibold transition-all duration-200 text-muted-foreground data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
              {t(lang, '💡 Advice', '💡 Nasihat')}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
          {/* ========== TAB 1: Summary ========== */}
          <TabsContent value="summary" className="mt-0 space-y-5">
            {/* Confidence Badge row */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-sans font-bold ${confidenceColor}`}>
                  {confidenceLabel}
                </span>
              </div>
              <SpeakerButton
                text={t(lang,
                  `Crop ${cropType || 'unknown'}, size ${farmSize || 'unknown'} hectares, soil ${result.soil_type || 'unknown'}. Nitrogen deficit ${result.n_deficit_kg} kg, phosphorus ${result.p_deficit_kg} kg, potassium ${result.k_deficit_kg} kg.${result.liming_needed ? ' Soil pH is low, liming required.' : ''}`,
                  `Tanaman ${cropType || 'tidak diketahui'}, keluasan ${farmSize || 'tidak diketahui'} hektar, tanah ${result.soil_type || 'tidak diketahui'}. Defisit nitrogen ${result.n_deficit_kg} kg, fosforus ${result.p_deficit_kg} kg, kalium ${result.k_deficit_kg} kg.${result.liming_needed ? ' pH tanah rendah, pengapuran diperlukan.' : ''}`
                )}
                lang={lang}
                size="sm"
              />
            </motion.div>

            {/* Farm Info Bar */}
            <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-1.5 flex-wrap"
            >
              <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${glassCard}`}>
                <span className="text-sm">🌱</span>
                <p className="text-sm font-semibold text-gray-900 font-sans">
                  {cropType || ''} · {farmSize || ''} ha · {result.soil_type || ''}
                </p>
                {result.crop_requirements_source === 'ai' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-sans font-bold">
                    ✨ {t(lang, 'AI Generated', 'Dijana AI')}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Nutrient Deficit Section */}
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl p-6 relative overflow-hidden glass-dark-elevated"
              style={{ background: 'linear-gradient(160deg, rgba(10,31,26,0.95) 0%, rgba(13,43,35,0.9) 50%, rgba(6,26,21,0.95) 100%)' }}
            >
              {/* Glowing pulse center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full animate-pulse-ring" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.2) 0%, rgba(52,211,153,0.08) 40%, transparent 70%)' }} />
              </div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingDown size={16} className="text-emerald-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-emerald-50 tracking-tight">
                  {t(lang, 'Nutrient Deficit', 'Defisit Nutrien')}
                </h3>
              </div>
              <div className="h-[210px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 800, fontFamily: 'Inter, sans-serif' }} />
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
              {/* N-P-K Deficit Pills */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-2 sm:mt-3 relative z-10 flex-wrap px-1">
                {[
                  { nutrient: 'N', value: result.n_deficit_kg, pill: 'pill-glossy-n', text: 'text-blue-300', border: 'border-blue-400/40' },
                  { nutrient: 'P', value: result.p_deficit_kg, pill: 'pill-glossy-p', text: 'text-amber-300', border: 'border-amber-400/40' },
                  { nutrient: 'K', value: result.k_deficit_kg, pill: 'pill-glossy-k', text: 'text-emerald-300', border: 'border-emerald-400/40' },
                ].map(d => (
                  <div key={d.nutrient} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full ${d.pill} border ${d.border}`}>
                    <span className={`text-[11px] sm:text-sm font-extrabold font-display ${d.text} tracking-wide`}>{d.nutrient}</span>
                    <span className="text-sm sm:text-base font-bold text-white font-sans tabular-nums">{d.value}kg</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Soil Report Upsell */}
            {result.input_mode === 'leaf_photo' && (
              <motion.div custom={1.3} variants={fadeUp} initial="hidden" animate="visible"
                className={`${glassCard} p-5`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-100/80 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb size={18} className="text-sky-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm font-sans text-gray-900 leading-relaxed font-medium">
                      <span className="font-bold">{t(lang, 'Want pinpoint precision?', 'Mahu ketepatan tepat?')}</span>{' '}
                      {t(lang,
                        'Upload a soil test report for exact dosage calculations.',
                        'Muat naik laporan ujian tanah untuk pengiraan dos yang tepat.'
                      )}
                    </p>
                    <button
                      onClick={() => {
                        if (onUploadSoil) onUploadSoil();
                        else onBack();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-sans font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      <Droplets size={15} />
                      {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* pH Warning Card */}
            {result.liming_needed && limingItems.length > 0 && (
              <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible"
                className={`${glassCard} px-5 py-5 border-amber-200/60`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={20} className="text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-lg font-bold text-gray-900 mb-1">
                      ⚠️ {t(lang, 'Low Soil pH — Liming Required', 'pH Tanah Rendah — Pengapuran Diperlukan')}
                    </p>
                    {limingItems[0].reason && (
                      <p className="text-sm text-amber-700 font-sans mb-2">{limingItems[0].reason}</p>
                    )}
                    {limingItems.map((lim) => (
                      <div key={lim.name} className="flex items-center gap-4 text-sm font-sans text-gray-900 mb-1">
                        <span className="font-bold">{lim.name}</span>
                        <span>{lim.bags} {t(lang, 'bags (25kg)', 'beg (25kg)')} × RM{lim.price_per_bag}</span>
                        <span className="font-extrabold">= RM{lim.subtotal_rm}</span>
                      </div>
                    ))}
                    <p className="text-xs text-amber-600/70 font-sans mt-2 leading-relaxed">
                      {t(lang,
                        'One-time cost, not included in annual fertiliser total',
                        'Kos sekali sahaja, tidak termasuk dalam jumlah baja tahunan'
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* ========== TAB 2: Shopping List ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-5">
            {/* Tab 2 speaker button */}
            <div className="flex justify-end">
              <SpeakerButton text={result.voice_summary} lang={lang} size="sm" />
            </div>

            {/* Unified Frosted Receipt Card */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCard} overflow-hidden`}
            >
              {/* Receipt Header */}
              <div className="px-6 pt-6 pb-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-gray-900">
                    {t(lang, 'NPK Fertiliser Cost', 'Kos Baja NPK')}
                  </h3>
                  <p className="text-sm font-sans text-muted-foreground font-medium">
                    {plotName || ''} · {cropType || ''} · {farmSize || ''} ha
                  </p>
                </div>
              </div>

              {/* Fertiliser Item Rows */}
              <div className="px-6">
                {fertItems.map((rec, i) => (
                  <div key={rec.name} className={`flex items-center justify-between py-5 ${i < fertItems.length - 1 ? 'border-b border-white/40' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                        <Package size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-gray-900 text-lg">{rec.name}</p>
                        <p className="text-sm text-muted-foreground font-sans font-medium mt-0.5">
                          {rec.bags} {t(lang, 'bags (25kg)', 'beg (25kg)')} × RM{rec.price_per_bag}
                        </p>
                      </div>
                    </div>
                    <p className="font-sans font-extrabold text-gray-900 text-xl tabular-nums shrink-0">RM{rec.subtotal_rm}</p>
                  </div>
                ))}

                {/* Magnesium items inline */}
                {mgItems.map((mg) => (
                  <div key={mg.name} className="flex items-center justify-between py-5 border-t border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50/80 flex items-center justify-center shrink-0">
                        <span className="text-base">💊</span>
                      </div>
                      <div>
                        <p className="font-sans font-bold text-gray-900 text-lg">{mg.name}</p>
                        <p className="text-sm text-muted-foreground font-sans font-medium mt-0.5">
                          {mg.bags} {t(lang, 'bags (25kg)', 'beg (25kg)')} × RM{mg.price_per_bag}
                          {mg.reason && <span className="ml-1 text-blue-500 font-semibold">· {t(lang, 'Optional', 'Pilihan')}</span>}
                        </p>
                      </div>
                    </div>
                    <p className="font-sans font-extrabold text-gray-900 text-xl tabular-nums shrink-0">RM{mg.subtotal_rm}</p>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="mx-6 border-t-2 border-gray-900/10" />
              <div className="px-6 py-6 flex items-center justify-between">
                <div>
                  <p className="font-sans text-xl font-bold text-gray-900">{t(lang, 'Grand Total', 'Jumlah Keseluruhan')}</p>
                  <p className="text-sm font-sans text-muted-foreground font-medium">
                    {t(lang, `${[...fertItems, ...mgItems].length} products`, `${[...fertItems, ...mgItems].length} produk`)}
                  </p>
                </div>
                <p className="text-3xl font-sans font-extrabold text-gray-900 tabular-nums">
                  RM{displayTotalCost.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>

            {/* Savings Banner */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCard} px-6 py-5 flex items-center justify-between border-emerald-200/60`}
              style={{ background: 'rgba(236,253,245,0.7)', backdropFilter: 'blur(20px)' }}
            >
              <div>
                <p className="text-emerald-800 font-sans text-sm font-semibold">
                  {t(lang, 'Savings vs Premium Blends', 'Penjimatan vs Baja Premium')}
                </p>
                <p className="text-2xl font-sans font-extrabold text-gray-900 tabular-nums mt-1">
                  💰 RM{result.savings_rm} {t(lang, 'Saved!', 'Dijimat!')}
                </p>
              </div>
            </motion.div>

            {/* WhatsApp + PDF Buttons */}
            <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-sans font-bold text-base hover:bg-[#1fb855] transition-colors active:scale-97 shadow-md"
              >
                <Share2 size={18} />
                {t(lang, 'Share to WhatsApp', 'Kongsi ke WhatsApp')}
              </button>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/60 backdrop-blur-xl border border-white/80 text-primary font-sans font-bold text-base hover:bg-white/80 transition-all active:scale-97"
              >
                <Download size={18} />
                {t(lang, 'Download PDF', 'Muat Turun PDF')}
              </button>
            </motion.div>
          </TabsContent>

          {/* ========== TAB 3: Advice ========== */}
          <TabsContent value="advice" className="mt-0 space-y-5">
            {/* Tab 3 speaker button */}
            <div className="flex justify-end">
              <SpeakerButton
                text={t(lang,
                  `This month's advice: ${farmTip || result.seasonal_advice?.advice || ''}.${result.liming_needed ? ' Spread lime evenly across the field and wait 2-4 weeks before fertilising.' : ''}`,
                  `Nasihat bulan ini: ${farmTip || result.seasonal_advice?.advice || ''}.${result.liming_needed ? ' Tabur kapur secara sekata di ladang dan tunggu 2-4 minggu sebelum membaja.' : ''}`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Seasonal Advice */}
            {result.seasonal_advice?.advice && (
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className={`${glassCardHover} p-6`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl mt-0.5">📅</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-bold text-primary mb-2 uppercase tracking-wider">
                      {t(lang, "This Season's Advice", 'Nasihat Musim Ini')}
                    </p>
                    <p className="font-sans text-lg text-gray-900 leading-relaxed font-bold">
                      {result.seasonal_advice.advice.replace(/\*\*/g, '')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Farm Tip Card */}
            <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCardHover} p-6`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-0.5">💡</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-sans text-sm font-bold text-primary uppercase tracking-wider">
                      {t(lang, "This Month's Farm Tip", 'Tip Ladang Bulan Ini')}
                    </p>
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-sans font-bold">
                      ✨ {t(lang, 'AI Generated', 'Dijana AI')}
                    </span>
                  </div>
                  {tipLoading ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 size={16} className="animate-spin text-primary" />
                      <span className="text-lg text-muted-foreground font-sans font-medium">{t(lang, 'Loading tip...', 'Memuatkan tip...')}</span>
                    </div>
                  ) : farmTip ? (
                    <p className="font-sans text-lg text-gray-900 leading-relaxed font-bold">{farmTip.replace(/\*\*/g, '')}</p>
                  ) : (
                    <p className="font-sans text-lg text-muted-foreground italic">{t(lang, 'No tip available', 'Tiada tip tersedia')}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* pH Liming Advice */}
            {result.liming_needed && (
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className={`${glassCardHover} p-6`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl mt-0.5">🧪</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-bold text-amber-600 mb-2 uppercase tracking-wider">
                      {t(lang, 'Liming Method', 'Cara Pengapuran')}
                    </p>
                    <p className="font-sans text-lg text-gray-900 leading-relaxed font-bold">
                      {t(lang,
                        'Spread lime evenly. Wait 2-4 weeks before fertilising.',
                        'Tabur kapur sekata. Tunggu 2-4 minggu sebelum membaja.'
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Nearby Shops */}
            <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible">
              <a
                href="https://www.google.com/maps/search/kedai+baja+pertanian+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 ${glassCardHover} p-6`}
              >
                <MapPin size={24} className="text-primary shrink-0" />
                <span className="font-sans font-bold text-lg text-gray-900">
                  {t(lang, '📍 Find Nearby Fertiliser Shops', '📍 Cari Kedai Baja Berdekatan')}
                </span>
              </a>
            </motion.div>

            {/* AI Disclaimer */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-center text-sm text-muted-foreground font-sans italic leading-relaxed">
                ⚠️ {t(lang,
                  'Advice generated by AI, verify with agricultural expert',
                  'Nasihat dijana oleh AI, sahkan dengan pakar pertanian'
                )}
              </p>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-xl border-t border-white/60 px-4 md:px-8 py-3 flex-shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-2.5 rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 btn-secondary-outline border-primary/60"
          >
            <ArrowLeft size={14} />
            {backLabel || t(lang, 'Back to My Plots', 'Kembali ke Ladang Saya')}
          </button>
          <p className="flex-1 text-xs text-muted-foreground font-sans text-center leading-relaxed">
            {t(lang,
              'Prices based on current market data. Confirm with your local supplier.',
              'Harga berdasarkan data pasaran semasa. Sahkan dengan pembekal tempatan anda.'
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
