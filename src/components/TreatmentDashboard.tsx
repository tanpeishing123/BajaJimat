import { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Sprout, ShieldAlert, Package, AlertTriangle, Loader2, CheckCircle2, ShieldCheck, Info, Upload, TestTube, Droplets, Bug, Leaf, Sun, Clock, Target, Scissors, Sparkles, ThermometerSun, Shield } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface ShoppingItem {
  product_name: string;
  type: string;
  quantity_per_ha: string;
  price_per_ha_rm: number;
  application_method: string;
}

interface ActionStep {
  step: number;
  title: string;
  description: string;
  timing: string;
}

interface TreatmentData {
  issue_name: string;
  shopping_list: ShoppingItem[];
  action_plan: ActionStep[];
  prevention_tips: string[];
  severity_assessment: string;
  expected_recovery_days: number;
}

interface Props {
  lang: 'en' | 'bm';
  issueName: string;
  severity: string;
  visualEvidence: string;
  cropType: string;
  farmSize: string;
  plotName: string;
  onBack: () => void;
  onBackToPlots?: () => void;
  onToggleLang?: () => void;
  onUploadSoil?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

const typeColors: Record<string, string> = {
  fungicide: 'bg-purple-100 text-purple-700',
  insecticide: 'bg-red-100 text-red-700',
  micronutrient: 'bg-blue-100 text-blue-700',
  organic: 'bg-emerald-100 text-emerald-700',
  supplement: 'bg-amber-100 text-amber-700',
};

const stepIcons = [TestTube, Droplets, Scissors, Leaf, Sun];
const stepColors = [
  { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-200' },
  { bg: 'bg-cyan-100', text: 'text-cyan-600', ring: 'ring-cyan-200' },
  { bg: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-200' },
];

const timingColors: Record<string, string> = {
  morning: 'bg-amber-100 text-amber-700',
  immediate: 'bg-red-100 text-red-700',
  week: 'bg-blue-100 text-blue-700',
  daily: 'bg-emerald-100 text-emerald-700',
  default: 'bg-purple-100 text-purple-700',
};

function getTimingColor(timing: string): string {
  const lower = timing.toLowerCase();
  if (lower.includes('morning') || lower.includes('pagi')) return timingColors.morning;
  if (lower.includes('immediate') || lower.includes('segera')) return timingColors.immediate;
  if (lower.includes('week') || lower.includes('minggu')) return timingColors.week;
  if (lower.includes('daily') || lower.includes('harian')) return timingColors.daily;
  return timingColors.default;
}

/* Bento Card wrapper */
function BentoCard({ children, className = '', delay = 0, bgColor = 'bg-card' }: { children: React.ReactNode; className?: string; delay?: number; bgColor?: string }) {
  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl p-6 shadow-sm border border-border/30 ${bgColor} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function TreatmentDashboard({ lang, issueName, severity, visualEvidence, cropType, farmSize, plotName, onBack, onBackToPlots, onToggleLang, onUploadSoil }: Props) {
  const [data, setData] = useState<TreatmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hectares = parseFloat(farmSize) || 2;

  useEffect(() => {
    const fetchTreatment = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-treatment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            issue_name: issueName,
            severity,
            visual_evidence: visualEvidence,
            crop_type: cropType,
            farm_size_ha: hectares,
            lang,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
          throw new Error(errBody.error || `Server error ${res.status}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [issueName, severity, visualEvidence, cropType, hectares, lang]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-base text-muted-foreground font-sans font-medium">
          {t(lang, 'Generating treatment plan...', 'Menjana pelan rawatan...')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="text-destructive" size={32} />
        </div>
        <p className="text-base text-destructive font-sans text-center max-w-md font-medium">{error}</p>
        <button onClick={onBack} className="px-6 py-2.5 rounded-full btn-gradient-primary font-sans font-bold text-base">
          {t(lang, 'Go Back', 'Kembali')}
        </button>
      </div>
    );
  }

  if (!data) return null;

  const severityColor = severity === 'severe' ? 'bg-red-100 text-red-700' :
    severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

  const grandTotal = data.shopping_list.reduce((sum, item) => sum + (item.price_per_ha_rm * hectares), 0);

  return (
    <div className="h-screen flex flex-col bg-agri-depth overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border/60 px-4 md:px-8 py-3 flex-shrink-0">
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
          {onToggleLang && (
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
          )}
        </div>
      </header>

      {/* Tabbed Content */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-8 pt-3 flex-shrink-0 border-b-2 border-primary/30">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-none bg-transparent gap-0 p-0">
            <TabsTrigger value="summary" className="rounded-t-xl rounded-b-none text-sm sm:text-base font-sans font-bold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:tab-neon-active data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5">
              {t(lang, '📊 Summary', '📊 Ringkasan')}
            </TabsTrigger>
            <TabsTrigger value="shopping" className="rounded-t-xl rounded-b-none text-sm sm:text-base font-sans font-bold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:tab-neon-active data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5">
              {t(lang, '🛒 Shopping', '🛒 Belanja')}
            </TabsTrigger>
            <TabsTrigger value="advice" className="rounded-t-xl rounded-b-none text-sm sm:text-base font-sans font-bold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:tab-neon-active data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5">
              {t(lang, '💡 Advice', '💡 Nasihat')}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
          {/* ========== Summary — Bento Grid ========== */}
          <TabsContent value="summary" className="mt-0 space-y-4">
            {/* Context Bar */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-sans font-bold flex items-center gap-1">
                  <ShieldCheck size={12} />
                  {t(lang, 'AI Confidence: 88%', 'Keyakinan AI: 88%')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-sans">
                  🌱 {plotName} · {cropType} · {farmSize} ha
                </span>
              </div>
              <SpeakerButton
                text={t(lang,
                  `Treatment summary for ${data.issue_name}. Severity: ${severity}. ${data.expected_recovery_days > 0 ? `Expected recovery in ${data.expected_recovery_days} days.` : ''} Standard NPK is not required.`,
                  `Ringkasan rawatan untuk ${data.issue_name}. Keterukan: ${severity}. ${data.expected_recovery_days > 0 ? `Jangkaan pemulihan dalam ${data.expected_recovery_days} hari.` : ''} NPK standard tidak diperlukan.`
                )}
                lang={lang}
                size="sm"
              />
            </motion.div>

            {/* Bento: Issue Card (Large — Red tint for infections) */}
            <BentoCard delay={1} className="bg-gradient-to-br from-red-50/80 to-white border-red-200 border-l-4 border-l-red-400">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <ShieldAlert size={24} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-sans text-red-500 font-bold uppercase tracking-wider mb-1">{t(lang, 'Detected Issue', 'Isu Dikesan')}</p>
                  <p className="text-xl font-sans font-extrabold text-foreground capitalize">{data.issue_name}</p>
                  <p className="text-sm font-sans text-muted-foreground mt-1 font-medium">
                    {t(lang, 'Visual symptom detected. Remedial action recommended.', 'Gejala visual dikesan. Tindakan pemulihan disyorkan.')}
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Bento Row: Severity + Recovery */}
            <div className="grid grid-cols-2 gap-3">
              <BentoCard delay={1.5} className={`text-center ${severity === 'severe' ? 'bg-gradient-to-br from-red-50 to-white border-red-200' : severity === 'moderate' ? 'bg-gradient-to-br from-amber-50 to-white border-amber-200' : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'}`} bgColor="">
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${severityColor}`}>
                  <Target size={18} />
                </div>
                <p className="text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">{t(lang, 'Severity', 'Keterukan')}</p>
                <p className={`text-xl font-extrabold font-sans capitalize mt-1 ${severity === 'severe' ? 'text-red-700' : severity === 'moderate' ? 'text-amber-700' : 'text-emerald-700'}`}>{severity}</p>
              </BentoCard>

              <BentoCard delay={1.7} className="bg-gradient-to-br from-sky-50 to-white border-sky-200 text-center" bgColor="">
                <div className="w-10 h-10 rounded-xl bg-sky-100 mx-auto mb-2 flex items-center justify-center">
                  <Clock size={18} className="text-sky-600" />
                </div>
                <p className="text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider">{t(lang, 'Recovery', 'Pemulihan')}</p>
                <p className="text-xl font-extrabold font-sans text-sky-700 mt-1">
                  {data.expected_recovery_days > 0 ? `~${data.expected_recovery_days}` : '—'}
                  <span className="text-sm font-semibold ml-1">{t(lang, 'days', 'hari')}</span>
                </p>
              </BentoCard>
            </div>

            {/* NPK Not Required — Green success */}
            <BentoCard delay={2} className="bg-gradient-to-br from-emerald-50/80 to-white border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
                <p className="font-sans text-base font-bold text-emerald-700">
                  {t(lang, 'Standard NPK is NOT Required', 'NPK Standard TIDAK Diperlukan')}
                </p>
              </div>
            </BentoCard>

            {/* Soil Test Upsell — Blue (Info) */}
            <BentoCard delay={2.5} className="bg-gradient-to-br from-sky-50/80 to-white border-l-4 border-l-sky-500 border-sky-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                  <Info size={18} className="text-sky-600" />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-base font-bold text-foreground mb-1">
                    {t(lang, 'Want pinpoint precision?', 'Mahu ketepatan tepat?')}
                  </p>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed font-medium">
                    {t(lang,
                      'Upload a Soil Test Report for exact dosage tailored to your field.',
                      'Muat naik Laporan Ujian Tanah untuk dos tepat disesuaikan ladang anda.'
                    )}
                  </p>
                  {onUploadSoil && (
                    <button
                      onClick={onUploadSoil}
                      className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-sans font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                    >
                      <Upload size={14} />
                      {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
                    </button>
                  )}
                </div>
              </div>
            </BentoCard>

            {/* Disclaimer */}
            <BentoCard delay={3} className="bg-gradient-to-br from-amber-50/60 to-white border-amber-200 !p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-sans text-amber-800 font-medium">
                  <span className="font-bold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang, 'AI-generated plan. Verify with an agronomist.', 'Pelan dijana AI. Sahkan dengan ahli agronomi.')}
                </p>
              </div>
            </BentoCard>
          </TabsContent>

          {/* ========== Shopping ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-sans">
                  🌱 {plotName} · {cropType} · {farmSize} ha
                </span>
              </div>
              <SpeakerButton
                text={t(lang,
                  `Shopping list for ${data.issue_name} treatment. ${data.shopping_list.length} products recommended. Grand total for ${hectares} hectares: RM${grandTotal.toFixed(2)}.`,
                  `Senarai belanja untuk rawatan ${data.issue_name}. ${data.shopping_list.length} produk disyorkan. Jumlah keseluruhan untuk ${hectares} hektar: RM${grandTotal.toFixed(2)}.`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Unified Receipt Card */}
            <BentoCard delay={0.5} className="shadow-lg overflow-hidden !p-0" bgColor="">
              <div style={{ background: 'linear-gradient(to bottom right, rgba(236,253,245,0.2), white, white)' }}>
                <div className="px-6 pt-6 pb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-foreground">
                      {t(lang, 'Treatment Products', 'Produk Rawatan')}
                    </h3>
                    <p className="text-sm font-sans text-muted-foreground font-medium">
                      {data.issue_name} · {hectares} ha
                    </p>
                  </div>
                </div>

                <div className="px-6">
                  {data.shopping_list.map((item, i) => {
                    const totalPrice = item.price_per_ha_rm * hectares;
                    return (
                      <div key={i} className={`flex items-center justify-between py-5 ${i < data.shopping_list.length - 1 ? 'border-b border-emerald-100' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                            <Package size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-sans font-bold text-foreground text-lg">{item.product_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-sans font-bold capitalize ${typeColors[item.type] || 'bg-muted text-muted-foreground'}`}>
                                {item.type}
                              </span>
                              <span className="text-sm text-muted-foreground font-sans font-medium">
                                {item.quantity_per_ha}/ha
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="font-sans font-extrabold text-foreground text-xl tabular-nums shrink-0">RM{totalPrice.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mx-6 border-t-2 border-foreground/20" />
                <div className="px-6 py-6 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xl font-bold text-foreground">{t(lang, 'Grand Total', 'Jumlah Keseluruhan')}</p>
                    <p className="text-sm font-sans text-muted-foreground font-medium">
                      {t(lang, `${data.shopping_list.length} products × ${hectares} ha`, `${data.shopping_list.length} produk × ${hectares} ha`)}
                    </p>
                  </div>
                  <p className="text-3xl font-sans font-extrabold text-foreground tabular-nums">
                    RM{grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Disclaimer */}
            <BentoCard delay={2} className="bg-gradient-to-br from-amber-50/60 to-white border-amber-200 !p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-sans text-amber-800 font-medium">
                  <span className="font-bold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang, 'Prices are estimates. Verify at your local shop.', 'Harga adalah anggaran. Sahkan di kedai tempatan.')}
                </p>
              </div>
            </BentoCard>
          </TabsContent>

          {/* ========== Advice — Success Roadmap ========== */}
          <TabsContent value="advice" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-sans">
                  🌱 {plotName} · {cropType}
                </span>
              </div>
              <SpeakerButton
                text={t(lang,
                  `Action plan for ${data.issue_name}. ${data.action_plan.length} steps to follow.`,
                  `Pelan tindakan untuk ${data.issue_name}. ${data.action_plan.length} langkah untuk diikuti.`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Roadmap Header */}
            <BentoCard delay={0.5} className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Target size={28} className="text-emerald-600" />
              </div>
              <h3 className="font-sans text-xl font-bold text-foreground">
                {t(lang, 'Recovery Roadmap', 'Peta Pemulihan')}
              </h3>
              <p className="text-sm font-sans text-muted-foreground mt-1">
                {t(lang, `${data.action_plan.length} steps to recovery`, `${data.action_plan.length} langkah pemulihan`)}
              </p>
            </BentoCard>

            {/* Action Plan Steps — Individual Bento Cards */}
            {data.action_plan.map((step, i) => {
              const IconComponent = stepIcons[i % stepIcons.length];
              const color = stepColors[i % stepColors.length];

              return (
                <BentoCard key={i} delay={1 + i * 0.2} className="border-l-4 border-l-primary">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center shrink-0 ring-2 ${color.ring}`}>
                      <IconComponent size={18} className={color.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-sans font-bold">
                          {t(lang, `Step ${i + 1}`, `Langkah ${i + 1}`)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-bold ${getTimingColor(step.timing)}`}>
                          <Clock size={10} className="inline mr-1" />{step.timing}
                        </span>
                      </div>
                      <p className="text-base font-sans font-bold text-foreground">{step.title.replace(/\*\*/g, '')}</p>
                      <p className="text-sm font-sans text-muted-foreground leading-snug font-medium mt-0.5 line-clamp-2">{step.description}</p>
                    </div>
                  </div>
                </BentoCard>
              );
            })}

            {/* Prevention Tips — 2-column Bento Grid */}
            <motion.div custom={2.5} variants={fadeUp} initial="hidden" animate="visible">
              <p className="font-sans text-sm font-bold text-primary mb-3 uppercase tracking-wider px-1">
                {t(lang, 'Prevention Tips', 'Petua Pencegahan')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.prevention_tips.map((tip, i) => {
                  const shortTip = tip.length > 80 ? tip.slice(0, tip.indexOf('.', 30) + 1 || 80) || tip.slice(0, 80) + '…' : tip;
                  const tipIcons = [Shield, ThermometerSun, Leaf, Bug, Droplets];
                  const TipIcon = tipIcons[i % tipIcons.length];
                  const tipColors = ['text-emerald-600 bg-emerald-100', 'text-amber-600 bg-amber-100', 'text-sky-600 bg-sky-100', 'text-red-600 bg-red-100', 'text-blue-600 bg-blue-100'];
                  const tipColor = tipColors[i % tipColors.length];

                  return (
                    <div key={i} className="rounded-xl bg-card border border-border/30 shadow-sm p-4 flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${tipColor.split(' ')[1]} flex items-center justify-center shrink-0`}>
                        <TipIcon size={14} className={tipColor.split(' ')[0]} />
                      </div>
                      <p className="text-sm font-sans text-foreground font-medium leading-snug">{shortTip}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-center text-xs text-muted-foreground font-sans italic leading-relaxed">
                ⚠️ {t(lang, 'AI-generated advice. Verify with an agronomist.', 'Nasihat dijana AI. Sahkan dengan ahli agronomi.')}
              </p>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer with Back to My Plots */}
      {onBackToPlots && (
        <footer className="bg-card border-t border-border/60 px-4 md:px-8 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPlots}
              className="flex-1 py-2.5 rounded-full font-sans font-semibold text-sm flex items-center justify-center gap-2 btn-secondary-outline border-primary/60"
            >
              <ArrowLeft size={14} />
              {t(lang, 'Back to My Plots', 'Kembali ke Ladang Saya')}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
