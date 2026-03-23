import { useState } from 'react';
import { FileText, TestTubes, Leaf, Globe, Sprout, AlertTriangle, Zap, LogOut, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { useSpeech } from '@/hooks/useSpeech';
import { SoilReportTab } from './tabs/SoilReportTab';
import { TestKitTab } from './tabs/TestKitTab';
import { LeafPhotoTab, type LeafAnalysisResult } from './tabs/LeafPhotoTab';
import { ResultsDashboard } from './ResultsDashboard';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

type TabKey = 'soil' | 'testkit' | 'leaf';
type InputMode = 'soil_report' | 'manual' | 'leaf_photo';

interface ResultData {
  recommendations: { name: string; bags: number; price_per_bag: number; subtotal_rm: number }[];
  total_cost_rm: number;
  savings_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  input_mode: InputMode;
  confidence: 'high' | 'medium' | 'low';
  voice_summary: string;
}

export function MainApp({ profile, onLogout, lang: externalLang, onToggleLang }: { profile: UserProfile; onLogout: () => void; lang: 'en' | 'bm'; onToggleLang: () => void }) {
  const lang = externalLang;
  const t = (en: string, bm: string) => lang === 'bm' ? bm : en;
  const [activeTab, setActiveTab] = useState<TabKey>('testkit');
  const [showResults, setShowResults] = useState(false);
  const [showLeafAnalysis, setShowLeafAnalysis] = useState(false);
  const [leafResult, setLeafResult] = useState<LeafAnalysisResult | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { speak } = useSpeech(lang);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'soil', label: t('Soil Report', 'Laporan Tanah'), icon: <FileText size={16} /> },
    { key: 'testkit', label: t('Manual Entry', 'Kemasukan Manual'), icon: <TestTubes size={16} /> },
    { key: 'leaf', label: t('Leaf Photo', 'Foto Daun'), icon: <Leaf size={16} /> },
  ];

  const handleTestKitSubmit = async (n: number, p: number, k: number, ph?: number) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cropType = profile.crop || 'musang_king_durian';
      const farmSize = parseFloat(profile.farmSize) || 2.0;

      const res = await fetch('https://pbcouxgyoprloqothcdg.supabase.co/functions/v1/run-solver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiY291eGd5b3BybG9xb3RoY2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDU5MjksImV4cCI6MjA4OTU4MTkyOX0.qcGGpsdI3a6CJlffp8Jp12YqTrauwOQnIse7AyoM5wM',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiY291eGd5b3BybG9xb3RoY2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDU5MjksImV4cCI6MjA4OTU4MTkyOX0.qcGGpsdI3a6CJlffp8Jp12YqTrauwOQnIse7AyoM5wM',
        },
        body: JSON.stringify({
          input_mode: 'manual',
          soil_npk: { n_ppm: n, p_ppm: p, k_ppm: k, confidence: 'high' },
          crop_type: cropType,
          farm_size_ha: farmSize,
          lang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Server error ${res.status}`);
      }

      const data: ResultData = await res.json();
      setResultData(data);
      setShowResults(true);

      // Auto voice readout
      if (data.voice_summary) {
        speak(data.voice_summary);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoilSubmit = async (data: { soil_npk: { n_ppm: number; p_ppm: number; k_ppm: number; confidence: string }; ph: number }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cropType = profile.crop || 'musang_king_durian';
      const farmSize = parseFloat(profile.farmSize) || 2.0;

      const res = await fetch('https://pbcouxgyoprloqothcdg.supabase.co/functions/v1/run-solver', {
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
          lang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Server error ${res.status}`);
      }

      const result: ResultData = await res.json();
      setResultData(result);
      setShowResults(true);

      if (result.voice_summary) {
        speak(result.voice_summary);
      }
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
      const cropType = profile.crop || 'musang_king_durian';
      const farmSize = parseFloat(profile.farmSize) || 2.0;

      const res = await fetch('https://pbcouxgyoprloqothcdg.supabase.co/functions/v1/run-solver', {
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
          lang,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Server error ${res.status}`);
      }

      const data: ResultData = await res.json();
      setResultData(data);
      setShowResults(true);

      if (data.voice_summary) {
        speak(data.voice_summary);
      }
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

  if (showResults && resultData) {
    return (
      <ResultsDashboard
        lang={lang}
        result={resultData}
        onBack={() => { setShowResults(false); setResultData(null); }}
        onToggleLang={onToggleLang}
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
            {/* Health + Confidence badges */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${healthColors[leafResult.overall_health] || 'bg-muted text-muted-foreground'}`}>
                <Activity size={12} className="inline mr-1" />
                {t('Health', 'Kesihatan')}: {leafResult.overall_health}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${
                leafResult.confidence === 'high' ? 'bg-emerald-50 text-emerald-700' :
                leafResult.confidence === 'medium' ? 'bg-amber-50 text-amber-700' :
                'bg-muted text-muted-foreground'
              }`}>
                <ShieldCheck size={12} className="inline mr-1" />
                {leafResult.confidence}
              </span>
            </div>

            {/* Deficiencies */}
            {leafResult.deficiencies.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('Deficiencies Detected', 'Kekurangan Dikesan')}
                </h3>
                {leafResult.deficiencies.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-sans font-bold text-foreground capitalize">{d.nutrient}</span>
                      <span className={`text-xs font-sans font-semibold capitalize ${severityColors[d.severity] || 'text-muted-foreground'}`}>
                        {d.severity} ({d.estimated_deficit_pct}%)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">{d.visual_evidence}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-sans text-center py-2">
                {t('No deficiencies detected.', 'Tiada kekurangan dikesan.')}
              </p>
            )}

            {/* AI Recommendation */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-sans font-semibold text-primary">
                  {t('AI Recommendation', 'Cadangan AI')}
                </span>
                <SpeakerButton text={leafResult.recommendation} lang={lang} size="sm" />
              </div>
              <p className="text-sm text-foreground font-sans leading-relaxed">{leafResult.recommendation}</p>
            </div>

            {/* Calculate button */}
            <button
              onClick={handleLeafCalculate}
              className="w-full py-3 rounded-full btn-gradient-primary font-sans font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              {t('Calculate Required Fertiliser →', 'Kira Baja Diperlukan →')}
            </button>
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
              <p className="text-xs text-muted-foreground font-sans">{profile.crop} · {profile.farmSize} ha</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground font-sans transition-colors active:scale-95">
              <LogOut size={12} />
              {t('Reset', 'Set Semula')}
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

          {/* Tabs */}
          <div className="flex gap-1.5 mb-3 bg-muted/50 p-1 rounded-xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 font-sans text-xs font-medium transition-all duration-200 rounded-lg active:scale-[0.97] ${
                    isActive
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
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
