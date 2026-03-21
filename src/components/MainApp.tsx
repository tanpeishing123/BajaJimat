import { useState } from 'react';
import { FileText, TestTubes, Leaf, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SpeakerButton } from './SpeakerButton';
import { SoilReportTab } from './tabs/SoilReportTab';
import { TestKitTab } from './tabs/TestKitTab';
import { LeafPhotoTab } from './tabs/LeafPhotoTab';
import { ResultsDashboard } from './ResultsDashboard';
import { Sprout } from 'lucide-react';
import leafSketch from '@/assets/leaf-sketch.png';

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

type TabKey = 'soil' | 'testkit' | 'leaf';

export function MainApp({ profile, onLogout, lang: externalLang, onToggleLang }: { profile: UserProfile; onLogout: () => void; lang: 'en' | 'bm'; onToggleLang: () => void }) {
  const lang = externalLang;
  const t = (en: string, bm: string) => lang === 'bm' ? bm : en;
  const [activeTab, setActiveTab] = useState<TabKey>('testkit');
  const [showResults, setShowResults] = useState(false);
  const [npkLevels, setNpkLevels] = useState<{ n: number; p: number; k: number } | null>(null);

  const greeting = `${t('Welcome', 'Selamat Datang')}, ${profile.name}!`;
  const farmInfo = `${profile.crop}, ${profile.farmSize} ha`;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'soil', label: t('Soil Report', 'Laporan Tanah'), icon: <FileText size={18} /> },
    { key: 'testkit', label: t('Test Kit', 'Kit Ujian'), icon: <TestTubes size={18} /> },
    { key: 'leaf', label: t('Leaf Photo', 'Foto Daun'), icon: <Leaf size={18} /> },
  ];

  const handleTestKitSubmit = (n: number, p: number, k: number) => {
    setNpkLevels({ n, p, k });
    setShowResults(true);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults && npkLevels) {
    return (
      <ResultsDashboard
        lang={lang}
        npk={npkLevels}
        profile={profile}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream-brand relative overflow-hidden">
      <img src={leafSketch} alt="" className="absolute top-20 right-0 w-48 opacity-[0.04] pointer-events-none" />

      {/* Navbar */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <div>
              <h1 className="text-base font-serif-display font-bold text-brown-brand leading-tight">{greeting}</h1>
              <p className="text-xs text-muted-foreground font-body">{farmInfo}</p>
            </div>
            <SpeakerButton text={`${greeting} ${farmInfo}`} lang={lang} size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border text-xs font-body font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95"
            >
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              ↺ {t('Reset', 'Set Semula')}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex bg-card rounded-2xl p-1.5 shadow-luxe border border-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowResults(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'soil' && <SoilReportTab lang={lang} onSubmit={handleSubmit} />}
        {activeTab === 'testkit' && <TestKitTab lang={lang} onSubmit={handleTestKitSubmit} />}
        {activeTab === 'leaf' && <LeafPhotoTab lang={lang} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
}
