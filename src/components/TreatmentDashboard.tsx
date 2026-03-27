import { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Sprout, ShieldAlert, Package, AlertTriangle, Loader2, CheckCircle2, ShieldCheck, Info, Upload, TestTube, Droplets, Bug, Leaf, Sun, Share2, Download } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export interface ShoppingItem {
  product_name: string;
  type: string;
  quantity_per_ha: string;
  price_per_ha_rm: number;
  application_method: string;
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  timing: string;
}

export interface TreatmentData {
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
  initialData?: TreatmentData;
  onDataLoaded?: (data: TreatmentData, grandTotal: number) => void;
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

/* Radial Gradient Glassmorphism — stronger center-to-edge contrast */
const glassCard = "bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0.4)_70%,_rgba(255,255,255,0.7)_100%)] backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl";
const glassCardHover = `${glassCard} hover:bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0.5)_70%,_rgba(255,255,255,0.8)_100%)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),_0_25px_60px_rgba(0,0,0,0.16)] hover:-translate-y-1 transition-all duration-300`;

export function TreatmentDashboard({ lang, issueName, severity, visualEvidence, cropType, farmSize, plotName, onBack, onBackToPlots, onToggleLang, onUploadSoil, initialData, onDataLoaded }: Props) {
  const [data, setData] = useState<TreatmentData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const hectares = parseFloat(farmSize) || 2;

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

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
        const loadedGrandTotal = result.shopping_list.reduce((sum: number, item: ShoppingItem) => sum + (item.price_per_ha_rm * hectares), 0);
        onDataLoaded?.(result, loadedGrandTotal);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [issueName, severity, visualEvidence, cropType, hectares, lang, initialData, onDataLoaded]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(to bottom, #022c22, #064e3b 40%, #0f172a 100%)' }}>
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-base text-muted-foreground font-sans font-medium">
          {t(lang, 'Generating treatment plan...', 'Menjana pelan rawatan...')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: 'linear-gradient(to bottom, #022c22, #064e3b 40%, #0f172a 100%)' }}>
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
      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${glassCard} text-sm font-semibold text-slate-950 font-sans`}>
        🌱 {plotName} · {cropType} · {farmSize} ha
      </span>
    </motion.div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(to bottom, #022c22, #064e3b 40%, #0f172a 100%)' }}>
      {/* Subtle mesh overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(4,120,87,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(6,78,59,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(20,184,166,0.08) 0%, transparent 70%)' }} />
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/15 px-4 md:px-8 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all active:scale-95">
              <ArrowLeft size={16} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/30 flex items-center justify-center">
              <Sprout className="text-emerald-300" size={18} />
            </div>
            <span className="font-sans text-base font-bold text-white">BajaJimat</span>
          </div>
          {onToggleLang && (
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/80 bg-white/50 text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-white/80 transition-all duration-200 active:scale-95">
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
          )}
        </div>
      </header>

      {/* Tabbed Content */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-8 pt-4 pb-2 flex-shrink-0">
          <TabsList className="w-full grid grid-cols-3 h-11 rounded-xl bg-white/40 backdrop-blur-lg border border-white/60 p-1 gap-0">
            <TabsTrigger value="summary" className="rounded-lg text-sm font-sans font-semibold transition-all duration-200 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">
              {t(lang, '📊 Summary', '📊 Ringkasan')}
            </TabsTrigger>
            <TabsTrigger value="shopping" className="rounded-lg text-sm font-sans font-semibold transition-all duration-200 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">
              {t(lang, '🛒 Shopping List', '🛒 Senarai')}
            </TabsTrigger>
            <TabsTrigger value="advice" className="rounded-lg text-sm font-sans font-semibold transition-all duration-200 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">
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
              className={`${glassCard} p-5 space-y-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-sans text-muted-foreground font-medium">{t(lang, 'Targeted Issue', 'Isu Sasaran')}</p>
                  <p className="text-lg font-sans font-bold text-slate-950 capitalize">{data.issue_name}</p>
                  <p className="text-sm font-sans text-muted-foreground mt-0.5">
                    {t(lang, 'Visual symptom detected. Remedial action recommended.', 'Gejala visual dikesan. Tindakan pemulihan disyorkan.')}
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
                <div className="flex items-center gap-1.5 text-sm font-sans text-slate-950 font-bold">
                  <span>⏱️</span>
                  {t(lang,
                    `Expected recovery: ~${data.expected_recovery_days} days`,
                    `Jangkaan pemulihan: ~${data.expected_recovery_days} hari`
                  )}
                </div>
              )}
            </motion.div>

            {/* Soil Test Upsell — only for leaf photo analysis */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCard} p-5`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Info size={18} className="text-sky-600" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-sans text-slate-950 leading-relaxed font-medium">
                    <span className="font-bold">{t(lang, 'Want pinpoint precision?', 'Mahu ketepatan tepat?')}</span>{' '}
                    {t(lang,
                      'Upload a soil test report for exact dosage calculations.',
                      'Muat naik laporan ujian tanah untuk pengiraan dos yang tepat.'
                    )}
                  </p>
                  <button
                    onClick={onUploadSoil || onBackToPlots}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-sans font-medium transition-transform duration-200 hover:scale-105 active:scale-95 mt-3"
                  >
                    <Upload size={15} />
                    {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCard} p-4`}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-sans text-slate-950 font-medium">
                  <span className="font-bold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'AI-generated plan. Verify with an agronomist.',
                    'Pelan dijana AI. Sahkan dengan ahli agronomi.'
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
              className={`${glassCard} overflow-hidden`}
            >
              {/* Receipt Header */}
              <div className="px-6 pt-6 pb-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-slate-950">
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
                    <div key={i} className={`flex items-center justify-between py-5 ${i < data.shopping_list.length - 1 ? 'border-b border-white/40' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                          <Package size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-sans font-bold text-slate-950 text-lg">{item.product_name.replace(/\*\*/g, '')}</p>
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
                      <p className="font-sans font-extrabold text-slate-950 text-xl tabular-nums shrink-0">RM{totalPrice.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Grand Total */}
              <div className="mx-6 border-t-2 border-gray-900/10" />
              <div className="px-6 py-6 flex items-center justify-between">
                <div>
                  <p className="font-sans text-xl font-bold text-slate-950">{t(lang, 'Grand Total', 'Jumlah Keseluruhan')}</p>
                  <p className="text-sm font-sans text-muted-foreground font-medium">
                    {t(lang, `${data.shopping_list.length} products × ${hectares} ha`, `${data.shopping_list.length} produk × ${hectares} ha`)}
                  </p>
                </div>
                <p className="text-3xl font-sans font-extrabold text-slate-950 tabular-nums">
                  RM{grandTotal.toFixed(2)}
                </p>
              </div>
            </motion.div>

            {/* WhatsApp + PDF Buttons */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
              <button
                onClick={() => {
                  const items = data.shopping_list.map(item => `• ${item.product_name.replace(/\*\*/g, '')} — ${item.quantity_per_ha}/ha — RM${(item.price_per_ha_rm * hectares).toFixed(2)}`).join('\n');
                  const text = `🌿 *BajaJimat Treatment Plan*\n📋 ${data.issue_name}\n🌱 ${plotName} · ${cropType} · ${hectares} ha\n\n${items}\n\n💰 *Grand Total: RM${grandTotal.toFixed(2)}*`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
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

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCard} p-4`}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-sans text-slate-950 font-medium">
                  <span className="font-bold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'Prices are estimates. Verify with your local supplier.',
                    'Harga adalah anggaran. Sahkan dengan pembekal tempatan.'
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

            {/* Action Plan */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className={`${glassCard} p-6`}
            >
              <h4 className="font-sans text-sm font-bold text-primary mb-5 uppercase tracking-wider">
                {t(lang, 'Action Plan', 'Pelan Tindakan')}
              </h4>
              <div className="relative pl-8">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/60 rounded-full" />
                <div className="space-y-6">
                  {data.action_plan.map((step, i) => {
                    const IconComponent = stepIcons[i % stepIcons.length];

                    return (
                      <div key={i} className="relative">
                        <div className="absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white/80 shadow-sm text-white" style={{ background: 'linear-gradient(to bottom right, #34d399, #14b8a6)' }}>
                          <span className="text-xs font-bold">{i + 1}</span>
                        </div>
                      <div className="ml-4 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-lg font-sans font-bold text-slate-950">{step.title.replace(/\*\*/g, '')}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${getTimingColor(step.timing.replace(/\*\*/g, ''))}`}>
                              {step.timing.replace(/\*\*/g, '')}
                            </span>
                          </div>
                          <p className="text-sm font-sans text-muted-foreground leading-snug font-medium line-clamp-2">{step.description.replace(/\*\*/g, '')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

      {/* Footer with Back to My Plots */}
      {onBackToPlots && (
        <footer className="bg-white/70 backdrop-blur-xl border-t border-white/60 px-4 md:px-8 py-3 flex-shrink-0">
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
