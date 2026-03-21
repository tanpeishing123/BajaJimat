import { useState, useRef } from 'react';
import { Upload, FileImage } from 'lucide-react';
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
    <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif-display font-semibold text-brown-brand">
          {t(lang, 'Soil Report', 'Laporan Tanah')}
        </h2>
        <SpeakerButton text={t(lang, 'Upload your DOA soil report here', 'Muat naik laporan tanah DOA anda di sini')} lang={lang} />
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }}
        onDragLeave={e => e.currentTarget.classList.remove('border-primary')}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-primary');
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
        ) : file ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileImage size={40} className="text-primary" />
            <p className="font-body text-sm">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Upload size={40} className="text-primary/60" />
            <p className="font-body text-sm">{t(lang, 'Drag DOA report here or click to upload', 'Seret laporan DOA ke sini atau klik untuk muat naik')}</p>
          </div>
        )}
      </div>

      <button
        disabled={!file}
        onClick={onSubmit}
        className="w-full mt-5 bg-primary text-primary-foreground rounded-2xl py-3.5 font-body font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t(lang, 'Submit', 'Hantar')}
      </button>
    </div>
  );
}
