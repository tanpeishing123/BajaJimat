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
    <div className="space-y-2">
      {/* AI Disclaimer - compact */}
      <div className="rounded-lg px-3 py-2 flex items-center gap-2 bg-amber-50 border border-amber-200/60">
        <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center shrink-0">
          <AlertTriangle size={12} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-sans font-medium text-amber-800">
            {t(lang, 'AI Visual Analysis', 'Analisis Visual AI')}
            <span className="font-normal text-amber-600 ml-1">
              — {t(lang, 'estimates only, field verification recommended', 'anggaran sahaja, verifikasi lapangan disyorkan')}
            </span>
          </p>
        </div>
        <SpeakerButton text={t(lang, 'AI visual analysis disclaimer', 'Penafian analisis visual AI')} lang={lang} size="sm" />
      </div>

      {/* Upload Card - compact */}
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-sans font-bold text-foreground">
              {t(lang, 'Leaf Photo Analysis', 'Analisis Foto Daun')}
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              {t(lang, 'Take or upload a photo of your crop leaf', 'Ambil atau muat naik foto daun tanaman anda')}
            </p>
          </div>
          <SpeakerButton text={t(lang, 'Upload a photo of your crop leaf for analysis', 'Muat naik foto daun tanaman anda untuk analisis')} lang={lang} size="sm" />
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/[0.02]"
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
            <img src={preview} alt="Leaf preview" className="max-h-20 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="flex items-center gap-3 justify-center text-muted-foreground">
              <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                <Camera size={16} className="text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-sans text-xs font-medium text-foreground">
                  {t(lang, 'Take a photo or upload from gallery', 'Ambil foto atau muat naik dari galeri')}
                </p>
                <p className="font-sans text-[10px] text-muted-foreground">
                  {t(lang, 'Clear, close-up photos work best', 'Foto yang jelas dan dekat memberi hasil terbaik')}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          disabled={!preview}
          onClick={onSubmit}
          className="w-full mt-3 rounded-full py-2 font-sans font-semibold text-xs btn-gradient-primary"
        >
          {t(lang, 'Analyze Leaf', 'Analisis Daun')}
        </button>
      </div>
    </div>
  );
}
