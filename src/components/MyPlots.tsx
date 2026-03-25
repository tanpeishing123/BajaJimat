import { useState, useEffect } from 'react';
import { Plus, Trash2, FlaskConical, Sprout, Globe, LogOut, MapPin, Leaf } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SpeakerButton } from './SpeakerButton';

import type { HistoryEntry } from './PlotHistory';

export interface Plot {
  id: string;
  name: string;
  crop_type: string;
  farm_size_ha: number;
  soil_type: string;
  last_cost: number | null;
  history?: HistoryEntry[];
}

interface MyPlotsProps {
  userName: string;
  lang: 'en' | 'bm';
  onToggleLang: () => void;
  onLogout: () => void;
  onAnalyse: (plot: Plot) => void;
  onViewHistory: (plot: Plot) => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const SOIL_TYPES = [
  { value: 'mineral', en: 'Mineral Soil', bm: 'Tanah Mineral' },
  { value: 'peat', en: 'Peat Soil', bm: 'Tanah Gambut' },
  { value: 'clay', en: 'Clay Soil', bm: 'Tanah Liat' },
  { value: 'sandy', en: 'Sandy Soil', bm: 'Tanah Berpasir' },
  { value: 'alluvial', en: 'Alluvial Soil', bm: 'Tanah Aluvium' },
];

const soilLabel = (val: string, lang: 'en' | 'bm') => {
  const s = SOIL_TYPES.find(st => st.value === val);
  return s ? (lang === 'bm' ? s.bm : s.en) : val;
};

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}

function loadPlots(): Plot[] {
  try {
    return JSON.parse(localStorage.getItem('plots') || '[]');
  } catch { return []; }
}

function savePlots(plots: Plot[]) {
  localStorage.setItem('plots', JSON.stringify(plots));
}

