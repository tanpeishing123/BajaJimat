import { useState } from 'react';
import { FileText, TestTubes, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SpeakerButton } from './SpeakerButton';
import { SoilReportTab } from './tabs/SoilReportTab';
import { TestKitTab } from './tabs/TestKitTab';
import { LeafPhotoTab } from './tabs/LeafPhotoTab';
import { ResultsDashboard } from './ResultsDashboard';
import leafSketch from '@/assets/leaf-sketch.png';

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

const cropNames: Record<string, Record<'en' | 'bm', string>> = {
  musang_king: { en: 'Musang King', bm: 'Musang King' },
  oil_palm: { en: 'Oil Palm', bm: 'Kelapa Sawit' },
  paddy: { en: 'Paddy', bm: 'Padi' },
  vegetables: { en: 'Vegetables', bm: 'Sayuran' },
  rubber: { en: 'Rubber', bm: 'Getah' },
};

type TabKey = 'soil' | 'testkit' | 'leaf';

export function MainApp({ profile, onLogout }: { profile: UserProfile; onLogout: () => void }) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('testkit');
  const [showResults, setShowResults] = useState(false);
  const [npkLevels, setNpkLevels] = useState<{ n: number; p: number; k: number } | null>(null);

  const cropName = cropNames[profile.crop]?.[lang] || profile.crop;
  const greeting = `${t('welcome')}, ${profile.name}!`;
  const farmInfo = t('your_farm', { crop: cropName, size: profile.farmSize });

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'soil', label: t('soil_report'), icon: <FileText size={18} /> },
    { key: 'testkit', label: t('test_kit'), icon: <TestTubes size={18} /> },
    { key: 'leaf', label: t('leaf_photo'), icon: <Leaf size={18} /> },
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
      {/* Decorative sketch */}
      <img
        src={leafSketch}
        alt=""
        className="absolute top-20 right-0 w-48 opacity-[0.04] pointer-events-none"
      />

      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-5 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif-display font-bold text-brown-brand">{greeting}</h1>
              <SpeakerButton text={`${greeting} ${farmInfo}`} lang={lang} />
            </div>
            <p className="text-sm text-muted-foreground font-body mt-0.5">{farmInfo}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            ↺ Reset
          </button>
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
