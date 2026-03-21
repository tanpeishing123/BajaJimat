import { useState, useRef } from 'react';
import { Upload, FileImage, FileText } from 'lucide-react';
import { SpeakerButton } from '../SpeakerButton';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function SoilReportTab({ lang, onSubmit }: { lang: 'en' | 'bm'; onSubmit: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-sans font-bold text-foreground">
            {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
          </h2>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            {t(lang, 'Upload your DOA soil report for analysis', 'Muat naik laporan tanah DOA anda untuk analisis')}
          </p>
        </div>
        <SpeakerButton text={t(lang, 'Upload your DOA soil report here', 'Muat naik laporan tanah DOA anda di sini')} lang={lang} size="sm" />
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
        onDragLeave={e => { e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-primary/[0.02]"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-xl object-contain" />
        ) : file ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <p className="font-sans text-sm font-medium text-foreground">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-foreground">
                {t(lang, 'Drag & drop or click to upload', 'Seret & lepas atau klik untuk muat naik')}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                {t(lang, 'Supports PDF and image formats', 'Menyokong format PDF dan imej')}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        disabled={!file}
        onClick={onSubmit}
        className="w-full mt-5 rounded-full py-3 font-sans font-semibold text-sm btn-gradient-primary"
      >
        {t(lang, 'Submit & Analyze', 'Hantar & Analisis')}
      </button>
    </div>
  );
}
