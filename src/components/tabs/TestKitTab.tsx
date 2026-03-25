import { useState } from 'react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface TestKitTabProps {
  lang: 'en' | 'bm';
  onSubmit: (n: number, p: number, k: number, ph?: number, mg?: number | null) => void;
}

export function TestKitTab({ lang, onSubmit }: TestKitTabProps) {
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [k, setK] = useState('');
  const [ph, setPh] = useState('');
  const [mg, setMg] = useState('');

  const canSubmit = n !== '' && p !== '' && k !== '' && ph !== '';

  return (
    <div className="bg-card rounded-2xl border border-border/40 shadow-luxe px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-sans font-bold text-foreground">
            {t(lang, 'Manual Entry', 'Kemasukan Manual')}
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            {t(lang, 'Enter your soil test values', 'Masukkan nilai ujian tanah anda')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'Enter nitrogen, phosphorus, potassium and pH values from your soil test', 'Masukkan nilai nitrogen, fosforus, kalium dan pH dari ujian tanah anda')} lang={lang} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Nitrogen */}
        <div className="relative">
          <input
            type="number"
            value={n}
            onChange={e => setN(e.target.value)}
            placeholder=" "
            min="0"
            step="1"
            className="peer w-full rounded-xl input-premium px-3 pt-5 pb-1.5 pr-14 font-body text-sm text-foreground transition-all"
          />
          <label className="absolute left-3 top-1 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary transition-all pointer-events-none">
            {t(lang, 'Nitrogen (N)', 'Nitrogen (N)')}
          </label>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-body text-[10px] font-medium">ppm</span>
        </div>

        {/* Phosphorus */}
        <div className="relative">
          <input
            type="number"
            value={p}
            onChange={e => setP(e.target.value)}
            placeholder=" "
            min="0"
            step="1"
            className="peer w-full rounded-xl input-premium px-3 pt-5 pb-1.5 pr-14 font-body text-sm text-foreground transition-all"
          />
          <label className="absolute left-3 top-1 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary transition-all pointer-events-none">
            {t(lang, 'Phosphorus (P)', 'Fosforus (P)')}
          </label>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-body text-[10px] font-medium">ppm</span>
        </div>

        {/* Potassium */}
        <div className="relative">
          <input
            type="number"
            value={k}
            onChange={e => setK(e.target.value)}
            placeholder=" "
            min="0"
            step="1"
            className="peer w-full rounded-xl input-premium px-3 pt-5 pb-1.5 pr-14 font-body text-sm text-foreground transition-all"
          />
          <label className="absolute left-3 top-1 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary transition-all pointer-events-none">
            {t(lang, 'Potassium (K)', 'Kalium (K)')}
          </label>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-body text-[10px] font-medium">ppm</span>
        </div>

        {/* pH */}
        <div className="relative">
          <input
            type="number"
            value={ph}
            onChange={e => setPh(e.target.value)}
            placeholder=" "
            min="0"
            max="14"
            step="0.1"
            className="peer w-full rounded-xl input-premium px-3 pt-5 pb-1.5 font-body text-sm text-foreground transition-all"
          />
          <label className="absolute left-3 top-1 text-[10px] text-muted-foreground font-body font-medium peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary transition-all pointer-events-none">
            {t(lang, 'Soil pH', 'pH Tanah')}
          </label>
        </div>
      </div>

      {/* Magnesium — optional */}
      <div className="mt-3">
        <div className="relative">
          <input
            type="number"
            value={mg}
            onChange={e => setMg(e.target.value)}
            placeholder="0"
            min="0"
            step="0.1"
            className="peer w-full rounded-xl input-premium px-3 pt-5 pb-1.5 pr-14 font-body text-sm text-foreground transition-all"
          />
          <label className="absolute left-3 top-1 text-[10px] text-muted-foreground font-body font-medium pointer-events-none">
            {t(lang, 'Magnesium (Mg) — ppm (optional)', 'Magnesium (Mg) — ppm (pilihan)')}
          </label>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-body text-[10px] font-medium">ppm</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-body mt-1 px-1">
          {t(lang, 'Leave empty if no data available', 'Jika tidak ada data, biarkan kosong')}
        </p>
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => canSubmit && onSubmit(Number(n), Number(p), Number(k), Number(ph), mg.trim() ? Number(mg) : null)}
        className="w-full mt-4 rounded-full py-2.5 font-sans font-semibold text-xs btn-gradient-primary"
      >
        {t(lang, 'Confirm & Analyze', 'Sahkan & Analisis')}
      </button>
    </div>
  );
}
