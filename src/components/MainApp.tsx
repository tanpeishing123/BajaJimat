import { useState } from 'react';
import { FileText, TestTubes, Leaf, Globe, Sprout, AlertTriangle, Zap, LogOut, Loader2, ShieldCheck, Activity, Cross, ShieldPlus } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { useSpeech } from '@/hooks/useSpeech';
import { SoilReportTab } from './tabs/SoilReportTab';
import { TestKitTab } from './tabs/TestKitTab';
import { LeafPhotoTab, type LeafAnalysisResult } from './tabs/LeafPhotoTab';
import { ResultsDashboard } from './ResultsDashboard';
import { TreatmentDashboard, type TreatmentData } from './TreatmentDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const NPK_NUTRIENTS = ['nitrogen', 'phosphorus', 'potassium'];

function hasNPKDeficiency(result: LeafAnalysisResult): boolean {
  return result.deficiencies.some(d =>
    NPK_NUTRIENTS.includes(d.nutrient.toLowerCase())
  );
}

function getNonNPKIssues(result: LeafAnalysisResult) {
  return result.deficiencies.filter(d =>
    !NPK_NUTRIENTS.includes(d.nutrient.toLowerCase())
  );
}

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

type TabKey = 'soil' | 'testkit' | 'leaf';
type InputMode = 'soil_report' | 'manual' | 'leaf_photo';

const CROP_MAP: Record<string, string> = {
  rubber: 'getah',
  'oil palm': 'kelapa_sawit',
  paddy: 'padi',
  rice: 'padi',
  durian: 'musang_king_durian',
  vegetables: 'sayur_sayuran',
  banana: 'pisang',
  pineapple: 'nanas',
  corn: 'jagung',
  cocoa: 'koko',
  coconut: 'kelapa',
};

const mapCrop = (raw: string): string => CROP_MAP[raw.toLowerCase()] ?? raw;


interface ResultData {
  recommendations: { name: string; bags: number; price_per_bag: number; subtotal_rm: number; is_liming?: boolean; reason?: string }[];
  total_cost_rm: number;
  savings_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  input_mode: InputMode;
  confidence: 'high' | 'medium' | 'low';
  voice_summary: string;
  liming_needed?: boolean;
  liming_recommendation?: { product: string; bags: number; cost_rm: number; reason: string };
  seasonal_advice?: { advice: string };
  crop_requirements_source?: string;
  soil_type?: string;
}

interface TreatmentHistoryEntry {
  date: string;
  input_mode: 'leaf_photo';
  total_cost_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  recommendations: [];
  confidence: 'medium';
  savings_rm: number;
  voice_summary: string;
  treatment_issue: string;
  treatment_severity: string;
  treatment_visual_evidence: string;
  remedial_shopping_list: TreatmentData['shopping_list'];
  remedial_grand_total_rm: number;
  treatment_action_plan: TreatmentData['action_plan'];
  treatment_severity_assessment: string;
  treatment_expected_recovery_days: number;
  leaf_deficiencies: LeafAnalysisResult['deficiencies'];
  leaf_overall_health?: string;
  leaf_recommendation?: string;
}

function updatePlotLastCost(plotId: string, totalCost: number, resultData: ResultData) {
  try {
    const plots = JSON.parse(localStorage.getItem('plots') || '[]');
    const historyEntry = {
      ...resultData,
      date: new Date().toISOString(),
    };
    const updated = plots.map((p: any) => {
      if (p.id !== plotId) return p;
      const history = [historyEntry, ...(p.history || [])].slice(0, 5);
      return { ...p, last_cost: totalCost, history };
    });
    localStorage.setItem('plots', JSON.stringify(updated));
  } catch {}
}

