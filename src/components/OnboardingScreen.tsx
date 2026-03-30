import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sprout } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import leafSketch from '@/assets/leaf-sketch.png';

interface OnboardingProps {
  lang: 'en' | 'bm';
  onComplete: (data: { name: string; crop: string; farmSize: string; lang: 'en' | 'bm' }) => void;
  onBack?: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function OnboardingScreen({ lang, onComplete, onBack }: OnboardingProps) {
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');

  const canSubmit = name.trim() && crop.trim() && farmSize;

  return (
    <div className="min-h-screen bg-cream-brand flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      <img src={leafSketch} alt="" className="absolute top-8 right-8 w-40 opacity-10 animate-float pointer-events-none" />
      <img src={leafSketch} alt="" className="absolute bottom-12 left-8 w-32 opacity-[0.07] rotate-180 animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-luxe">
            <Sprout className="text-primary-foreground" size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-brown-brand tracking-tight">AgroMate</h1>
          <p className="mt-2 text-gold-brand font-medium text-lg font-body">
            {t(lang, 'Smart Fertiliser Optimiser', 'Pengoptimum Baja Pintar')}
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-card rounded-3xl p-8 shadow-luxe animate-in fade-in slide-in-from-bottom-4 duration-500 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif-display text-brown-brand font-semibold">
              {t(lang, 'Your Profile', 'Profil Anda')}
            </h2>
            <SpeakerButton text={t(lang, 'Fill in your farming profile', 'Isi profil pertanian anda')} lang={lang} />
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder=" "
                className="peer w-full rounded-2xl border border-border bg-muted/50 px-4 pt-6 pb-2 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
              <label className="absolute left-4 top-2 text-xs text-muted-foreground font-body font-medium peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all pointer-events-none flex items-center gap-1">
                {t(lang, 'Your Name', 'Nama Anda')}
              </label>
              <div className="absolute right-3 top-3">
                <SpeakerButton text={t(lang, 'Your Name', 'Nama Anda')} lang={lang} size="sm" />
              </div>
            </div>

            {/* Crop Type - Text Input */}
            <div className="relative">
              <input
                type="text"
                value={crop}
                onChange={e => setCrop(e.target.value)}
                placeholder=" "
                className="peer w-full rounded-2xl border border-border bg-muted/50 px-4 pt-6 pb-2 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
              <label className="absolute left-4 top-2 text-xs text-muted-foreground font-body font-medium peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all pointer-events-none">
                {t(lang, 'Crop Type (e.g. Oil Palm, Paddy)', 'Jenis Tanaman (cth. Kelapa Sawit, Padi)')}
              </label>
              <div className="absolute right-3 top-3">
                <SpeakerButton text={t(lang, 'Crop Type', 'Jenis Tanaman')} lang={lang} size="sm" />
              </div>
            </div>

            {/* Farm Size */}
            <div className="relative">
              <input
                type="number"
                value={farmSize}
                onChange={e => setFarmSize(e.target.value)}
                placeholder=" "
                min="0.1"
                step="0.1"
                className="peer w-full rounded-2xl border border-border bg-muted/50 px-4 pt-6 pb-2 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
              <label className="absolute left-4 top-2 text-xs text-muted-foreground font-body font-medium peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all pointer-events-none">
                {t(lang, 'Farm Size (hectares)', 'Saiz Ladang (hektar)')}
              </label>
              <div className="absolute right-3 top-3">
                <SpeakerButton text={t(lang, 'Farm Size in hectares', 'Saiz Ladang dalam hektar')} lang={lang} size="sm" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={!canSubmit}
            onClick={() => canSubmit && onComplete({ name, crop, farmSize, lang })}
            className="w-full mt-8 bg-primary text-primary-foreground rounded-2xl py-4 font-body font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed shadow-luxe"
          >
            {t(lang, 'Get Started', 'Mulakan')}
            <ArrowRight size={20} />
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full mt-3 text-muted-foreground text-sm font-body hover:text-foreground transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} />
              {t(lang, 'Back to Home', 'Kembali ke Utama')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
