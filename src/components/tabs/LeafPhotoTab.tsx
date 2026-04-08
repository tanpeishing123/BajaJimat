import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Camera, AlertTriangle, Loader2, RotateCcw, MonitorUp } from 'lucide-react';
import { SpeakerButton } from '../SpeakerButton';
import { WebcamCapture } from '../WebcamCapture';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (f: File) => {
    if (f.type.startsWith('image/')) {
      if (preview) URL.revokeObjectURL(preview);
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
      setShowDesktopMenu(false);
    }
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setShowDesktopMenu(false);
  };

  const handleBoxClick = () => {
    if (preview) return;
    if (!isMobile) {
      setShowDesktopMenu(prev => !prev);
    }
  };

  const handleWebcamCapture = (capturedFile: File) => {
    handleFile(capturedFile);
    setShowWebcam(false);
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
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { e.target.files?.[0] && handleFile(e.target.files[0]); e.target.value = ''; }}
        />
        {/* Mobile input — no capture attr so native OS shows Camera + Gallery sheet */}
        <input
          ref={mobileInputRef}
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
          <div className="relative">
            {isMobile ? (
              <label
                htmlFor="leaf-mobile-upload"
                className="group block rounded-xl border-2 border-dashed border-border/60 bg-muted/30 py-10 px-4 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-luxe active:scale-[0.99]"
              >
                <input
                  id="leaf-mobile-upload"
                  ref={mobileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => { e.target.files?.[0] && handleFile(e.target.files[0]); e.target.value = ''; }}
                />
                <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-transform duration-200 group-hover:scale-105">
                    <ImagePlus size={24} className="text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-semibold text-foreground">
                      {t(lang, 'Click to upload or take photo', 'Klik untuk muat naik atau ambil gambar')}
                    </p>
                    <p className="mx-auto max-w-[260px] font-sans text-xs text-muted-foreground">
                      {t(lang,
                        'Snap a photo of your leaf or upload from gallery',
                        'Tangkap foto daun anda atau muat naik dari galeri'
                      )}
                    </p>
                  </div>
                </div>
              </label>
            ) : (
              <button
                type="button"
                onClick={handleBoxClick}
                className="group w-full rounded-xl border-2 border-dashed border-border/60 bg-muted/30 py-10 px-4 text-left cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-luxe active:scale-[0.99]"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-transform duration-200 group-hover:scale-105">
                    <ImagePlus size={24} className="text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-semibold text-foreground">
                      {t(lang, 'Click to upload or take photo', 'Klik untuk muat naik atau ambil gambar')}
                    </p>
                    <p className="mx-auto max-w-[260px] font-sans text-xs text-muted-foreground">
                      {t(lang,
                        'Snap a photo of your leaf or upload from gallery',
                        'Tangkap foto daun anda atau muat naik dari galeri'
                      )}
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Desktop popup menu */}
            {showDesktopMenu && !isMobile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDesktopMenu(false)} />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 bg-card rounded-xl border border-border/60 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <button
                    onClick={() => { inputRef.current?.click(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MonitorUp size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-semibold text-foreground">
                         {t(lang, 'Upload Image', 'Muat Naik Imej')}
                      </p>
                      <p className="text-[10px] font-sans text-muted-foreground">
                        {t(lang, 'Choose an image file', 'Pilih fail imej')}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setShowDesktopMenu(false); setShowWebcam(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Camera size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-semibold text-foreground">
                         {t(lang, 'Take Photo', 'Ambil Gambar')}
                      </p>
                      <p className="text-[10px] font-sans text-muted-foreground">
                        {t(lang, 'Use your device camera', 'Gunakan kamera peranti')}
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
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

      {/* Webcam modal for desktop */}
      {showWebcam && (
        <WebcamCapture
          lang={lang}
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
}
