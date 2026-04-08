import { useState, useRef } from 'react';
import { ImagePlus, Camera, AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export interface LeafAnalysisResult {
  is_plant_photo: boolean;
  deficiencies: {
    nutrient: string;
    severity: string;
    estimated_deficit_pct: number;
    visual_evidence: string;
  }[];
  overall_health: string;
  confidence: string;
  recommendation: string;
}

export function LeafPhotoTab({ lang, onSubmit }: { lang: 'en' | 'bm'; onSubmit: (result: LeafAnalysisResult) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type.startsWith('image/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const cropType = localStorage.getItem('crop_type') || 'musang_king_durian';

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-leaf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          image_base64: base64,
          mime_type: file.type,
          crop_type: cropType,
          lang,
        }),
      });

      const data = await res.json();

      if (data.is_plant_photo === false) {
        handleClear();
        setError(
          t(lang,
            'Error: No leaf detected. Please reupload a clear image of a leaf.',
            'Ralat: Tiada daun dikesan. Sila muat naik semula gambar daun yang jelas.'
          )
        );
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      onSubmit(data as LeafAnalysisResult);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* AI Disclaimer */}
      <div className="rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 bg-amber-50/70 border border-amber-200/40">
        <div className="w-6 h-6 rounded-lg bg-amber-100/80 flex items-center justify-center shrink-0">
          <AlertTriangle size={12} className="text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-sans font-medium text-amber-700">
            {t(lang, 'AI Visual Analysis', 'Analisis Visual AI')}
            <span className="font-normal text-amber-500 ml-1">
              — {t(lang, 'estimates only, field verification recommended', 'anggaran sahaja, verifikasi lapangan disyorkan')}
            </span>
          </p>
        </div>
        <SpeakerButton text={t(lang, 'AI visual analysis disclaimer', 'Penafian analisis visual AI')} lang={lang} size="sm" />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20">
          <AlertTriangle size={16} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive font-sans font-semibold">{error}</p>
        </div>
      )}

      {/* Upload Card */}
      <div className="bg-card rounded-2xl border border-border/40 shadow-luxe px-5 py-4">
        <div className="flex items-center justify-between mb-3">
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

        {/* Hidden file inputs */}
        <input
          id="leaf-photo-input"
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { e.target.files?.[0] && handleFile(e.target.files[0]); e.target.value = ''; }}
        />
        <input
          id="leaf-camera-input"
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { e.target.files?.[0] && handleFile(e.target.files[0]); e.target.value = ''; }}
        />

        {preview ? (
          <div className="relative rounded-xl border-2 border-dashed border-border/60 bg-muted/30 p-3">
            <img
              src={preview}
              alt="Leaf preview"
              className="w-full max-h-48 mx-auto rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border/60 text-xs font-sans font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={12} />
              {t(lang, 'Retake', 'Ambil Semula')}
            </button>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/30 py-6 px-4">
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ImagePlus size={22} className="text-primary" />
              </div>
              <p className="font-sans text-xs text-muted-foreground text-center max-w-[240px]">
                {t(lang,
                  'Snap a photo of your leaf or upload from gallery',
                  'Tangkap foto daun anda atau muat naik dari galeri'
                )}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <label
                htmlFor="leaf-camera-input"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera size={16} className="text-primary-foreground" />
                <span className="text-xs font-sans font-semibold text-primary-foreground">
                  {t(lang, 'Take Photo', 'Ambil Gambar')}
                </span>
              </label>
              <label
                htmlFor="leaf-photo-input"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <ImagePlus size={16} className="text-muted-foreground" />
                <span className="text-xs font-sans font-semibold text-foreground">
                  {t(lang, 'Upload Photo', 'Muat Naik')}
                </span>
              </label>
            </div>
          </div>
        )}

        <button
          disabled={!file || isAnalyzing}
          onClick={handleAnalyze}
          className="w-full mt-3 rounded-xl py-2.5 font-sans font-semibold text-xs btn-gradient-primary flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t(lang, 'Analyzing...', 'Menganalisis...')}
            </>
          ) : (
            t(lang, 'Analyse Leaf', 'Analisis Daun')
          )}
        </button>
      </div>
    </div>
  );
}