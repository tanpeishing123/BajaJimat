import { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Sprout, ShieldAlert, Package, ClipboardList, AlertTriangle, Loader2, CheckCircle2, Clock, ShieldCheck, Info, Upload } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface TreatmentData {
  issue_name: string;
  shopping_list: {
    product_name: string;
    type: string;
    quantity: string;
    estimated_price_rm: number;
    application_method: string;
  }[];
  total_estimated_cost_rm: number;
  action_plan: {
    step: number;
    title: string;
    description: string;
    timing: string;
  }[];
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

export function TreatmentDashboard({ lang, issueName, severity, visualEvidence, cropType, farmSize, plotName, onBack, onToggleLang }: Props) {
  const [data, setData] = useState<TreatmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            farm_size_ha: parseFloat(farmSize) || 2,
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
  }, [issueName, severity, visualEvidence, cropType, farmSize, lang]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm text-muted-foreground font-sans">
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
        <p className="text-sm text-destructive font-sans text-center max-w-md">{error}</p>
        <button onClick={onBack} className="px-6 py-2 rounded-full btn-gradient-primary font-sans font-semibold text-sm">
          {t(lang, 'Go Back', 'Kembali')}
        </button>
      </div>
    );
  }

  if (!data) return null;

  const severityColor = severity === 'severe' ? 'bg-destructive/10 text-destructive' :
    severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

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
            <TabsTrigger value="summary" className="rounded-t-xl rounded-b-none text-xs sm:text-sm font-sans font-semibold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md">
              {t(lang, '📊 Summary', '📊 Ringkasan')}
            </TabsTrigger>
            <TabsTrigger value="shopping" className="rounded-t-xl rounded-b-none text-xs sm:text-sm font-sans font-semibold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md">
              {t(lang, '🛒 Shopping', '🛒 Senarai')}
            </TabsTrigger>
            <TabsTrigger value="advice" className="rounded-t-xl rounded-b-none text-xs sm:text-sm font-sans font-semibold transition-all duration-300 bg-card text-primary border border-border/40 border-b-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md">
              {t(lang, '💡 Advice', '💡 Nasihat')}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
          {/* ========== Summary ========== */}
          <TabsContent value="summary" className="mt-0 space-y-4">
            {/* AI Confidence Badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-2 flex-wrap"
            >
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-sans font-semibold flex items-center gap-1">
                <ShieldCheck size={12} />
                🤖 {t(lang, 'AI Confidence: Medium', 'Keyakinan AI: Sederhana')}
              </span>
            </motion.div>

            {/* Targeted Issue Alert */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldAlert size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-sans text-muted-foreground">{t(lang, 'Targeted Issue', 'Isu Sasaran')}</p>
                  <p className="text-sm font-sans font-bold text-foreground capitalize">{data.issue_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${severityColor}`}>
                  {t(lang, 'Severity', 'Keterukan')}: {severity}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-sans font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  {t(lang, 'Standard NPK is NOT Required', 'NPK Standard TIDAK Diperlukan')}
                </span>
              </div>

              {data.expected_recovery_days > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground">
                  <Clock size={12} />
                  {t(lang,
                    `Expected recovery: ~${data.expected_recovery_days} days`,
                    `Jangkaan pemulihan: ~${data.expected_recovery_days} hari`
                  )}
                </div>
              )}
            </motion.div>

            {/* Farm Info */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="text-xs">🌱</span>
              <p className="text-xs font-medium text-primary font-sans">
                {plotName} · {cropType} · {farmSize} ha
              </p>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="p-3 rounded-xl bg-amber-50 border border-amber-200/60"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-sans text-amber-800">
                  <span className="font-semibold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'This AI-generated treatment plan is of medium accuracy. Verify with an agronomist.',
                    'Pelan rawatan dijana AI ini mempunyai ketepatan sederhana. Sahkan dengan ahli agronomi.'
                  )}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* ========== Shopping ========== */}
          <TabsContent value="shopping" className="mt-0 space-y-4">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-2"
            >
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-sans font-semibold flex items-center gap-1">
                <ShieldCheck size={12} />
                🤖 {t(lang, 'AI Confidence: Medium', 'Keyakinan AI: Sederhana')}
              </span>
            </motion.div>

            {data.shopping_list.map((item, i) => (
              <motion.div key={i} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
                className="p-4 rounded-2xl bg-card border border-border/40 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-bold text-foreground">{item.product_name}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold capitalize ${typeColors[item.type] || 'bg-muted text-muted-foreground'}`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-sans font-bold text-primary">RM{item.estimated_price_rm}</p>
                </div>
                <div className="flex items-center justify-between text-xs font-sans text-muted-foreground">
                  <span>{t(lang, 'Qty', 'Kuantiti')}: {item.quantity}</span>
                </div>
                <p className="text-xs font-sans text-muted-foreground">{item.application_method}</p>
              </motion.div>
            ))}

            {/* Total */}
            <motion.div custom={data.shopping_list.length + 1} variants={fadeUp} initial="hidden" animate="visible"
              className="p-4 rounded-2xl border-2 border-primary/30 bg-primary/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans font-bold text-foreground">
                  {t(lang, 'Estimated Total', 'Jumlah Anggaran')}
                </span>
                <span className="text-lg font-sans font-extrabold text-primary">
                  RM{data.total_estimated_cost_rm.toFixed(2)}
                </span>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={data.shopping_list.length + 2} variants={fadeUp} initial="hidden" animate="visible"
              className="p-3 rounded-xl bg-amber-50 border border-amber-200/60"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-sans text-amber-800">
                  <span className="font-semibold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'Prices are estimates. Verify availability and pricing at your local agricultural supply shop.',
                    'Harga adalah anggaran. Sahkan ketersediaan dan harga di kedai bekalan pertanian tempatan anda.'
                  )}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* ========== Advice ========== */}
          <TabsContent value="advice" className="mt-0 space-y-4">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-2"
            >
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-sans font-semibold flex items-center gap-1">
                <ShieldCheck size={12} />
                🤖 {t(lang, 'AI Confidence: Medium', 'Keyakinan AI: Sederhana')}
              </span>
            </motion.div>

            {/* Action Plan */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h3 className="text-sm font-sans font-bold text-foreground mb-3 flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                {t(lang, 'Step-by-Step Action Plan', 'Pelan Tindakan Langkah-demi-Langkah')}
              </h3>
            </motion.div>

            {data.action_plan.map((step, i) => (
              <motion.div key={i} custom={i + 2} variants={fadeUp} initial="hidden" animate="visible"
                className="p-4 rounded-2xl bg-card border border-border/40 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-xs font-sans font-bold text-primary-foreground">{step.step}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-sans font-bold text-foreground">{step.title}</p>
                    <p className="text-xs font-sans text-muted-foreground leading-relaxed">{step.description}</p>
                    <div className="flex items-center gap-1 text-xs font-sans text-primary">
                      <Clock size={11} />
                      {step.timing}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Prevention Tips */}
            <motion.div custom={data.action_plan.length + 3} variants={fadeUp} initial="hidden" animate="visible"
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 space-y-2"
            >
              <h4 className="text-xs font-sans font-bold text-emerald-800 uppercase tracking-wider">
                {t(lang, 'Prevention Tips', 'Petua Pencegahan')}
              </h4>
              {data.prevention_tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs font-sans text-emerald-800">{tip}</p>
                </div>
              ))}
            </motion.div>

            {/* Disclaimer */}
            <motion.div custom={data.action_plan.length + 4} variants={fadeUp} initial="hidden" animate="visible"
              className="p-3 rounded-xl bg-amber-50 border border-amber-200/60"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-sans text-amber-800">
                  <span className="font-semibold">{t(lang, 'Disclaimer', 'Penafian')}:</span>{' '}
                  {t(lang,
                    'This AI-generated treatment plan is of medium accuracy. Verify with an agronomist.',
                    'Pelan rawatan dijana AI ini mempunyai ketepatan sederhana. Sahkan dengan ahli agronomi.'
                  )}
                </p>
              </div>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
