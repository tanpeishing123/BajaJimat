import { useState, useRef } from 'react';
import { Sprout, FileImage } from 'lucide-react';
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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-serif-display font-semibold text-brown-brand">
          {t(lang, 'Upload Soil Report', 'Muat Naik Laporan Tanah')}
        </h2>
        <SpeakerButton text={t(lang, 'Upload your DOA soil report here', 'Muat naik laporan tanah DOA anda di sini')} lang={lang} size="sm" />
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
        className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/20 bg-cream-brand"
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
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileImage size={32} className="text-primary" />
            <p className="font-body text-sm">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Sprout size={32} className="text-primary/50" />
            <p className="font-body text-sm">{t(lang, 'Drag DOA report here or click to upload', 'Seret laporan DOA ke sini atau klik untuk muat naik')}</p>
          </div>
        )}
      </div>

      <button
        disabled={!file}
        onClick={onSubmit}
        className="w-full mt-4 rounded-xl py-2.5 font-body font-semibold text-sm btn-gradient-primary"
      >
        {t(lang, 'Submit', 'Hantar')}
      </button>
    </div>
  );
}