function saveTreatmentHistory(plotId: string, issue: { name: string; severity: string; evidence: string }, leafResult: LeafAnalysisResult | null, treatmentData: TreatmentData, grandTotal: number) {
  try {
    const plots = JSON.parse(localStorage.getItem('plots') || '[]');
    const historyEntry: TreatmentHistoryEntry = {
      date: new Date().toISOString(),
      input_mode: 'leaf_photo',
      total_cost_rm: grandTotal,
      n_deficit_kg: 0,
      p_deficit_kg: 0,
      k_deficit_kg: 0,
      recommendations: [],
      confidence: 'medium',
      savings_rm: 0,
      voice_summary: `Treatment for ${issue.name}`,
      treatment_issue: issue.name,
      treatment_severity: issue.severity,
      treatment_visual_evidence: issue.evidence,
      remedial_shopping_list: treatmentData.shopping_list,
      remedial_grand_total_rm: grandTotal,
      treatment_action_plan: treatmentData.action_plan,
      treatment_severity_assessment: treatmentData.severity_assessment,
      treatment_expected_recovery_days: treatmentData.expected_recovery_days,
      leaf_deficiencies: leafResult?.deficiencies || [],
      leaf_overall_health: leafResult?.overall_health,
      leaf_recommendation: leafResult?.recommendation,
    };

    const updated = plots.map((p: any) => {
      if (p.id !== plotId) return p;

      const existing = p.history || [];
      const recentIndex = existing.findIndex((h: any) =>
        h.treatment_issue === issue.name &&
        (Date.now() - new Date(h.date).getTime()) < 60000
      );

      const history = [...existing];
      if (recentIndex >= 0) {
        history[recentIndex] = historyEntry;
      } else {
        history.unshift(historyEntry);
      }

      return { ...p, last_cost: grandTotal, history: history.slice(0, 10) };
    });

    localStorage.setItem('plots', JSON.stringify(updated));
  } catch {}
}

