import { useState, useRef } from 'react';
import { Camera, AlertTriangle } from 'lucide-react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function LeafPhotoTab({ lang, onSubmit }: { lang: 'en' | 'bm'; onSubmit: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {/* AI Disclaimer with gold accent frame */}
      <div className="rounded-xl p-3 flex items-start gap-2.5 border-2 border-accent/30 bg-gold-light">
        <AlertTriangle size={16} className="text-accent shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-body text-foreground font-medium">
            {t(lang, 'AI Visual Analysis — results are estimates only', 'Analisis Visual AI — keputusan hanya anggaran')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'AI visual analysis disclaimer', 'Penafian analisis visual AI')} lang={lang} size="sm" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-serif-display font-semibold text-brown-brand">
            {t(lang, 'Visual Analysis', 'Analisis Visual')}
          </h2>
          <SpeakerButton text={t(lang, 'Upload a photo of your crop leaf for analysis', 'Muat naik foto daun tanaman anda untuk analisis')} lang={lang} size="sm" />
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/20 bg-cream-brand"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {preview ? (
            <img src={preview} alt="Leaf preview" className="max-h-40 mx-auto rounded-xl object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera size={32} className="text-primary/50" />
              <p className="font-body text-sm">{t(lang, 'Upload a photo of your crop leaf', 'Muat naik foto daun tanaman anda')}</p>
            </div>
          )}
        </div>

        <button
          disabled={!preview}
          onClick={onSubmit}
          className="w-full mt-4 rounded-xl py-2.5 font-body font-semibold text-sm transition-all duration-200 hover:brightness-105 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#faedcd', color: '#2d1a12' }}
        >
          {t(lang, 'Submit', 'Hantar')}
        </button>
      </div>
    </div>
  );
}
