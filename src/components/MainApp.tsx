import { useState } from 'react';
import { FileText, TestTubes, Leaf, Globe, Sprout } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { SoilReportTab } from './tabs/SoilReportTab';
import { TestKitTab } from './tabs/TestKitTab';
import { LeafPhotoTab } from './tabs/LeafPhotoTab';
import { ResultsDashboard } from './ResultsDashboard';

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
    { key: 'soil', label: t('Soil Report', 'Laporan Tanah'), icon: <FileText size={16} /> },
    { key: 'testkit', label: t('Test Kit', 'Kit Ujian'), icon: <TestTubes size={16} /> },
    { key: 'leaf', label: t('Leaf Photo', 'Foto Daun'), icon: <Leaf size={16} /> },
  ];

  const mockResult = {
    recommendations: [
      { name: 'Urea', bags: 3, price_per_bag: 42.0, subtotal_rm: 126.0 },
      { name: 'Muriate of Potash (MOP)', bags: 2, price_per_bag: 58.0, subtotal_rm: 116.0 },
    ],
    total_cost_rm: 242.0,
    savings_rm: 185.0,
    n_deficit_kg: 150,
    p_deficit_kg: 0,
    k_deficit_kg: 120,
    input_mode: 'manual' as const,
    confidence: 'high' as const,
    voice_summary: lang === 'bm'
      ? 'Ladang anda memerlukan 3 beg Urea dan 2 beg MOP. Anda jimat RM185!'
      : 'Your farm needs 3 bags of Urea and 2 bags of MOP. You save RM185!',
  };

  const handleTestKitSubmit = (n: number, p: number, k: number) => {
    setNpkLevels({ n, p, k });
    setShowResults(true);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults) {
    return (
      <ResultsDashboard
        lang={lang}
        result={mockResult}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="h-screen bg-cream-brand relative overflow-hidden flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border/60 px-4 py-3.5 sticky top-0 z-50 bg-cream-brand/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={16} />
            </div>
            <div>
              <h1 className="text-sm font-serif-display font-bold text-brown-brand leading-tight">{greeting}</h1>
              <p className="text-[11px] text-muted-foreground font-body">{farmInfo}</p>
            </div>
            <SpeakerButton text={`${greeting} ${farmInfo}`} lang={lang} size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border text-[11px] font-body font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95"
            >
              <Globe size={11} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button
              onClick={onLogout}
              className="text-[11px] text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              ↺ {t('Reset', 'Set Semula')}
            </button>
          </div>
        </div>
      </header>

      {/* Emerald Frame Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="rounded-3xl border-2 border-primary/20 bg-cream-brand p-4 shadow-luxe relative overflow-visible">
            {/* Gold accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            {/* Custom Tab Navigation */}
            <div className="flex gap-2 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setShowResults(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl font-body text-xs font-semibold transition-all duration-300 active:scale-[0.97] border ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-beige-brand text-primary border-primary/20 hover:border-primary/40'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'soil' && <SoilReportTab lang={lang} onSubmit={handleSubmit} />}
              {activeTab === 'testkit' && <TestKitTab lang={lang} onSubmit={handleTestKitSubmit} />}
              {activeTab === 'leaf' && <LeafPhotoTab lang={lang} onSubmit={handleSubmit} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
