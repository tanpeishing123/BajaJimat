import { useState, useRef } from 'react';
import { FileText, Loader2, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

interface ExtractedSoil {
  n_ppm: number;
  p_ppm: number;
  k_ppm: number;
  ph: number;
  mg_ppm: number | null;
  confidence: 'high' | 'medium' | 'low';
  confidence_label: string;
}

interface SoilSubmitData {
  soil_npk: { n_ppm: number; p_ppm: number; k_ppm: number; confidence: string };
  ph: number;
  mg_ppm?: number | null;
}

export function SoilReportTab({ lang, onSubmit }: { lang: 'en' | 'bm'; onSubmit: (data: SoilSubmitData) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedSoil | null>(null);

  const [editN, setEditN] = useState(0);
  const [editP, setEditP] = useState(0);
  const [editK, setEditK] = useState(0);
  const [editPh, setEditPh] = useState(0);
  const [editMg, setEditMg] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setExtracted(null);
    setExtractError(null);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setExtractError(null);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const storedLang = (localStorage.getItem('lang') as 'en' | 'bm') || lang;

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-soil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          image_base64: base64,
          mime_type: file.type,
          lang: storedLang,
        }),
      });

      const data = await res.json();

      if (data.error === 'not_a_soil_report' || !res.ok) {
        setExtractError(
          t(lang,
            'This does not appear to be a soil report. Please upload the correct file.',
            'Ini bukan laporan tanah. Sila muat naik laporan yang betul.'
          )
        );
        return;
      }

      setExtracted(data);
      setEditN(data.n_ppm);
      setEditP(data.p_ppm);
      setEditK(data.k_ppm);
      setEditPh(data.ph);
      setEditMg(data.mg_ppm ?? null);
    } catch (err: any) {
      setExtractError(err.message || 'Something went wrong');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirm = () => {
    if (!extracted) return;
    onSubmit({
      soil_npk: {
        n_ppm: editN,
        p_ppm: editP,
        k_ppm: editK,
        confidence: extracted.confidence,
      },
      ph: editPh,
      mg_ppm: editMg,
    });
  };

  const confidenceColor = extracted?.confidence === 'high'
    ? 'bg-primary/10 text-primary'
    : extracted?.confidence === 'medium'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-destructive/10 text-destructive';

  return (
    <div className="bg-card rounded-2xl border border-border/40 shadow-luxe px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-sans font-bold text-foreground">
            {t(lang, 'Soil Report Analysis', 'Analisis Laporan Tanah')}
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            {t(lang, 'Upload your DOA soil test results', 'Muat naik keputusan ujian tanah DOA anda')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'Upload your DOA soil report here', 'Muat naik laporan tanah DOA anda di sini')} lang={lang} size="sm" />
      </div>

      {/* Extraction error */}
      {extractError && (
        <div className="mb-3 flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <AlertTriangle size={14} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive font-sans">{extractError}</p>
        </div>
      )}

      {/* Extracted values review */}
      {extracted ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-primary" />
            <span className="text-xs font-sans font-semibold text-foreground">
              {t(lang, 'Extracted Values', 'Nilai yang Diekstrak')}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${confidenceColor}`}>
              {extracted.confidence_label}
            </span>
          </div>

          <p className="text-[10px] text-muted-foreground font-sans flex items-center gap-1">
            <Edit3 size={10} />
            {t(lang, 'Edit values below if OCR made mistakes', 'Ubah nilai di bawah jika OCR membuat kesilapan')}
          </p>

          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'N (ppm)', value: editN, set: (v: number) => setEditN(v), placeholder: undefined },
              { label: 'P (ppm)', value: editP, set: (v: number) => setEditP(v), placeholder: undefined },
              { label: 'K (ppm)', value: editK, set: (v: number) => setEditK(v), placeholder: undefined },
              { label: 'pH', value: editPh, set: (v: number) => setEditPh(v), placeholder: undefined },
              { label: 'Mg (ppm)', value: editMg ?? '', set: (v: number) => setEditMg(v || null), placeholder: '—' },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[10px] text-muted-foreground font-sans font-medium block mb-0.5">{field.label}</label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.set(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg input-premium text-xs font-sans text-foreground"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            className="w-full mt-1 rounded-xl py-2.5 font-sans font-semibold text-xs btn-gradient-primary"
          >
            {t(lang, 'Continue →', 'Teruskan →')}
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/10'); }}
            onDragLeave={e => { e.currentTarget.classList.remove('border-primary', 'bg-primary/10'); }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="dropzone-premium rounded-xl p-6 text-center cursor-pointer"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-24 mx-auto rounded-lg object-contain" />
            ) : file ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText size={20} className="text-primary" />
                </div>
                <p className="font-sans text-xs font-semibold text-foreground">{file.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-foreground">
                    {t(lang, 'Upload or drag & drop your soil report', 'Muat naik atau seret & lepas laporan tanah anda')}
                  </p>
                  <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                    {t(lang, 'Supports PDF files and clear images', 'Menyokong fail PDF dan gambar yang jelas')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!file || isExtracting}
            onClick={handleExtract}
            className="w-full mt-3 rounded-xl py-2.5 font-sans font-semibold text-xs btn-gradient-primary flex items-center justify-center gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {t(lang, 'Extracting...', 'Mengekstrak...')}
              </>
            ) : (
              t(lang, 'Submit & Analyse', 'Hantar & Analisis')
            )}
          </button>
        </>
      )}
    </div>
  );
}
