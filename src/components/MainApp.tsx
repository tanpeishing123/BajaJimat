import { useState } from 'react';
import { FileText, TestTubes, Leaf, Globe, Sprout, AlertTriangle, Zap } from 'lucide-react';
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

  const greeting = `${t('Welcome', 'Selamat Datang')}, ${profile.name}!`;
  const farmInfo = `${profile.crop}, ${profile.farmSize} ha`;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'soil', label: t('Soil Report', 'Laporan Tanah'), icon: <FileText size={14} /> },
    { key: 'testkit', label: t('Test Kit', 'Kit Ujian'), icon: <TestTubes size={14} /> },
    { key: 'leaf', label: t('Leaf Photo', 'Foto Daun'), icon: <Leaf size={14} /> },
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
      <div className="h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#fdfbf7' }}>
        <header className="border-b border-border/40 px-4 md:px-6 py-2.5 z-50 flex-shrink-0" style={{ backgroundColor: 'rgba(253,251,247,0.92)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Sprout className="text-primary-foreground" size={14} />
              </div>
              <h1 className="text-xs font-serif-display font-bold text-foreground">{t('AI Analysis', 'Analisis AI')}</h1>
            </div>
            <button onClick={() => setShowLeafAnalysis(false)} className="text-[10px] text-muted-foreground hover:text-foreground font-body">
              ← {t('Back', 'Kembali')}
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg p-6 bg-card shadow-luxe border border-border/60 text-center space-y-4"
            style={{ borderRadius: '2rem 1.2rem 2.4rem 1rem' }}
          >
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto">
              <AlertTriangle className="text-accent" size={28} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest mb-1">{t('Deficiency Detected', 'Kekurangan Dikesan')}</p>
              <h2 className="font-serif-display text-xl font-bold text-foreground">
                {t('Nitrogen', 'Nitrogen')} <span className="text-destructive">({t('Severe', 'Teruk')})</span>
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              {t('Visual analysis indicates significant nitrogen deficiency in your crop leaves.', 'Analisis visual menunjukkan kekurangan nitrogen yang ketara pada daun tanaman anda.')}
            </p>
            <button
              onClick={handleLeafCalculate}
              className="w-full py-2.5 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 btn-gradient-primary"
            >
              <Zap size={14} />
              {t('Calculate Prescription', 'Kira Preskripsi')}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#fdfbf7' }}>
      {/* Organic background accents */}
      <svg className="absolute top-12 -left-8 w-40 h-40 opacity-[0.035] pointer-events-none" viewBox="0 0 200 200" fill="none">
        <path d="M60 180C20 140 10 80 50 40s90-20 120 20c30 40 10 100-30 120S100 220 60 180z" stroke="hsl(var(--accent))" strokeWidth="1.5" />
        <path d="M80 160C50 130 40 80 70 50s70-10 90 20c20 30 5 80-25 95S110 190 80 160z" stroke="hsl(var(--primary))" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 -right-6 w-32 h-32 opacity-[0.03] pointer-events-none rotate-45" viewBox="0 0 160 160" fill="none">
        <ellipse cx="80" cy="80" rx="70" ry="50" stroke="hsl(var(--accent))" strokeWidth="1.5" />
        <path d="M40 80C50 40 110 40 120 80S90 140 40 80z" stroke="hsl(var(--primary))" strokeWidth="1" />
      </svg>

      {/* Compact Header */}
      <header className="border-b border-border/40 px-4 md:px-8 py-2.5 z-50 flex-shrink-0" style={{ backgroundColor: 'rgba(253,251,247,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={14} />
            </div>
            <div>
              <h1 className="text-xs font-serif-display font-bold text-foreground leading-tight">{greeting}</h1>
              <p className="text-[10px] text-muted-foreground font-body">{farmInfo}</p>
            </div>
            <SpeakerButton text={`${greeting} ${farmInfo}`} lang={lang} size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLang} className="flex items-center gap-1 px-2 py-1 rounded-full border border-border text-[10px] font-body font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
              <Globe size={10} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button onClick={onLogout} className="text-[10px] text-muted-foreground hover:text-foreground font-body transition-colors">
              ↺ {t('Reset', 'Set Semula')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-3">
        <div className="relative">
          <div className="absolute -top-1 left-6 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />

          <div
            className="relative border-2 border-primary/15 p-3 md:p-4 shadow-luxe overflow-visible"
            style={{ backgroundColor: '#fdfbf7', borderRadius: '2rem 1.2rem 2.4rem 1rem' }}
          >
            <div className="absolute top-2 left-3 right-4 h-[1px] bg-accent/20" />

            {/* Tabs */}
            <div className="flex gap-1.5 mb-3 relative">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === tab.key;
                const radii = idx === 0 ? '1.2rem 0.6rem 1rem 0.8rem' : idx === 1 ? '0.8rem 1.4rem 0.6rem 1.2rem' : '0.6rem 1rem 1.4rem 0.8rem';
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); }}
                    className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 font-body text-[11px] font-semibold transition-colors duration-200 active:scale-[0.96] border ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-md z-10'
                        : 'bg-secondary text-primary border-primary/15 hover:border-primary/30'
                    }`}
                    style={{ borderRadius: radii }}
                    layout
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'soil' && <SoilReportTab lang={lang} onSubmit={handleSoilSubmit} />}
                {activeTab === 'testkit' && <TestKitTab lang={lang} onSubmit={handleTestKitSubmit} />}
                {activeTab === 'leaf' && <LeafPhotoTab lang={lang} onSubmit={handleLeafSubmit} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="absolute -bottom-2 -right-1 w-16 h-16 rounded-full border border-accent/15 opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, hsla(38,92%,50%,0.06) 0%, transparent 70%)' }}
          />
        </div>
      </div>
    </div>
  );
}
