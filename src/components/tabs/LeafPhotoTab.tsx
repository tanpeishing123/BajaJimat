import { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, Loader2 } from 'lucide-react';
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

      // Check for non-plant photo BEFORE generic error (edge function returns 400 for non-plant)
      if (data.is_plant_photo === false) {
        setFile(null);
        setPreview(null);
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
    <div className="space-y-2">
      {/* AI Disclaimer */}
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

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border-2 border-destructive/30">
          <AlertTriangle size={16} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive font-sans font-semibold">{error}</p>
        </div>
      )}

      {/* Upload Card */}
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

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { e.target.files?.[0] && handleFile(e.target.files[0]); e.target.value = ''; }}
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/[0.02]"
        >
          {preview ? (
            <img src={preview} alt="Leaf preview" className="max-h-24 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={20} className="text-primary" />
              </div>
              <p className="font-sans text-xs font-medium text-foreground">
                {t(lang, 'Drag & drop or click to upload', 'Seret & lepas atau klik untuk muat naik')}
              </p>
              <p className="font-sans text-[10px] text-muted-foreground">
                {t(lang, 'Supports photo capture and image formats', 'Menyokong tangkapan foto dan format imej')}
              </p>
            </div>
          )}
        </div>

        <button
          disabled={!file || isAnalyzing}
          onClick={handleAnalyze}
          className="w-full mt-3 rounded-full py-2 font-sans font-semibold text-xs btn-gradient-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t(lang, 'Analyzing...', 'Menganalisis...')}
            </>
          ) : (
            t(lang, 'Analyze Leaf', 'Analisis Daun')
          )}
        </button>
      </div>
    </div>
  );
}
