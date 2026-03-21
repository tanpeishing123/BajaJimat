import { useState } from 'react';
import { Check } from 'lucide-react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface ColorLevel {
  color: string;
  value: number;
  label: { en: string; bm: string };
}

const phLevels: ColorLevel[] = [
  { color: '#b22222', value: 4.0, label: { en: 'pH 4.0', bm: 'pH 4.0' } },
  { color: '#cd5c5c', value: 5.0, label: { en: 'pH 5.0', bm: 'pH 5.0' } },
  { color: '#f08080', value: 6.0, label: { en: 'pH 6.0', bm: 'pH 6.0' } },
  { color: '#e9967a', value: 7.0, label: { en: 'pH 7.0', bm: 'pH 7.0' } },
  { color: '#daa520', value: 8.0, label: { en: 'pH 8.0', bm: 'pH 8.0' } },
  { color: '#9acd32', value: 9.0, label: { en: 'pH 9.0', bm: 'pH 9.0' } },
  { color: '#6b8e23', value: 10.0, label: { en: 'pH 10', bm: 'pH 10' } },
];

const nLevels: ColorLevel[] = [
  { color: '#f0e68c', value: 0, label: { en: '0', bm: '0' } },
  { color: '#9acd32', value: 10, label: { en: '10', bm: '10' } },
  { color: '#556b2f', value: 50, label: { en: '50', bm: '50' } },
  { color: '#228b22', value: 100, label: { en: '100', bm: '100' } },
  { color: '#006400', value: 120, label: { en: '120', bm: '120' } },
  { color: '#004d00', value: 500, label: { en: '500', bm: '500' } },
];

const pLevels: ColorLevel[] = [
  { color: '#fffacd', value: 0, label: { en: '0', bm: '0' } },
  { color: '#eee8aa', value: 10, label: { en: '10', bm: '10' } },
  { color: '#f5deb3', value: 50, label: { en: '50', bm: '50' } },
  { color: '#deb887', value: 80, label: { en: '80', bm: '80' } },
  { color: '#bc8f8f', value: 120, label: { en: '120', bm: '120' } },
  { color: '#8b008b', value: 240, label: { en: '240', bm: '240' } },
];

const kLevels: ColorLevel[] = [
  { color: '#daa520', value: 0, label: { en: '0', bm: '0' } },
  { color: '#f4a460', value: 10, label: { en: '10', bm: '10' } },
  { color: '#8b864e', value: 50, label: { en: '50', bm: '50' } },
  { color: '#bdb76b', value: 80, label: { en: '80', bm: '80' } },
  { color: '#a9a9a9', value: 120, label: { en: '120', bm: '120' } },
  { color: '#708090', value: 240, label: { en: '240', bm: '240' } },
];

interface NutrientRow {
  key: string;
  label: { en: string; bm: string };
  unit: string;
  levels: ColorLevel[];
}

const rows: NutrientRow[] = [
  { key: 'ph', label: { en: 'pH Level', bm: 'Tahap pH' }, unit: '', levels: phLevels },
  { key: 'n', label: { en: 'Nitrogen (N)', bm: 'Nitrogen (N)' }, unit: 'mg/L', levels: nLevels },
  { key: 'p', label: { en: 'Phosphorus (P)', bm: 'Fosforus (P)' }, unit: 'mg/L', levels: pLevels },
  { key: 'k', label: { en: 'Potassium (K)', bm: 'Kalium (K)' }, unit: 'mg/L', levels: kLevels },
];

interface TestKitTabProps {
  lang: 'en' | 'bm';
  onSubmit: (n: number, p: number, k: number, ph?: number) => void;
}

export function TestKitTab({ lang, onSubmit }: TestKitTabProps) {
  const [selected, setSelected] = useState<Record<string, number | null>>({
    ph: null, n: null, p: null, k: null,
  });

  const canSubmit = selected.n !== null && selected.p !== null && selected.k !== null && selected.ph !== null;
  const lightColors = ['#f0e68c', '#fffacd', '#eee8aa', '#f5deb3', '#deb887', '#daa520', '#f4a460', '#bdb76b', '#9acd32', '#f08080', '#e9967a', '#cd5c5c', '#bc8f8f', '#a9a9a9'];

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-sans font-bold text-foreground">
            {t(lang, 'Rapid Test Kit', 'Kit Ujian Pantas')}
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            {t(lang, 'Match the colors from your soil test kit', 'Padankan warna dari kit ujian tanah anda')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'Select the color that matches your soil test kit for each nutrient row', 'Pilih warna yang sepadan dengan kit ujian tanah anda untuk setiap baris nutrien')} lang={lang} size="sm" />
      </div>

      {/* Compact nutrient rows - 2x2 grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {rows.map(row => (
          <div key={row.key} className="bg-muted/30 rounded-lg px-3 py-2 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-sans font-semibold text-foreground text-xs">{row.label[lang]}</span>
              {row.unit && <span className="text-[10px] text-muted-foreground font-sans">({row.unit})</span>}
              <SpeakerButton text={row.label[lang]} lang={lang} size="sm" />
              {selected[row.key] !== null && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-sans font-semibold">
                  {selected[row.key]}{row.unit ? ` ${row.unit}` : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {row.levels.map((level, i) => {
                const isSelected = selected[row.key] === level.value;
                const isLight = lightColors.includes(level.color);
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(prev => ({ ...prev, [row.key]: level.value }))}
                    className={`relative w-7 h-7 rounded-lg transition-all duration-200 active:scale-90 flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-primary ring-offset-1 scale-110 shadow-md'
                        : 'hover:scale-105 hover:shadow-sm'
                    }`}
                    style={{ backgroundColor: level.color }}
                    aria-label={`${row.label[lang]} ${level.label[lang]}`}
                    title={`${level.label[lang]}${row.unit ? ' ' + row.unit : ''}`}
                  >
                    {isSelected && (
                      <Check size={11} className={isLight ? 'text-foreground' : 'text-white'} strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Compact inline summary */}
      {(selected.ph !== null || selected.n !== null || selected.p !== null || selected.k !== null) && (
        <div className="mt-2 bg-primary/5 rounded-lg px-3 py-2 border border-primary/10 flex items-center gap-4">
          <span className="font-sans text-xs font-semibold text-foreground shrink-0">
            {t(lang, 'Selected:', 'Dipilih:')}
          </span>
          <div className="flex gap-4 flex-1">
            {rows.map(row => (
              <div key={row.key} className="text-center">
                <p className="text-[10px] text-muted-foreground font-sans">{row.key.toUpperCase()}</p>
                <p className="text-xs font-sans font-bold text-foreground tabular-nums">
                  {selected[row.key] !== null ? `${selected[row.key]}` : '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={!canSubmit}
        onClick={() => canSubmit && onSubmit(selected.n!, selected.p!, selected.k!, selected.ph!)}
        className="w-full mt-2 rounded-full py-2 font-sans font-semibold text-xs btn-gradient-primary"
      >
        {t(lang, 'Confirm & Analyze', 'Sahkan & Analisis')}
      </button>
    </div>
  );
}
