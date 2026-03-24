import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Globe, Sprout, TrendingDown, Package, Banknote, AlertTriangle, Loader2, MapPin, Share2, Download } from 'lucide-react';
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
  return <circle cx={cx} cy={cy} r={4} fill="#34d399" stroke="#065f46" strokeWidth={2} />;
};

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
      `• ${r.name}: ${r.bags} ${t(lang, 'bags', 'beg')} × RM${r.price_per_bag} = RM${r.subtotal_rm}`
    );

    const message = lang === 'bm'
      ? [
          `🌱 *Senarai Baja BajaJimat*`,
          ``,
          `Ladang: ${plotName || '-'} | Tanaman: ${cropType || '-'} | ${farmSize || '-'} hektar`,
          ``,
          `*Baja Diperlukan:*`,
          ...itemLines,
          ``,
          `💰 Jumlah Kos NPK: RM${fertTotalCost.toFixed(2)}`,
          `✅ Jimat: RM${result.savings_rm} vs baja premium`,
          ``,
          `📅 ${currentDate}`,
          ``,
          `_Dijana oleh BajaJimat — bajajimat.lovable.app_`,
        ]
      : [
          `🌱 *BajaJimat Fertiliser List*`,
          ``,
          `Plot: ${plotName || '-'} | Crop: ${cropType || '-'} | ${farmSize || '-'} ha`,
          ``,
          `*Fertilisers Needed:*`,
          ...itemLines,
          ``,
          `💰 NPK Cost: RM${fertTotalCost.toFixed(2)}`,
          `✅ Saved: RM${result.savings_rm} vs premium blend`,
          ``,
          `📅 ${currentDate}`,
          ``,
          `_Generated by BajaJimat — bajajimat.lovable.app_`,
        ];

    return encodeURIComponent(message.join('\n'));
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${buildWhatsAppText()}`, '_blank');
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Print-only content */}
      <div className="hidden print:block p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">🌿 BajaJimat</h1>
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
            <tr className="border-t-2 border-foreground font-bold">
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
      {/* Header — always visible (hidden in print) */}
      <header className="bg-card border-b border-border/60 px-4 md:px-8 py-3 flex-shrink-0 print:hidden">
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
              <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
                <Globe size={12} />
                {lang === 'en' ? 'BM' : 'EN'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabbed Content */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden print:hidden">
        <div className="px-4 md:px-8 pt-3 flex-shrink-0">
          <TabsList className="w-full grid grid-cols-3 h-11 rounded-xl bg-muted">
            <TabsTrigger value="summary" className="rounded-lg text-xs sm:text-sm font-sans font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t(lang, '📊 Summary', '📊 Ringkasan')}
            </TabsTrigger>
            <TabsTrigger value="shopping" className="rounded-lg text-xs sm:text-sm font-sans font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t(lang, '🛒 Shopping List', '🛒 Senarai Baja')}
            </TabsTrigger>
            <TabsTrigger value="advice" className="rounded-lg text-xs sm:text-sm font-sans font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t(lang, '💡 Advice', '💡 Nasihat')}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
          {/* ========== TAB 1: Summary ========== */}
          <TabsContent value="summary" className="mt-0 space-y-4">
            {/* Badges */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${confidenceColor}`}>
                {confidenceLabel}
              </span>
              {result.soil_type && (
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-sans font-medium">
                  {t(lang, 'Soil', 'Tanah')}: {result.soil_type}
                </span>
              )}
              {result.crop_requirements_source === 'ai' && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-sans font-semibold">
                  ✨ {t(lang, 'AI Generated', 'Dijana AI')}
                </span>
              )}
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl p-5 shadow-sm relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #0a1f1a 0%, #0d2b23 50%, #061a15 100%)' }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)' }} />
              </div>
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingDown size={14} className="text-emerald-400" />
                  </div>
                  <h3 className="font-sans text-sm font-bold text-emerald-50">
                    {t(lang, 'NPK Deficit Analysis', 'Analisis Defisit NPK')}
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
              <div className="h-[220px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis domain={[0, maxVal]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} />
                    <Radar dataKey="value" stroke="#34d399" fill="url(#radarGrad)" fillOpacity={0.4} strokeWidth={2.5} dot={<RadarDot />} />
                    <defs>
                      <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#065f46" stopOpacity={0.2} />
                      </radialGradient>
                    </defs>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-1 relative z-10">
                {radarData.map(d => (
                  <div key={d.nutrient} className="text-center">
                    <p className="text-[10px] text-emerald-400/70 font-sans uppercase tracking-wider">{d.nutrient}</p>
                    <p className="text-base font-bold text-emerald-50 font-sans tabular-nums">{d.value} kg</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* pH / Liming Warning */}
            {limingItems.length > 0 && (
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={18} className="text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-bold text-amber-800 mb-1">
                    {t(lang, 'Low Soil pH — Liming Required', 'pH Tanah Rendah — Kapur Diperlukan')}
                  </p>
                  {limingItems[0].reason && (
                    <p className="text-xs text-amber-700 font-sans mb-2">{limingItems[0].reason}</p>
                  )}
                  {limingItems.map((lim) => (
                    <div key={lim.name} className="flex items-center gap-4 text-xs font-sans text-amber-700 mb-1">
                      <span className="font-semibold">{lim.name}</span>
                      <span>{lim.bags} {t(lang, 'bags', 'beg')} × RM{lim.price_per_bag}</span>
                      <span className="font-bold">= RM{lim.subtotal_rm}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-amber-600/70 font-sans mt-2 leading-relaxed">
                    {t(lang,
                      'Liming is a one-time cost, not included in annual fertiliser total.',
                      'Kos pengapuran adalah kos sekali sahaja, tidak termasuk dalam jumlah baja tahunan.'
                    )}
                  </p>
                </div>
                <SpeakerButton
                  text={t(lang,
                    `Low soil pH. Liming required. ${limingItems.map(l => `${l.bags} bags of ${l.name}, total RM${l.subtotal_rm}`).join('. ')}.`,
                    `pH tanah rendah. Kapur diperlukan. ${limingItems.map(l => `${l.bags} beg ${l.name}, jumlah RM${l.subtotal_rm}`).join('. ')}.`
                  )}
                  lang={lang}
                  size="sm"
                />
              </motion.div>
            )}
          </TabsContent>

          {/* ========== TAB 2: Shopping List ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-4">
            {/* NPK Cost Header */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(165deg, #e8f5e2 0%, #d4edda 40%, #c6e4c0 100%)' }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }} />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <Package size={16} className="text-primary" />
                </div>
                <h3 className="font-sans text-sm font-bold text-foreground/80">
                  {t(lang, 'NPK Fertiliser Cost', 'Kos Baja NPK')}
                </h3>
              </div>
              <p className="text-3xl font-sans font-extrabold text-foreground tabular-nums tracking-tight relative z-10">
                RM{fertTotalCost.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </p>
            </motion.div>

            {/* Fertiliser Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {fertItems.map((rec, i) => (
                <motion.div key={rec.name} custom={i * 0.3 + 0.5} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border/40 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package size={18} className="text-primary" />
                  </div>
                  <p className="font-sans font-semibold text-foreground text-sm leading-tight">{rec.name}</p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {rec.bags} {t(lang, 'bags', 'beg')} × RM{rec.price_per_bag}
                  </p>
                  <p className="font-sans font-bold text-primary text-lg tabular-nums">RM{rec.subtotal_rm}</p>
                </motion.div>
              ))}
            </div>

            {/* Magnesium Card */}
            {mgItems.length > 0 && (
              <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl border border-blue-300 bg-blue-50 px-5 py-4 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lg">💊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-bold text-blue-800 mb-1">
                    {t(lang, 'Magnesium Supplement', 'Suplemen Magnesium')}
                  </p>
                  {mgItems.map((mg) => (
                    <div key={mg.name} className="mb-1">
                      <div className="flex items-center gap-4 text-xs font-sans text-blue-700">
                        <span className="font-semibold">{mg.name}</span>
                        <span>{mg.bags} {t(lang, 'bags', 'beg')} × RM{mg.price_per_bag}</span>
                        <span className="font-bold">= RM{mg.subtotal_rm}</span>
                      </div>
                      {mg.reason && (
                        <p className="text-[10px] text-blue-600/70 font-sans mt-0.5">{mg.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-sans font-semibold shrink-0">
                  {t(lang, 'Optional', 'Pilihan')}
                </span>
              </motion.div>
            )}

            {/* Grand Total */}
            <motion.div custom={1.8} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center justify-between"
            >
              <p className="font-sans text-sm font-semibold text-foreground/70">{t(lang, 'Grand Total', 'Jumlah Keseluruhan')}</p>
              <p className="text-2xl font-sans font-extrabold text-foreground tabular-nums">
                RM{displayTotalCost.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </p>
            </motion.div>

            {/* Savings Banner */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl px-5 py-4 btn-gradient-primary flex items-center justify-between"
            >
              <div>
                <p className="text-white/70 font-sans text-xs">
                  {t(lang, 'Savings vs Premium Blends', 'Penjimatan vs Baja Premium')}
                </p>
                <p className="text-2xl font-sans font-bold text-white tabular-nums">
                  💰 RM{result.savings_rm} {t(lang, 'Saved!', 'Dijimat!')}
                </p>
              </div>
              <SpeakerButton
                text={t(lang, `You saved RM ${result.savings_rm} compared to premium blends.`, `Anda jimat RM ${result.savings_rm} berbanding baja premium.`)}
                lang={lang}
                size="md"
              />
            </motion.div>

            {/* WhatsApp + PDF Buttons */}
            <motion.div custom={2.3} variants={fadeUp} initial="hidden" animate="visible" className="flex gap-3">
              <a
                href={`https://wa.me/?text=${buildWhatsAppText()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-sans font-semibold text-sm hover:bg-[#1fb855] transition-colors active:scale-97"
              >
                <Share2 size={16} />
                {t(lang, 'Share to WhatsApp', 'Kongsi ke WhatsApp')}
              </a>
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-sans font-semibold text-sm hover:bg-primary/5 transition-colors active:scale-97"
              >
                <Download size={16} />
                {t(lang, 'Download PDF', 'Muat Turun PDF')}
              </button>
            </motion.div>
          </TabsContent>

          {/* ========== TAB 3: Advice ========== */}
          <TabsContent value="advice" className="mt-0 space-y-4">
            {/* Seasonal Advice */}
            {result.seasonal_advice?.advice && (
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3"
              >
                <span className="text-lg mt-0.5">📅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-semibold text-emerald-800 mb-0.5">
                    {t(lang, "This Season's Advice", 'Nasihat Musim Ini')}
                  </p>
                  <p className="font-sans text-sm text-emerald-700 leading-relaxed">
                    {result.seasonal_advice.advice}
                  </p>
                </div>
                <SpeakerButton text={result.seasonal_advice.advice} lang={lang} size="sm" />
              </motion.div>
            )}

            {/* Farm Tip Card */}
            <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3"
            >
              <span className="text-lg mt-0.5">📅</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-sans text-xs font-semibold text-emerald-800">
                    {t(lang, "This Month's Farm Tip", 'Tip Ladang Bulan Ini')}
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-sans font-semibold">
                    ✨ {t(lang, 'AI Generated', 'Dijana AI')}
                  </span>
                </div>
                {tipLoading ? (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2 size={12} className="animate-spin text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-sans">{t(lang, 'Loading tip...', 'Memuatkan tip...')}</span>
                  </div>
                ) : farmTip ? (
                  <p className="font-sans text-sm text-emerald-700 leading-relaxed">{farmTip}</p>
                ) : (
                  <p className="font-sans text-xs text-emerald-500 italic">{t(lang, 'No tip available', 'Tiada tip tersedia')}</p>
                )}
              </div>
              {farmTip && <SpeakerButton text={farmTip} lang={lang} size="sm" />}
            </motion.div>

            {/* Nearby Shops Button */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <a
                href="https://www.google.com/maps/search/kedai+baja+pertanian+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-primary text-primary font-sans font-semibold text-sm hover:bg-primary/5 transition-colors active:scale-97"
              >
                <MapPin size={16} />
                {t(lang, '📍 Find Nearby Fertilizer Shops', '📍 Cari Kedai Baja Berdekatan')}
              </a>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer — always visible */}
      <footer className="bg-card border-t border-border/60 px-4 md:px-8 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-2.5 rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 btn-secondary-outline border-primary/60"
          >
            <ArrowLeft size={14} />
            {backLabel || t(lang, 'New Analysis', 'Analisis Baharu')}
          </button>
          <p className="flex-1 text-[11px] text-muted-foreground font-sans text-center leading-relaxed">
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
