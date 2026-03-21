import { useState } from 'react';
import { FileText, TestTubes, Leaf, Globe, Sprout, AlertTriangle, Zap, LogOut } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { SoilReportTab } from './tabs/SoilReportTab';
import { TestKitTab } from './tabs/TestKitTab';
import { LeafPhotoTab } from './tabs/LeafPhotoTab';
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
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'soil', label: t('Soil Report', 'Laporan Tanah'), icon: <FileText size={16} /> },
    { key: 'testkit', label: t('Test Kit', 'Kit Ujian'), icon: <TestTubes size={16} /> },
    { key: 'leaf', label: t('Leaf Photo', 'Foto Daun'), icon: <Leaf size={16} /> },
  ];

  const mockTestKit: ResultData = {
    recommendations: [
      { name: 'Urea', bags: 3, price_per_bag: 42.0, subtotal_rm: 126.0 },
      { name: 'Muriate of Potash (MOP)', bags: 2, price_per_bag: 58.0, subtotal_rm: 116.0 },
    ],
    total_cost_rm: 242.0,
    savings_rm: 185.0,
    n_deficit_kg: 150,
    p_deficit_kg: 0,
    k_deficit_kg: 120,
    input_mode: 'manual',
    confidence: 'high',
    voice_summary: lang === 'bm'
      ? 'Ladang anda memerlukan 3 beg Urea dan 2 beg MOP. Anda jimat RM185!'
      : 'Your farm needs 3 bags of Urea and 2 bags of MOP. You save RM185!',
  };

  const mockSoilReport: ResultData = {
    recommendations: [
      { name: 'Urea', bags: 5, price_per_bag: 42.0, subtotal_rm: 210.0 },
      { name: 'Muriate of Potash (MOP)', bags: 3, price_per_bag: 58.0, subtotal_rm: 174.0 },
    ],
    total_cost_rm: 384.0,
    savings_rm: 215.0,
    n_deficit_kg: 210,
    p_deficit_kg: 0,
    k_deficit_kg: 180,
    input_mode: 'soil_report',
    confidence: 'high',
    voice_summary: lang === 'bm'
      ? 'Laporan tanah anda menunjukkan kekurangan Nitrogen yang ketara. Kami cadangkan 5 beg Urea dan 3 beg MOP. Anda jimat RM215.'
      : 'Your soil report shows significant Nitrogen deficiency. We recommend 5 bags of Urea and 3 bags of MOP. You save RM215.',
  };

  const mockLeafPhoto: ResultData = {
    recommendations: [
      { name: 'NPK Blue Special', bags: 4, price_per_bag: 95.0, subtotal_rm: 380.0 },
    ],
    total_cost_rm: 380.0,
    savings_rm: 50.0,
    n_deficit_kg: 120,
    p_deficit_kg: 40,
    k_deficit_kg: 80,
    input_mode: 'leaf_photo',
    confidence: 'medium',
    voice_summary: lang === 'bm'
      ? 'Berdasarkan foto daun, tanaman anda mengalami kekurangan nitrogen. Cadangan: 4 beg NPK Blue.'
      : 'Based on leaf photo, your crop has nitrogen deficiency. Recommendation: 4 bags NPK Blue.',
  };

  const handleTestKitSubmit = (n: number, p: number, k: number) => {
    setResultData(mockTestKit);
    setShowResults(true);
  };

  const handleSoilSubmit = () => {
    setResultData(mockSoilReport);
    setShowResults(true);
  };

  const handleLeafSubmit = () => {
    setShowLeafAnalysis(true);
  };

  const handleLeafCalculate = () => {
    setShowLeafAnalysis(false);
    setResultData(mockLeafPhoto);
    setShowResults(true);
  };

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
  if (showLeafAnalysis) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <span className="font-sans text-base font-bold text-foreground">BajaJimat</span>
          </div>
          <button onClick={() => setShowLeafAnalysis(false)} className="text-sm text-muted-foreground hover:text-foreground font-sans transition-colors">
            ← {t('Back', 'Kembali')}
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-border/40 text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto">
              <AlertTriangle className="text-amber-500" size={32} />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-sans font-semibold mb-3">
                {t('Deficiency Detected', 'Kekurangan Dikesan')}
              </span>
              <h2 className="font-sans text-2xl font-bold text-foreground">
                {t('Nitrogen', 'Nitrogen')} <span className="text-destructive">({t('Severe', 'Teruk')})</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              {t('Visual analysis indicates significant nitrogen deficiency in your crop leaves.', 'Analisis visual menunjukkan kekurangan nitrogen yang ketara pada daun tanaman anda.')}
            </p>
            <button
              onClick={handleLeafCalculate}
              className="w-full py-3 rounded-full btn-gradient-primary font-sans font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              {t('Calculate Prescription', 'Kira Preskripsi')}
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

        <div className="w-full px-6 md:px-20 py-6">
          {/* Page Title */}
          <div className="mb-5">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-sans font-semibold mb-2">
              {t('Soil Analysis', 'Analisis Tanah')}
            </span>
            <h1 className="font-sans text-2xl font-bold text-foreground leading-tight">
              {t('Choose Your Input Method', 'Pilih Kaedah Input Anda')}
            </h1>
            <p className="text-sm text-muted-foreground font-sans mt-1">
              {t('Select how you want to analyze your soil nutrients', 'Pilih cara anda ingin menganalisis nutrien tanah')}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 bg-muted/50 p-1.5 rounded-2xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 font-sans text-sm font-medium transition-all duration-200 rounded-xl active:scale-[0.97] ${
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
