import { useState } from 'react';
import { ArrowLeft, ChevronRight, FileText, TestTubes, Leaf, Calendar } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { ResultsDashboard } from './ResultsDashboard';
import { motion } from 'framer-motion';

export interface HistoryEntry {
  date: string;
  input_mode: 'soil_report' | 'manual' | 'leaf_photo';
  total_cost_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  recommendations: { name: string; bags: number; price_per_bag: number; subtotal_rm: number; is_liming?: boolean; is_mg?: boolean; reason?: string }[];
  confidence?: 'high' | 'medium' | 'low';
  savings_rm?: number;
  voice_summary?: string;
  liming_needed?: boolean;
  liming_recommendation?: { product: string; bags: number; cost_rm: number; reason: string };
  seasonal_advice?: { advice: string };
  crop_requirements_source?: string;
  soil_type?: string;
}

interface PlotHistoryProps {
  plotName: string;
  history: HistoryEntry[];
  lang: 'en' | 'bm';
  cropType?: string;
  farmSize?: string;
  onBack: () => void;
  onToggleLang?: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const MODE_CONFIG: Record<string, { icon: React.ReactNode; en: string; bm: string }> = {
  soil_report: { icon: <FileText size={12} />, en: 'Soil Report', bm: 'Laporan Tanah' },
  manual: { icon: <TestTubes size={12} />, en: 'Manual Entry', bm: 'Kemasukan Manual' },
  leaf_photo: { icon: <Leaf size={12} />, en: 'Leaf Photo', bm: 'Foto Daun' },
};

export function PlotHistory({ plotName, history, lang, cropType, farmSize, onBack, onToggleLang }: PlotHistoryProps) {
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  // Show full 3-tab results for a selected entry
  if (selectedEntry) {
    const resultData = {
      recommendations: selectedEntry.recommendations,
      total_cost_rm: selectedEntry.total_cost_rm,
      savings_rm: selectedEntry.savings_rm ?? 0,
      n_deficit_kg: selectedEntry.n_deficit_kg,
      p_deficit_kg: selectedEntry.p_deficit_kg,
      k_deficit_kg: selectedEntry.k_deficit_kg,
      input_mode: selectedEntry.input_mode,
      confidence: selectedEntry.confidence ?? ('medium' as const),
      voice_summary: selectedEntry.voice_summary ?? '',
      liming_needed: selectedEntry.liming_needed,
      liming_recommendation: selectedEntry.liming_recommendation,
      seasonal_advice: selectedEntry.seasonal_advice,
      crop_requirements_source: selectedEntry.crop_requirements_source,
      soil_type: selectedEntry.soil_type,
    };

    return (
      <ResultsDashboard
        lang={lang}
        result={resultData}
        cropType={cropType}
        plotName={plotName}
        farmSize={farmSize}
        onBack={() => setSelectedEntry(null)}
        backLabel={t(lang, 'Back to History', 'Kembali ke Sejarah')}
        onToggleLang={onToggleLang}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border/60 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans text-base font-bold text-foreground">
              {t(lang, 'Analysis History', 'Sejarah Analisis')}
            </h1>
            <p className="text-xs text-muted-foreground font-sans">{plotName}</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-sans transition-colors active:scale-95"
          >
            <ArrowLeft size={14} />
            {t(lang, 'Back', 'Kembali')}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 md:px-20 py-6">
        <div className="max-w-2xl mx-auto">
          {history.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-muted-foreground" size={28} />
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                {t(lang, 'No analysis history yet.', 'Belum ada sejarah analisis.')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry, i) => {
                const mode = MODE_CONFIG[entry.input_mode] || MODE_CONFIG.manual;
                const dateStr = new Date(entry.date).toLocaleDateString(lang === 'bm' ? 'ms-MY' : 'en-MY', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                });

                const summaryText = `${dateStr}, ${t(lang, mode.en, mode.bm)}, RM ${entry.total_cost_rm.toFixed(2)}`;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="w-full bg-card rounded-2xl border border-border/60 shadow-sm px-4 py-3 flex items-center justify-between text-left hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-sans font-semibold">
                            {mode.icon}
                            {t(lang, mode.en, mode.bm)}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-sans">{dateStr}</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-sm font-sans font-bold text-foreground">
                            RM {entry.total_cost_rm.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-sans">
                            N:{entry.n_deficit_kg.toFixed(1)} P:{entry.p_deficit_kg.toFixed(1)} K:{entry.k_deficit_kg.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <SpeakerButton text={summaryText} lang={lang} size="sm" />
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
