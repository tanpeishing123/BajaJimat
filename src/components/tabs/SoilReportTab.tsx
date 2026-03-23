import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
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

  // Editable fields after extraction
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
    });
  };

  const confidenceColor = extracted?.confidence === 'high'
    ? 'bg-emerald-50 text-emerald-700'
    : extracted?.confidence === 'medium'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-red-50 text-red-700';

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-sans font-bold text-foreground">
            {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            {t(lang, 'Upload your DOA soil report for analysis', 'Muat naik laporan tanah DOA anda untuk analisis')}
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
            <CheckCircle size={14} className="text-emerald-600" />
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

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'N (ppm)', value: editN, set: setEditN },
              { label: 'P (ppm)', value: editP, set: setEditP },
              { label: 'K (ppm)', value: editK, set: setEditK },
              { label: 'pH', value: editPh, set: setEditPh },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[10px] text-muted-foreground font-sans font-medium block mb-0.5">{field.label}</label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.set(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded-lg border border-border text-xs font-sans text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            className="w-full mt-1 rounded-full py-2 font-sans font-semibold text-xs btn-gradient-primary"
          >
            {t(lang, 'Continue →', 'Teruskan →')}
          </button>
        </div>
      ) : (
        <>
          {/* Upload area */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
            onDragLeave={e => { e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/[0.02]"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-20 mx-auto rounded-lg object-contain" />
            ) : file ? (
              <div className="flex items-center gap-3 justify-center text-muted-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText size={14} className="text-primary" />
                </div>
                <p className="font-sans text-xs font-medium text-foreground">{file.name}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-center text-muted-foreground">
                <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                  <Upload size={16} className="text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-sans text-xs font-medium text-foreground">
                    {t(lang, 'Drag & drop or click to upload', 'Seret & lepas atau klik untuk muat naik')}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground">
                    {t(lang, 'Supports PDF and image formats', 'Menyokong format PDF dan imej')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!file || isExtracting}
            onClick={handleExtract}
            className="w-full mt-3 rounded-full py-2 font-sans font-semibold text-xs btn-gradient-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {t(lang, 'Extracting...', 'Mengekstrak...')}
              </>
            ) : (
              t(lang, 'Submit & Analyze', 'Hantar & Analisis')
            )}
          </button>
        </>
      )}
    </div>
  );
}