export function MyPlots({ userName, lang, onToggleLang, onLogout, onAnalyse, onViewHistory }: MyPlotsProps) {
  const [plots, setPlots] = useState<Plot[]>(loadPlots);

  // Reload plots from localStorage whenever this component mounts (e.g. returning from analysis)
  useEffect(() => {
    setPlots(loadPlots());
  }, []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [plotName, setPlotName] = useState('');
  const [cropType, setCropType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('mineral');

  const canSave = plotName.trim() && cropType.trim() && farmSize;

  const handleSave = () => {
    if (!canSave) return;
    const newPlot: Plot = {
      id: generateId(),
      name: plotName.trim(),
      crop_type: cropType.trim(),
      farm_size_ha: parseFloat(farmSize) || 1,
      soil_type: soilType,
      last_cost: null,
    };
    const updated = [...plots, newPlot];
    setPlots(updated);
    savePlots(updated);
    setSheetOpen(false);
    setPlotName('');
    setCropType('');
    setFarmSize('');
    setSoilType('mineral');
  };

  const handleDelete = (id: string) => {
    const updated = plots.filter(p => p.id !== id);
    setPlots(updated);
    savePlots(updated);
  };

  return (
    <div className="h-screen flex flex-col bg-dark-emerald">
      {/* Header */}
      <header className="bg-transparent border-b border-emerald-400/15 px-6 py-4 flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Sprout className="text-emerald-400" size={18} />
            </div>
            <span className="font-display text-base font-bold text-emerald-50">BajaJimat</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-400/20 text-xs font-sans font-medium text-emerald-300/70 hover:text-emerald-200 hover:border-emerald-400/40 transition-all duration-200 active:scale-95">
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-emerald-300/70 hover:text-emerald-200 font-sans transition-colors active:scale-95">
              <LogOut size={12} />
              {t(lang, 'Logout', 'Log Keluar')}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-20 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-emerald-50 tracking-tight">
              {t(lang, 'My Plots', 'Ladang Saya')}
            </h1>
            <p className="text-sm text-emerald-300/60 font-sans mt-1">
              {t(lang, `Welcome, ${userName}!`, `Selamat datang, ${userName}!`)}
            </p>
          </div>

          {/* Plot Cards */}
          {plots.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-emerald-400/60" size={28} />
              </div>
              <p className="text-sm text-emerald-300/50 font-sans">
                {t(lang, 'No plots yet. Add your first plot!', 'Belum ada ladang. Tambah ladang pertama anda!')}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {plots.map(plot => (
                <div key={plot.id} className="glass-dark rounded-2xl p-4 hover:border-emerald-400/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Leaf size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-emerald-50">{plot.name}</h3>
                        <p className="text-xs text-emerald-300/50 font-sans mt-0.5">
                          {plot.crop_type} · {plot.farm_size_ha} ha · {soilLabel(plot.soil_type, lang)}
                        </p>
                        {plot.last_cost !== null && (
                          <p className="text-xs font-sans font-semibold text-glow-green mt-1">
                            {t(lang, 'Last cost', 'Kos terakhir')}: RM {plot.last_cost.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <SpeakerButton
                      text={`${plot.name}, ${plot.crop_type}, ${plot.farm_size_ha} ${lang === 'bm' ? 'hektar' : 'hectares'}`}
                      lang={lang}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onAnalyse(plot)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-sans text-xs font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-500/25"
                    >
                      <FlaskConical size={14} />
                      {t(lang, 'New Analysis', 'Analisis Baru')}
                    </button>
                    <button
                      onClick={() => onViewHistory(plot)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs font-sans font-semibold hover:bg-emerald-400/10 hover:border-emerald-400/50 transition-all duration-200 active:scale-95"
                    >
                      {t(lang, 'View History', 'Lihat Sejarah')}
                      {plot.history?.length ? (
                        <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 text-[10px] font-bold">{plot.history.length}</span>
                      ) : null}
                    </button>
                    <button
                      onClick={() => handleDelete(plot.id)}
                      className="flex items-center justify-center px-2.5 py-2.5 rounded-xl border border-red-400/30 text-red-400 text-xs font-sans font-medium hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-200 active:scale-95"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Plot Button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-400/30 text-emerald-300 font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400/5 hover:border-emerald-400/50 transition-all duration-200 active:scale-[0.98]"
          >
            <Plus size={18} />
            {t(lang, 'Add New Plot', 'Tambah Ladang Baru')}
          </button>
        </div>
      </div>

      {/* Add Plot Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="font-sans text-lg font-bold text-foreground">
              {t(lang, 'Add New Plot', 'Tambah Ladang Baru')}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Plot Name */}
            <div className="relative">
              <input
                type="text"
                value={plotName}
                onChange={e => setPlotName(e.target.value)}
                placeholder={t(lang, 'e.g. Ladang Utara', 'contoh: Ladang Utara')}
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium pointer-events-none">
                {t(lang, 'Plot Name', 'Nama Ladang')}
              </label>
            </div>

            {/* Crop Type */}
            <div className="relative">
              <input
                type="text"
                value={cropType}
                onChange={e => setCropType(e.target.value)}
                placeholder={t(lang, 'e.g. Rubber, Durian, Paddy...', 'contoh: Getah, Durian, Padi...')}
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium pointer-events-none">
                {t(lang, 'Crop Type', 'Jenis Tanaman')}
              </label>
            </div>

            {/* Farm Size */}
            <div className="relative">
              <input
                type="number"
                value={farmSize}
                onChange={e => setFarmSize(e.target.value)}
                placeholder="0"
                min="0.1"
                step="0.1"
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 pr-12 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium pointer-events-none">
                {t(lang, 'Size (hectares)', 'Keluasan (hektar)')}
              </label>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body text-xs font-medium">ha</span>
            </div>

            {/* Soil Type */}
            <div className="relative">
              <select
                value={soilType}
                onChange={e => setSoilType(e.target.value)}
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
              >
                {SOIL_TYPES.map(s => (
                  <option key={s.value} value={s.value}>
                    {lang === 'bm' ? `${s.bm} / ${s.en}` : `${s.en} / ${s.bm}`}
                  </option>
                ))}
              </select>
              <label className="absolute left-4 top-1.5 text-[10px] text-muted-foreground font-body font-medium pointer-events-none">
                {t(lang, 'Soil Type', 'Jenis Tanah')}
              </label>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </div>
            </div>

            {/* Save */}
            <button
              disabled={!canSave}
              onClick={handleSave}
              className="w-full rounded-2xl py-3 font-body font-semibold text-sm flex items-center justify-center gap-2 btn-gradient-primary"
            >
              {t(lang, 'Save', 'Simpan')}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
