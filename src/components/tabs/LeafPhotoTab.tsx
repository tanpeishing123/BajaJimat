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
    <div className="space-y-4">
      {/* AI Disclaimer */}
      <div className="rounded-xl p-4 flex items-start gap-3 bg-amber-50 border border-amber-200/60">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-sans font-medium text-amber-800">
            {t(lang, 'AI Visual Analysis', 'Analisis Visual AI')}
          </p>
          <p className="text-xs font-sans text-amber-600 mt-0.5">
            {t(lang, 'Results are estimates only — field verification recommended', 'Keputusan hanya anggaran — disyorkan verifikasi lapangan')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'AI visual analysis disclaimer', 'Penafian analisis visual AI')} lang={lang} size="sm" />
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-sans font-bold text-foreground">
              {t(lang, 'Leaf Photo Analysis', 'Analisis Foto Daun')}
            </h2>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              {t(lang, 'Take or upload a photo of your crop leaf', 'Ambil atau muat naik foto daun tanaman anda')}
            </p>
          </div>
          <SpeakerButton text={t(lang, 'Upload a photo of your crop leaf for analysis', 'Muat naik foto daun tanaman anda untuk analisis')} lang={lang} size="sm" />
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/[0.02]"
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
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center">
                <Camera size={24} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">
                  {t(lang, 'Take a photo or upload from gallery', 'Ambil foto atau muat naik dari galeri')}
                </p>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  {t(lang, 'Clear, close-up photos work best', 'Foto yang jelas dan dekat memberi hasil terbaik')}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          disabled={!preview}
          onClick={onSubmit}
          className="w-full mt-5 rounded-full py-3 font-sans font-semibold text-sm btn-gradient-primary"
        >
          {t(lang, 'Analyze Leaf', 'Analisis Daun')}
        </button>
      </div>
    </div>
  );
}
