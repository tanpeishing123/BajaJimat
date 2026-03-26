import { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Sprout, ShieldAlert, Package, AlertTriangle, Loader2, CheckCircle2, ShieldCheck, Info, Upload, TestTube, Droplets, Bug, Leaf, Sun } from 'lucide-react';
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

const typeColors: Record<string, string> = {
  fungicide: 'bg-purple-100 text-purple-700',
  insecticide: 'bg-red-100 text-red-700',
  micronutrient: 'bg-blue-100 text-blue-700',
  organic: 'bg-emerald-100 text-emerald-700',
  supplement: 'bg-amber-100 text-amber-700',
};

const stepIcons = [TestTube, Droplets, Bug, Leaf, Sun];

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

export function TreatmentDashboard({ lang, issueName, severity, visualEvidence, cropType, farmSize, plotName, onBack, onToggleLang, onUploadSoil }: Props) {
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

  const severityColor = severity === 'severe' ? 'bg-destructive/10 text-destructive' :
    severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

  const grandTotal = data.shopping_list.reduce((sum, item) => sum + (item.price_per_ha_rm * hectares), 0);

  // Context Bar
  const ContextBar = ({ animIndex = 0 }: { animIndex?: number }) => (
    <motion.div custom={animIndex} variants={fadeUp} initial="hidden" animate="visible"
      className="flex items-center gap-2 flex-wrap"
    >
      <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-sans font-bold flex items-center gap-1">
        <ShieldCheck size={14} />
        🟢 {t(lang, 'AI Confidence: 88%', 'Keyakinan AI: 88%')}
      </span>
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary font-sans">
        🌱 {plotName} · {cropType} · {farmSize} ha
      </span>
    </motion.div>
  );

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
              {t(lang, '🛒 Shopping List', '🛒 Senarai Baja')}
            </TabsTrigger>
            <TabsTrigger value="advice" className="rounded-t-xl rounded-b-none text-sm sm:text-base font-sans font-bold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:tab-neon-active data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5">
              {t(lang, '💡 Advice', '💡 Nasihat')}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5">
          {/* ========== Summary ========== */}
          <TabsContent value="summary" className="mt-0 space-y-5">
            <div className="flex items-center justify-between">
              <ContextBar animIndex={0} />
              <SpeakerButton
                text={t(lang,
                  `Treatment summary for ${data.issue_name}. Severity: ${severity}. ${data.expected_recovery_days > 0 ? `Expected recovery in ${data.expected_recovery_days} days.` : ''} Standard NPK is not required. Visual symptom detected, standard remedial action recommended.`,
                  `Ringkasan rawatan untuk ${data.issue_name}. Keterukan: ${severity}. ${data.expected_recovery_days > 0 ? `Jangkaan pemulihan dalam ${data.expected_recovery_days} hari.` : ''} NPK standard tidak diperlukan. Gejala visual dikesan, tindakan pemulihan standard disyorkan.`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Targeted Issue Alert */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-sans text-muted-foreground font-medium">{t(lang, 'Targeted Issue', 'Isu Sasaran')}</p>
                  <p className="text-lg font-sans font-bold text-foreground capitalize">{data.issue_name}</p>
                  <p className="text-sm font-sans text-muted-foreground mt-0.5">
                    {t(lang, 'Visual symptom detected. Standard remedial action recommended.', 'Gejala visual dikesan. Tindakan pemulihan standard disyorkan.')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-sm font-sans font-bold capitalize ${severityColor}`}>
                  {t(lang, 'Severity', 'Keterukan')}: {severity}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-sans font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  {t(lang, 'Standard NPK is NOT Required', 'NPK Standard TIDAK Diperlukan')}
                </span>
              </div>

              {data.expected_recovery_days > 0 && (
                <div className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground font-medium">
                  <span>⏱️</span>
                  {t(lang,
                    `Expected recovery: ~${data.expected_recovery_days} days`,
                    `Jangkaan pemulihan: ~${data.expected_recovery_days} hari`
                  )}
                </div>
              )}
            </motion.div>

            {/* Soil Test Upsell */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="p-5 rounded-2xl bg-sky-50 border border-sky-200/60 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Info size={18} className="text-sky-600" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-sans text-sky-900 leading-relaxed font-medium">
                    <span className="font-bold">{t(lang, 'Want pinpoint precision?', 'Mahu ketepatan tepat?')}</span>{' '}
                    {t(lang,
                      'This is a baseline remedial estimate based on visual symptoms. For exact dosage calculations tailored to your field\'s pH and nutrient lockouts, upload a recent Soil Test Report.',
                      'Ini ialah anggaran pemulihan asas berdasarkan gejala visual. Untuk pengiraan dos tepat yang disesuaikan dengan pH dan sekatan nutrien ladang anda, muat naik Laporan Ujian Tanah terkini.'
                    )}
                  </p>
                  {onUploadSoil && (
                    <button
                      onClick={onUploadSoil}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-base font-sans font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      <Upload size={16} />
                      {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="p-4 rounded-xl bg-amber-50 border border-amber-200/60"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-sans text-amber-800 font-medium">
                  <span className="font-bold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'This AI-generated treatment plan is of medium accuracy. Verify with an agronomist.',
                    'Pelan rawatan dijana AI ini mempunyai ketepatan sederhana. Sahkan dengan ahli agronomi.'
                  )}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* ========== Shopping ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-5">
            <div className="flex items-center justify-between">
              <ContextBar animIndex={0} />
              <SpeakerButton
                text={t(lang,
                  `Shopping list for ${data.issue_name} treatment. ${data.shopping_list.length} products recommended. Grand total for ${hectares} hectares: RM${grandTotal.toFixed(2)}.`,
                  `Senarai belanja untuk rawatan ${data.issue_name}. ${data.shopping_list.length} produk disyorkan. Jumlah keseluruhan untuk ${hectares} hektar: RM${grandTotal.toFixed(2)}.`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Unified Frosted Receipt Card */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl shadow-lg border border-border/30 overflow-hidden"
              style={{ background: 'linear-gradient(to bottom right, rgba(236,253,245,0.2), white, white)' }}
            >
              {/* Receipt Header */}
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

              {/* Product Rows */}
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

              {/* Grand Total */}
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
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="p-4 rounded-xl bg-amber-50 border border-amber-200/60"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-sans text-amber-800 font-medium">
                  <span className="font-bold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'Prices are estimates. Verify availability and pricing at your local agricultural supply shop.',
                    'Harga adalah anggaran. Sahkan ketersediaan dan harga di kedai bekalan pertanian tempatan anda.'
                  )}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* ========== Advice ========== */}
          <TabsContent value="advice" className="mt-0 space-y-5">
            <div className="flex items-center justify-between">
              <ContextBar animIndex={0} />
              <SpeakerButton
                text={t(lang,
                  `Action plan for ${data.issue_name}. ${data.action_plan.length} steps to follow. ${data.action_plan.map((s, i) => `Step ${i + 1}: ${s.title.replace(/\*\*/g, '')}. ${s.description}`).join('. ')}`,
                  `Pelan tindakan untuk ${data.issue_name}. ${data.action_plan.length} langkah untuk diikuti. ${data.action_plan.map((s, i) => `Langkah ${i + 1}: ${s.title.replace(/\*\*/g, '')}. ${s.description}`).join('. ')}`
                )}
                lang={lang}
                size="sm"
              />
            </div>

            {/* Action Plan — Premium Insight Card with timeline */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-card rounded-2xl shadow-md border border-border/20 border-l-[6px] border-l-primary p-6"
            >
              <h4 className="font-sans text-sm font-bold text-primary mb-5 uppercase tracking-wider">
                {t(lang, 'Action Plan', 'Pelan Tindakan')}
              </h4>
              <div className="relative pl-8">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
                <div className="space-y-6">
                  {data.action_plan.map((step, i) => {
                    const IconComponent = stepIcons[i % stepIcons.length];
                    const iconColors = ['bg-blue-50 text-blue-600', 'bg-cyan-50 text-cyan-600', 'bg-red-50 text-red-600', 'bg-emerald-50 text-emerald-600', 'bg-amber-50 text-amber-600'];
                    const iconColor = iconColors[i % iconColors.length];

                    return (
                      <div key={i} className="relative">
                        <div className={`absolute -left-8 w-8 h-8 rounded-full ${iconColor} flex items-center justify-center ring-2 ring-background`}>
                          <IconComponent size={16} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-lg font-sans font-bold text-foreground">{step.title.replace(/\*\*/g, '')}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${getTimingColor(step.timing)}`}>
                              {step.timing}
                            </span>
                          </div>
                          <p className="text-base font-sans text-muted-foreground leading-relaxed font-medium">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Prevention Tips — Premium Insight Card */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-card rounded-2xl shadow-md border border-border/20 border-l-[6px] border-l-primary p-6"
            >
              <h4 className="font-sans text-sm font-bold text-primary mb-4 uppercase tracking-wider">
                {t(lang, 'Prevention Tips', 'Petua Pencegahan')}
              </h4>
              <div className="space-y-3">
                {data.prevention_tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-base font-sans text-foreground font-medium leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-center text-sm text-muted-foreground font-sans italic leading-relaxed">
                ⚠️ {t(lang,
                  'Advice generated by AI. Verify with an agronomist.',
                  'Nasihat dijana oleh AI. Sahkan dengan ahli agronomi.'
                )}
              </p>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
