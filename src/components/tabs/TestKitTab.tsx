import { useState } from 'react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const levels = [
  { color: '#991B1B', label: { en: 'Depleted', bm: 'Habis' }, value: 0 },
  { color: '#EA580C', label: { en: 'Deficient', bm: 'Kurang' }, value: 1 },
  { color: '#EAB308', label: { en: 'Adequate', bm: 'Mencukupi' }, value: 2 },
  { color: '#65A30D', label: { en: 'Sufficient', bm: 'Cukup' }, value: 3 },
  { color: '#166534', label: { en: 'Surplus', bm: 'Lebihan' }, value: 4 },
];

const nutrients = [
  { key: 'n', en: 'Nitrogen (N)', bm: 'Nitrogen (N)' },
  { key: 'p', en: 'Phosphorus (P)', bm: 'Fosforus (P)' },
  { key: 'k', en: 'Potassium (K)', bm: 'Kalium (K)' },
];

export function TestKitTab({ lang, onSubmit }: { lang: 'en' | 'bm'; onSubmit: (n: number, p: number, k: number) => void }) {
  const [selected, setSelected] = useState<Record<string, number | null>>({ n: null, p: null, k: null });

  const canSubmit = selected.n !== null && selected.p !== null && selected.k !== null;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-serif-display font-semibold text-brown-brand">
          {t(lang, 'Soil Test Kit', 'Kit Ujian Tanah')}
        </h2>
        <SpeakerButton text={t(lang, 'Select the color that matches your soil test kit for each nutrient', 'Pilih warna yang sepadan dengan kit ujian tanah anda untuk setiap nutrien')} lang={lang} />
      </div>

      <div className="space-y-6">
        {nutrients.map(nutrient => (
          <div key={nutrient.key}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-body font-medium text-foreground text-sm">{lang === 'bm' ? nutrient.bm : nutrient.en}</span>
              <SpeakerButton text={lang === 'bm' ? nutrient.bm : nutrient.en} lang={lang} size="sm" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {levels.map((level, i) => {
                const isSelected = selected[nutrient.key] === level.value;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <button
                      onClick={() => setSelected(prev => ({ ...prev, [nutrient.key]: level.value }))}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 active:scale-90 ${
                        isSelected ? 'ring-3 ring-primary ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: level.color }}
                      aria-label={level.label[lang]}
                    />
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-body text-center leading-tight">
                      {level.label[lang]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => canSubmit && onSubmit(selected.n!, selected.p!, selected.k!)}
        className="w-full mt-6 bg-primary text-primary-foreground rounded-2xl py-3.5 font-body font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t(lang, 'Submit', 'Hantar')}
      </button>
    </div>
  );
}
