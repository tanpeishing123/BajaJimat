import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, FileText, TestTubes, Leaf, Calendar } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { motion, AnimatePresence } from 'framer-motion';

export interface HistoryEntry {
  date: string;
  input_mode: 'soil_report' | 'manual' | 'leaf_photo';
  total_cost_rm: number;
  n_deficit_kg: number;
  p_deficit_kg: number;
  k_deficit_kg: number;
  recommendations: { name: string; bags: number; price_per_bag: number; subtotal_rm: number; is_liming?: boolean; is_mg?: boolean; reason?: string }[];
}

interface PlotHistoryProps {
  plotName: string;
  history: HistoryEntry[];
  lang: 'en' | 'bm';
  onBack: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const MODE_CONFIG: Record<string, { icon: React.ReactNode; en: string; bm: string }> = {
  soil_report: { icon: <FileText size={12} />, en: 'Soil Report', bm: 'Laporan Tanah' },
  manual: { icon: <TestTubes size={12} />, en: 'Manual Entry', bm: 'Kemasukan Manual' },
  leaf_photo: { icon: <Leaf size={12} />, en: 'Leaf Photo', bm: 'Foto Daun' },
};

export function PlotHistory({ plotName, history, lang, onBack }: PlotHistoryProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggle = (i: number) => setExpandedIdx(expandedIdx === i ? null : i);

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
                const isExpanded = expandedIdx === i;
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
                    className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(i)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left"
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
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={16} className="text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border/40">
                            {entry.recommendations.map((rec, j) => (
                              <div key={j} className={`p-2.5 rounded-xl text-xs font-sans ${
                                rec.is_mg ? 'bg-blue-50 border border-blue-200' :
                                rec.is_liming ? 'bg-amber-50 border border-amber-200' :
                                'bg-muted/30 border border-border/40'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground">{rec.name}</span>
                                  <span className="text-muted-foreground">
                                    {rec.bags} × RM {rec.price_per_bag.toFixed(2)} = RM {rec.subtotal_rm.toFixed(2)}
                                  </span>
                                </div>
                                {rec.reason && (
                                  <p className="text-muted-foreground mt-1">{rec.reason}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
