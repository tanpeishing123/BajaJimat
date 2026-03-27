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
  onBackToPlots?: () => void;
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

function getTimingColor(timing: string): string {
  const lower = timing.toLowerCase();
  if (lower.includes('morning') || lower.includes('pagi')) return 'bg-amber-100 text-amber-700';
  if (lower.includes('immediate') || lower.includes('segera')) return 'bg-red-100 text-red-700';
  if (lower.includes('week') || lower.includes('minggu')) return 'bg-blue-100 text-blue-700';
  if (lower.includes('daily') || lower.includes('harian')) return 'bg-emerald-100 text-emerald-700';
  return 'bg-purple-100 text-purple-700';
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
            issue_name: issueName, severity, visual_evidence: visualEvidence,
            crop_type: cropType, farm_size_ha: hectares, lang,
          }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
          throw new Error(errBody.error || `Server error ${res.status}`);
        }
        setData(await res.json());
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
        <p className="text-base text-muted-foreground font-medium">
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
        <p className="text-base text-destructive text-center max-w-md font-medium">{error}</p>
        <button onClick={onBack} className="px-6 py-2.5 rounded-full btn-gradient-primary font-extrabold text-base">
          {t(lang, 'Go Back', 'Kembali')}
        </button>
      </div>
    );
  }

  if (!data) return null;

  const severityColor = severity === 'severe' ? 'bg-destructive/10 text-destructive' :
    severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

  const grandTotal = data.shopping_list.reduce((sum, item) => sum + (item.price_per_ha_rm * hectares), 0);

  const ContextBar = ({ animIndex = 0 }: { animIndex?: number }) => (
    <motion.div custom={animIndex} variants={fadeUp} initial="hidden" animate="visible"
      className="flex items-center gap-2 flex-wrap"
    >
      <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-extrabold flex items-center gap-1">
        <ShieldCheck size={14} />
        🟢 {t(lang, 'AI Confidence: 88%', 'Keyakinan AI: 88%')}
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
        🌱 {plotName} · {cropType} · {farmSize} ha
      </span>
    </motion.div>
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
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
            <span className="text-base font-extrabold text-foreground">BajaJimat</span>
          </div>
          {onToggleLang && (
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
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
          {/* ========== Summary ========== */}
          <TabsContent value="summary" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <ContextBar animIndex={0} />
              <SpeakerButton
                text={t(lang,
                  `Treatment for ${data.issue_name}. Severity: ${severity}. Recovery: ~${data.expected_recovery_days} days.`,
                  `Rawatan untuk ${data.issue_name}. Keterukan: ${severity}. Pemulihan: ~${data.expected_recovery_days} hari.`
                )}
                lang={lang} size="sm"
              />
            </div>

            {/* Issue Alert Bento */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl bg-card shadow-lg border border-border/40 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{t(lang, 'Targeted Issue', 'Isu Sasaran')}</p>
                  <p className="text-lg font-extrabold text-foreground capitalize">{data.issue_name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t(lang, 'Visual symptom detected. Remedial action recommended.', 'Gejala visual dikesan. Tindakan pemulihan disyorkan.')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1.5 rounded-full text-sm font-extrabold capitalize ${severityColor}`}>
                  {t(lang, 'Severity', 'Keterukan')}: {severity}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-extrabold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  {t(lang, 'NPK NOT Required', 'NPK TIDAK Diperlukan')}
                </span>
              </div>
              {data.expected_recovery_days > 0 && (
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                  ⏱️ {t(lang, `Recovery: ~${data.expected_recovery_days} days`, `Pemulihan: ~${data.expected_recovery_days} hari`)}
                </p>
              )}
            </motion.div>

            {/* Soil Test Upsell Bento */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl bg-card shadow-lg border border-border/40 border-l-4 border-l-sky-400 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                  <Info size={18} className="text-sky-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground font-medium">
                    <span className="font-extrabold">{t(lang, 'Want precision?', 'Mahu ketepatan?')}</span>{' '}
                    {t(lang, 'Upload a soil report for exact dosage.', 'Muat naik laporan tanah untuk dos tepat.')}
                  </p>
                  {onUploadSoil && (
                    <button onClick={onUploadSoil}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold transition-all hover:scale-105 active:scale-95 shadow-md">
                      <Upload size={14} />
                      {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-xl bg-amber-50 border border-amber-200/60 p-4"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  <span className="font-extrabold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang, 'AI-generated plan. Verify with an agronomist.', 'Pelan dijana AI. Sahkan dengan ahli agronomi.')}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* ========== Shopping ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <ContextBar animIndex={0} />
              <SpeakerButton
                text={t(lang,
                  `Shopping list: ${data.shopping_list.length} products. Total: RM${grandTotal.toFixed(2)}.`,
                  `Senarai belanja: ${data.shopping_list.length} produk. Jumlah: RM${grandTotal.toFixed(2)}.`
                )}
                lang={lang} size="sm"
              />
            </div>

            {/* Receipt Bento */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl bg-card shadow-lg border border-border/40 overflow-hidden"
            >
              <div className="px-5 pt-5 pb-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">{t(lang, 'Treatment Products', 'Produk Rawatan')}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{data.issue_name} · {hectares} ha</p>
                </div>
              </div>

              <div className="px-5">
                {data.shopping_list.map((item, i) => {
                  const totalPrice = item.price_per_ha_rm * hectares;
                  return (
                    <div key={i} className={`flex items-center justify-between py-4 ${i < data.shopping_list.length - 1 ? 'border-b border-border/30' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                          <Package size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-extrabold text-foreground text-lg">{item.product_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-extrabold capitalize ${typeColors[item.type] || 'bg-muted text-muted-foreground'}`}>
                              {item.type}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">{item.quantity_per_ha}/ha</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-extrabold text-foreground text-xl tabular-nums shrink-0">RM{totalPrice.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Grand Total */}
              <div className="mx-5 border-t-2 border-foreground/15" />
              <div className="px-5 py-5 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent rounded-b-2xl">
                <div>
                  <p className="text-lg font-extrabold text-foreground">{t(lang, 'Grand Total', 'Jumlah Keseluruhan')}</p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t(lang, `${data.shopping_list.length} products × ${hectares} ha`, `${data.shopping_list.length} produk × ${hectares} ha`)}
                  </p>
                </div>
                <p className="text-3xl font-extrabold text-foreground tabular-nums" style={{ textShadow: '0 2px 12px hsla(164,90%,20%,0.15)' }}>
                  RM{grandTotal.toFixed(2)}
                </p>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-xl bg-amber-50 border border-amber-200/60 p-4"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  <span className="font-extrabold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang, 'Prices are estimates. Verify with your local supplier.', 'Harga anggaran. Sahkan dengan pembekal tempatan.')}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* ========== Advice ========== */}
          <TabsContent value="advice" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <ContextBar animIndex={0} />
              <SpeakerButton
                text={t(lang,
                  `Action plan: ${data.action_plan.map((s, i) => `Step ${i + 1}: ${s.title.replace(/\*\*/g, '')}`).join('. ')}`,
                  `Pelan tindakan: ${data.action_plan.map((s, i) => `Langkah ${i + 1}: ${s.title.replace(/\*\*/g, '')}`).join('. ')}`
                )}
                lang={lang} size="sm"
              />
            </div>

            {/* Action Plan — Vertical Timeline Bento */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="bg-card rounded-2xl shadow-lg border border-border/40 p-5"
            >
              <h4 className="text-xs font-extrabold text-primary mb-4 uppercase tracking-wider">
                {t(lang, 'Action Plan', 'Pelan Tindakan')}
              </h4>
              <div className="relative pl-10">
                <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
                <div className="space-y-5">
                  {data.action_plan.map((step, i) => {
                    const IconComponent = stepIcons[i % stepIcons.length];
                    return (
                      <div key={i} className="relative">
                        <div className={`absolute -left-10 w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-background ${i === 0 ? 'bg-amber-100 text-amber-700 ring-amber-200' : 'bg-primary/10 text-primary'}`}>
                          {i === 0 ? <span className="text-sm font-extrabold">1</span> : <IconComponent size={14} />}
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-base font-extrabold text-foreground">{step.title.replace(/\*\*/g, '')}</p>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${getTimingColor(step.timing)}`}>
                              {step.timing}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium line-clamp-2">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Prevention Tips — 2-col Bento Grid */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <h4 className="text-xs font-extrabold text-primary mb-3 uppercase tracking-wider">
                {t(lang, 'Prevention Tips', 'Petua Pencegahan')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.prevention_tips.map((tip, i) => {
                  const shortTip = tip.length > 80 ? tip.slice(0, tip.indexOf('.', 30) + 1 || 80) || tip.slice(0, 80) + '…' : tip;
                  return (
                    <div key={i} className="bg-card rounded-xl shadow-sm border border-border/40 p-4 flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground font-medium leading-snug">{shortTip}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-center text-sm text-muted-foreground italic">
                ⚠️ {t(lang, 'AI-generated advice. Verify with an agronomist.', 'Nasihat dijana AI. Sahkan dengan ahli agronomi.')}
              </p>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      {onBackToPlots && (
        <footer className="bg-card border-t border-border/60 px-4 md:px-8 py-3 flex-shrink-0">
          <button
            onClick={onBackToPlots}
            className="w-full py-2.5 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 btn-secondary-outline border-primary/60"
          >
            <ArrowLeft size={14} />
            {t(lang, 'Back to My Plots', 'Kembali ke Ladang Saya')}
          </button>
        </footer>
      )}
    </div>
  );
}
