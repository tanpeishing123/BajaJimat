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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* AI Disclaimer */}
      <div className="bg-gold-light rounded-2xl p-4 flex items-start gap-3 border border-accent/30">
        <AlertTriangle size={20} className="text-accent shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-body text-foreground font-medium">
            {t(lang, 'AI Visual Analysis — results are estimates only', 'Analisis Visual AI — keputusan hanya anggaran')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'AI visual analysis disclaimer, results are estimates only', 'Penafian analisis visual AI, keputusan hanya anggaran')} lang={lang} size="sm" />
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif-display font-semibold text-brown-brand">
            {t(lang, 'Leaf Photo', 'Foto Daun')}
          </h2>
          <SpeakerButton text={t(lang, 'Upload a photo of your crop leaf for analysis', 'Muat naik foto daun tanaman anda untuk analisis')} lang={lang} />
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
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
            <img src={preview} alt="Leaf preview" className="max-h-48 mx-auto rounded-xl object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Camera size={40} className="text-primary/60" />
              <p className="font-body text-sm">{t(lang, 'Upload a photo of your crop leaf', 'Muat naik foto daun tanaman anda')}</p>
            </div>
          )}
        </div>

        <button
          disabled={!preview}
          onClick={onSubmit}
          className="w-full mt-5 bg-primary text-primary-foreground rounded-2xl py-3.5 font-body font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t(lang, 'Submit', 'Hantar')}
        </button>
      </div>
    </div>
  );
}
