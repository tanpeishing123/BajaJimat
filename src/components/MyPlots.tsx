import { useState, useEffect } from 'react';
import { Plus, Trash2, FlaskConical, Sprout, Globe, LogOut, MapPin, Leaf } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SpeakerButton } from './SpeakerButton';
import farmWelcomeBg from '@/assets/farm-welcome-bg.jpg';

import cropOilPalm from '@/assets/crops/oil-palm.jpg';
import cropPaddy from '@/assets/crops/paddy.jpg';
import cropCorn from '@/assets/crops/corn.jpg';
import cropDurian from '@/assets/crops/durian.jpg';
import cropRubber from '@/assets/crops/rubber.jpg';
import cropVegetables from '@/assets/crops/vegetables.jpg';
import cropBanana from '@/assets/crops/banana.jpg';
import cropCoconut from '@/assets/crops/coconut.jpg';
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

const CROP_IMAGES: Record<string, string> = {
  'oil palm': cropOilPalm,
  'kelapa sawit': cropOilPalm,
  'paddy': cropPaddy,
  'padi': cropPaddy,
  'rice': cropPaddy,
  'corn': cropCorn,
  'jagung': cropCorn,
  'durian': cropDurian,
  'musang king': cropDurian,
  'rubber': cropRubber,
  'getah': cropRubber,
  'vegetables': cropVegetables,
  'sayur': cropVegetables,
  'sayur-sayuran': cropVegetables,
  'banana': cropBanana,
  'pisang': cropBanana,
  'coconut': cropCoconut,
  'kelapa': cropCoconut,
};

function getCropImage(cropType: string): string | null {
  const lower = cropType.toLowerCase().trim();
  if (CROP_IMAGES[lower]) return CROP_IMAGES[lower];
  // Partial match
  for (const [key, val] of Object.entries(CROP_IMAGES)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
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
    <div className="h-screen flex flex-col bg-muted/40">
      {/* Header */}
      <header className="bg-white border-b border-border/60 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sprout className="text-primary-foreground" size={18} />
            </div>
            <span className="font-display text-base font-bold text-foreground">AgroMate</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95">
              <Globe size={12} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground font-sans transition-colors active:scale-95">
              <LogOut size={12} />
              {t(lang, 'Logout', 'Log Keluar')}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-20 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Greeting with farm background */}
          <div className="mb-6 relative rounded-2xl overflow-hidden">
            <img src={farmWelcomeBg} alt="Lush green farm" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1280} height={512} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            <div className="relative z-10 px-6 py-8">
              <h1 className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">
                {t(lang, 'My Plots', 'Ladang Saya')}
              </h1>
              <p className="text-sm text-white/80 font-sans mt-1 drop-shadow-sm">
                {t(lang, `Welcome, ${userName}!`, `Selamat datang, ${userName}!`)}
              </p>
            </div>
          </div>

          {/* Plot Cards */}
          {plots.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-muted-foreground" size={28} />
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                {t(lang, 'No plots yet. Add your first plot!', 'Belum ada ladang. Tambah ladang pertama anda!')}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {plots.map(plot => {
                return (
                <div key={plot.id} className="bg-card rounded-xl overflow-hidden border border-border/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Leaf size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-sm font-bold text-foreground">{plot.name}</h3>
                          <p className="text-xs text-muted-foreground font-sans mt-0.5">
                            {plot.crop_type} · {plot.farm_size_ha} ha · {soilLabel(plot.soil_type, lang)}
                          </p>
                          {plot.last_cost !== null && (
                            <p className="text-xs font-sans font-semibold text-primary mt-1">
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
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl btn-gradient-primary font-sans text-xs font-semibold"
                      >
                        <FlaskConical size={14} />
                        {t(lang, 'New Analysis', 'Analisis Baru')}
                      </button>
                      <button
                        onClick={() => onViewHistory(plot)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-primary/30 text-primary text-xs font-sans font-semibold hover:bg-primary/5 transition-all duration-200 active:scale-95"
                      >
                        {t(lang, 'View History', 'Lihat Sejarah')}
                        {plot.history?.length ? (
                          <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold">{plot.history.length}</span>
                        ) : null}
                      </button>
                      <button
                        onClick={() => handleDelete(plot.id)}
                        className="flex items-center justify-center px-2.5 py-2.5 rounded-xl border border-destructive/30 text-destructive text-xs font-sans font-medium hover:bg-destructive/5 transition-all duration-200 active:scale-95"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {/* Add New Plot Button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/[0.03] text-primary font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/[0.07] hover:border-primary/60 transition-all duration-200 active:scale-[0.98]"
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
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground input-premium transition-all"
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
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground input-premium transition-all"
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
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 pr-12 font-body text-sm text-foreground input-premium transition-all"
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
                className="w-full rounded-2xl border border-border bg-beige-brand/40 px-4 pt-5 pb-1.5 font-body text-sm text-foreground input-premium transition-all appearance-none"
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