export function MainApp({ profile, plotId, plotName, soilType: propSoilType, onLogout, lang: externalLang, onToggleLang }: { profile: UserProfile; plotId?: string; plotName?: string; soilType?: string; onLogout: () => void; lang: 'en' | 'bm'; onToggleLang: () => void }) {
  const lang = externalLang;
  const t = (en: string, bm: string) => lang === 'bm' ? bm : en;
  const [activeTab, setActiveTab] = useState<TabKey>('testkit');
  const [showResults, setShowResults] = useState(false);
  const [showLeafAnalysis, setShowLeafAnalysis] = useState(false);
  const [leafResult, setLeafResult] = useState<LeafAnalysisResult | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTreatment, setShowTreatment] = useState(false);
  const [treatmentIssue, setTreatmentIssue] = useState<{ name: string; severity: string; evidence: string } | null>(null);
  const { speak } = useSpeech(lang);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'soil', label: t('Soil Report', 'Laporan Tanah'), icon: <FileText size={16} /> },
    { key: 'testkit', label: t('Manual Entry', 'Kemasukan Manual'), icon: <TestTubes size={16} /> },
    { key: 'leaf', label: t('Leaf Photo', 'Foto Daun'), icon: <Leaf size={16} /> },
  ];

  const handleTestKitSubmit = async (n: number, p: number, k: number, ph?: number, mg?: number | null) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cropType = mapCrop(profile.crop || 'musang_king_durian');
      const farmSize = parseFloat(profile.farmSize) || 2.0;
      const soilType = propSoilType || localStorage.getItem('soil_type') || 'mineral';

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-solver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          input_mode: 'manual',
          soil_npk: { n_ppm: n, p_ppm: p, k_ppm: k, ph: ph ?? null, mg_ppm: mg ?? 0, confidence: 'high' },
          crop_type: cropType,
          farm_size_ha: farmSize,
          soil_type: soilType,
          ph: ph ?? null,
          mg_ppm: mg ?? 0,
          lang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Server error ${res.status}`);
      }

      const data: ResultData = await res.json();
      if (plotId) updatePlotLastCost(plotId, data.total_cost_rm, data);
      setResultData(data);
      setShowResults(true);

      // Voice readout removed — user clicks speaker button manually
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoilSubmit = async (data: { soil_npk: { n_ppm: number; p_ppm: number; k_ppm: number; confidence: string }; ph: number; mg_ppm?: number | null }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cropType = mapCrop(profile.crop || 'musang_king_durian');
      const farmSize = parseFloat(profile.farmSize) || 2.0;
      const soilType = propSoilType || localStorage.getItem('soil_type') || 'mineral';

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-solver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          input_mode: 'soil_report',
          soil_npk: data.soil_npk,
          crop_type: cropType,
          farm_size_ha: farmSize,
          soil_type: soilType,
          ph: data.ph ?? null,
          mg_ppm: data.mg_ppm ?? 0,
          lang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Server error ${res.status}`);
      }

      const result: ResultData = await res.json();
      if (plotId) updatePlotLastCost(plotId, result.total_cost_rm, result);
      setResultData(result);
      setShowResults(true);

      // Voice readout removed — user clicks speaker button manually
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeafSubmit = (result: LeafAnalysisResult) => {
    setLeafResult(result);
    setShowLeafAnalysis(true);
  };

  const handleLeafCalculate = async () => {
    if (!leafResult) return;
    setShowLeafAnalysis(false);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const cropType = mapCrop(profile.crop || 'musang_king_durian');
      const farmSize = parseFloat(profile.farmSize) || 2.0;
      const soilType = propSoilType || localStorage.getItem('soil_type') || 'mineral';

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-solver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          input_mode: 'leaf_photo',
          leaf_result: leafResult,
          crop_type: cropType,
          farm_size_ha: farmSize,
          soil_type: soilType,
          ph: null,
          mg_ppm: null,
          lang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Server error ${res.status}`);
      }

      const data: ResultData = await res.json();
      // Save full leaf analysis result including shopping list to history
      if (plotId) {
        const leafHistoryData: ResultData = {
          ...data,
          input_mode: 'leaf_photo',
        };
        updatePlotLastCost(plotId, data.total_cost_rm, leafHistoryData);
      }
      setResultData(data);
      setShowResults(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm text-muted-foreground font-sans">
          {t('Calculating your prescription...', 'Mengira preskripsi anda...')}
        </p>
      </div>
    );
  }

  // Error state
  if (errorMsg) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="text-destructive" size={32} />
        </div>
        <p className="text-sm text-destructive font-sans text-center max-w-md">{errorMsg}</p>
        <button
          onClick={() => setErrorMsg(null)}
          className="px-6 py-2 rounded-full btn-gradient-primary font-sans font-semibold text-sm"
        >
          {t('Try Again', 'Cuba Lagi')}
        </button>
      </div>
    );
  }

  // Treatment Dashboard for non-NPK issues
  if (showTreatment && treatmentIssue) {
    return (
      <TreatmentDashboard
        lang={lang}
        issueName={treatmentIssue.name}
        severity={treatmentIssue.severity}
        visualEvidence={treatmentIssue.evidence}
        cropType={profile.crop}
        farmSize={profile.farmSize}
        plotName={plotName || profile.crop}
        onBack={() => { setShowTreatment(false); setTreatmentIssue(null); setShowLeafAnalysis(true); }}
        onBackToPlots={onLogout}
        onToggleLang={onToggleLang}
        onUploadSoil={() => { setShowTreatment(false); setTreatmentIssue(null); setShowLeafAnalysis(false); setLeafResult(null); setActiveTab('soil'); }}
        onDataLoaded={(data, grandTotal) => {
          if (!plotId) return;
          saveTreatmentHistory(plotId, treatmentIssue, leafResult, data, grandTotal);
        }}
      />
    );
  }

  if (showResults && resultData) {
    return (
      <ResultsDashboard
        lang={lang}
        result={resultData}
        cropType={profile.crop}
        plotName={plotName || profile.crop}
        farmSize={profile.farmSize}
        onBack={onLogout}
        backLabel={t('Back to My Plots', 'Kembali ke Ladang Saya')}
        onToggleLang={onToggleLang}
        onUploadSoil={() => { setShowResults(false); setResultData(null); setActiveTab('soil'); }}
      />
    );
  }

  // Leaf Analysis Intermediate Screen
  if (showLeafAnalysis && leafResult) {
    const healthColors: Record<string, string> = {
      good: 'bg-emerald-50 text-emerald-700',
      fair: 'bg-amber-50 text-amber-700',
      poor: 'bg-orange-50 text-orange-700',
      critical: 'bg-destructive/10 text-destructive',
    };
    const severityColors: Record<string, string> = {
      mild: 'text-amber-600',
      moderate: 'text-orange-600',
      severe: 'text-destructive',
    };

    return (
      <div className="h-screen flex flex-col bg-background">
        <header className="bg-white border-b border-border/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <span className="font-sans text-base font-bold text-foreground">BajaJimat</span>
          </div>
          <button onClick={() => { setShowLeafAnalysis(false); setLeafResult(null); }} className="text-sm text-muted-foreground hover:text-foreground font-sans transition-colors">
            ← {t('Back', 'Kembali')}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto flex items-start justify-center px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-border/40 space-y-4"
          >
            {/* Health + Confidence badges + Speaker */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${healthColors[leafResult.overall_health] || 'bg-muted text-muted-foreground'}`}>
                <Activity size={12} className="inline mr-1" />
                {t('Health', 'Kesihatan')}: {leafResult.overall_health}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${
                  leafResult.confidence === 'high' ? 'bg-emerald-50 text-emerald-700' :
                  leafResult.confidence === 'medium' ? 'bg-amber-50 text-amber-700' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <ShieldCheck size={12} className="inline mr-1" />
                  {leafResult.confidence}
                </span>
                <SpeakerButton
                  text={t(
                    `Leaf analysis results. Overall health: ${leafResult.overall_health}. Confidence: ${leafResult.confidence}. ${leafResult.deficiencies.length > 0 ? `${leafResult.deficiencies.length} deficiencies detected: ${leafResult.deficiencies.map(d => `${d.nutrient}, severity ${d.severity}, ${d.estimated_deficit_pct} percent deficit`).join('. ')}.` : 'No deficiencies detected.'} ${leafResult.recommendation}`,
                    `Keputusan analisis daun. Kesihatan keseluruhan: ${leafResult.overall_health}. Keyakinan: ${leafResult.confidence}. ${leafResult.deficiencies.length > 0 ? `${leafResult.deficiencies.length} kekurangan dikesan: ${leafResult.deficiencies.map(d => `${d.nutrient}, keterukan ${d.severity}, ${d.estimated_deficit_pct} peratus defisit`).join('. ')}.` : 'Tiada kekurangan dikesan.'} ${leafResult.recommendation}`
                  )}
                  lang={lang}
                  size="sm"
                />
              </div>
            </div>

            {/* Deficiencies */}
            {leafResult.deficiencies.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('Deficiencies Detected', 'Kekurangan Dikesan')}
                </h3>
                {leafResult.deficiencies.map((d, i) => {
                  // Shorten visual_evidence to 1 punchy sentence
                  const shortEvidence = d.visual_evidence.length > 80
                    ? (d.visual_evidence.slice(0, d.visual_evidence.indexOf('.', 30) + 1) || d.visual_evidence.slice(0, 80) + '…')
                    : d.visual_evidence;

                  const severityBadgeColor: Record<string, string> = {
                    mild: 'bg-amber-100 text-amber-800',
                    moderate: 'bg-orange-100 text-orange-800',
                    severe: 'bg-red-100 text-red-800',
                  };

                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-sans font-bold text-foreground capitalize">{d.nutrient}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-sans font-semibold capitalize ${severityBadgeColor[d.severity] || 'bg-muted text-muted-foreground'}`}>
                          {d.severity} ({d.estimated_deficit_pct}%)
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-sans leading-snug">{shortEvidence}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-sans text-center py-2">
                {t('No deficiencies detected.', 'Tiada kekurangan dikesan.')}
              </p>
            )}

            {/* Conditional Action Button */}
            {(() => {
              const isNPK = hasNPKDeficiency(leafResult);
              const nonNPKIssues = getNonNPKIssues(leafResult);
              const primaryNonNPK = nonNPKIssues[0];

              if (isNPK) {
                return (
                  <button
                    onClick={handleLeafCalculate}
                    className="w-full py-3 rounded-full btn-gradient-primary font-sans font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    {t('Calculate Required Fertiliser →', 'Kira Baja Diperlukan →')}
                  </button>
                );
              }

              // Non-NPK or healthy/no deficiencies
              const issueName = primaryNonNPK
                ? primaryNonNPK.nutrient
                : leafResult.overall_health === 'good'
                  ? t('Healthy Plant', 'Tanaman Sihat')
                  : t('General Issue', 'Isu Umum');
              const issueSeverity = primaryNonNPK?.severity || 'moderate';
              const issueEvidence = primaryNonNPK?.visual_evidence || leafResult.recommendation;

              return (
                <button
                  onClick={() => {
                    setShowLeafAnalysis(false);
                    setTreatmentIssue({ name: issueName, severity: issueSeverity, evidence: issueEvidence });
                    setShowTreatment(true);
                  }}
                  className="w-full py-3 rounded-full btn-gradient-primary font-sans font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <ShieldPlus size={16} />
                  {t('View Treatment Plan →', 'Lihat Pelan Rawatan →')}
                </button>
              );
            })()}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Clean Header */}
      <header className="bg-white border-b border-border/60 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <div>
              <span className="font-sans text-base font-bold text-foreground">BajaJimat</span>
              <p className="text-xs text-muted-foreground font-sans">{plotName || profile.crop} · {profile.farmSize} ha</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground font-sans transition-colors active:scale-95">
              <LogOut size={12} />
              {t('Back', 'Kembali')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Subtle organic leaf accents */}
        <svg className="absolute top-8 left-4 w-32 h-32 opacity-[0.04] pointer-events-none" viewBox="0 0 120 120" fill="none">
          <path d="M20 100 C20 60, 60 20, 100 20 C80 40, 60 60, 60 100 C40 80, 20 100, 20 100Z" stroke="#076653" strokeWidth="1.5" />
          <path d="M30 90 C40 60, 70 30, 90 30" stroke="#c5a35a" strokeWidth="0.8" opacity="0.6" />
        </svg>
        <svg className="absolute bottom-8 right-4 w-28 h-28 opacity-[0.04] pointer-events-none rotate-180" viewBox="0 0 120 120" fill="none">
          <path d="M20 100 C20 60, 60 20, 100 20 C80 40, 60 60, 60 100 C40 80, 20 100, 20 100Z" stroke="#076653" strokeWidth="1.5" />
          <path d="M30 90 C40 60, 70 30, 90 30" stroke="#c5a35a" strokeWidth="0.8" opacity="0.6" />
        </svg>

        <div className="w-full px-6 md:px-20 py-4">
          {/* Plot Context Banner */}
          {plotName && (
            <div className="mb-3 px-4 py-2.5 rounded-2xl bg-primary/[0.07] border border-primary/15">
              <p className="text-xs font-sans font-medium text-primary">
                {t(
                  `Analysis for: ${plotName} (${profile.crop}, ${profile.farmSize}ha)`,
                  `Analisis untuk: ${plotName} (${profile.crop}, ${profile.farmSize}ha)`
                )}
              </p>
            </div>
          )}

          {/* Page Title */}
          <div className="mb-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-sans font-semibold mb-1">
              {t('Soil Analysis', 'Analisis Tanah')}
            </span>
            <h1 className="font-sans text-lg font-bold text-foreground leading-tight">
              {t('Choose Your Input Method', 'Pilih Kaedah Input Anda')}
            </h1>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              {t('Select how you want to analyze your soil nutrients', 'Pilih cara anda ingin menganalisis nutrien tanah')}
            </p>
          </div>

          {/* Tabs - Premium Pill Style */}
          <div className="flex gap-1 mb-4 p-1 rounded-2xl bg-muted/40">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 font-sans text-xs font-semibold transition-all duration-200 rounded-xl active:scale-[0.97] ${
                    isActive
                      ? 'tab-pill-active'
                      : 'tab-pill-inactive'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'soil' && <SoilReportTab lang={lang} onSubmit={handleSoilSubmit} />}
              {activeTab === 'testkit' && <TestKitTab lang={lang} onSubmit={handleTestKitSubmit} />}
              {activeTab === 'leaf' && <LeafPhotoTab lang={lang} onSubmit={handleLeafSubmit} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
