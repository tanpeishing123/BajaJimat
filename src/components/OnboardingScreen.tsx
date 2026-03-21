import { useState } from 'react';
import { ArrowRight, Sprout } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import leafSketch from '@/assets/leaf-sketch.png';

interface OnboardingProps {
  onComplete: (data: { name: string; crop: string; farmSize: string; lang: 'en' | 'bm' }) => void;
}

const crops = [
  { key: 'musang_king', en: 'Musang King', bm: 'Musang King' },
  { key: 'oil_palm', en: 'Oil Palm', bm: 'Kelapa Sawit' },
  { key: 'paddy', en: 'Paddy', bm: 'Padi' },
  { key: 'vegetables', en: 'Vegetables', bm: 'Sayuran' },
  { key: 'rubber', en: 'Rubber', bm: 'Getah' },
];

export function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [lang, setLang] = useState<'en' | 'bm' | null>(null);
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');

  const t = (en: string, bm: string) => lang === 'bm' ? bm : en;

  const canSubmit = lang && name.trim() && crop && farmSize;

  return (
    <div className="min-h-screen bg-cream-brand flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating sketch decoration */}
      <img
        src={leafSketch}
        alt=""
        className="absolute top-8 right-8 w-40 opacity-10 animate-float pointer-events-none"
      />
      <img
        src={leafSketch}
        alt=""
        className="absolute bottom-12 left-8 w-32 opacity-[0.07] rotate-180 animate-float pointer-events-none"
        style={{ animationDelay: '3s' }}
      />

      <div className="w-full max-w-lg">
        {/* Logo + Brand */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-luxe">
            <Sprout className="text-primary-foreground" size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-brown-brand tracking-tight">
            BajaJimat
          </h1>
          <p className="mt-2 text-gold-brand font-medium text-lg font-body">
            Smart Fertilizer Optimizer / Pengoptimum Baja Pintar
          </p>
        </div>

        {/* Language Selector */}
        {!lang ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <p className="text-center text-muted-foreground font-body mb-6 text-base">Select Language / Pilih Bahasa</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLang('en')}
                className="bg-card rounded-3xl p-6 shadow-luxe hover:shadow-luxe-hover transition-all duration-300 text-center active:scale-[0.97] border border-border"
              >
                <span className="text-3xl block mb-2">🇬🇧</span>
                <span className="font-serif-display text-lg text-brown-brand font-semibold">English</span>
              </button>
              <button
                onClick={() => setLang('bm')}
                className="bg-card rounded-3xl p-6 shadow-luxe hover:shadow-luxe-hover transition-all duration-300 text-center active:scale-[0.97] border border-border"
              >
                <span className="text-3xl block mb-2">🇲🇾</span>
                <span className="font-serif-display text-lg text-brown-brand font-semibold">Bahasa Melayu</span>
              </button>
            </div>
          </div>
        ) : (
          /* Profile Form */
          <div className="bg-card rounded-3xl p-8 shadow-luxe animate-in fade-in slide-in-from-bottom-4 duration-500 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif-display text-brown-brand font-semibold">
                {t('Your Profile', 'Profil Anda')}
              </h2>
              <SpeakerButton text={t('Fill in your farming profile', 'Isi profil pertanian anda')} lang={lang} />
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2 mb-1.5">
                  {t('Your Name', 'Nama Anda')}
                  <SpeakerButton text={t('Your Name', 'Nama Anda')} lang={lang} size="sm" />
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('e.g. Ahmad', 'cth. Ahmad')}
                  className="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </div>

              {/* Crop Type */}
              <div>
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2 mb-1.5">
                  {t('Crop Type', 'Jenis Tanaman')}
                  <SpeakerButton text={t('Crop Type', 'Jenis Tanaman')} lang={lang} size="sm" />
                </label>
                <select
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow appearance-none"
                >
                  <option value="">{t('Select...', 'Pilih...')}</option>
                  {crops.map(c => (
                    <option key={c.key} value={c.key}>{lang === 'bm' ? c.bm : c.en}</option>
                  ))}
                </select>
              </div>

              {/* Farm Size */}
              <div>
                <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2 mb-1.5">
                  {t('Farm Size (hectares)', 'Saiz Ladang (hektar)')}
                  <SpeakerButton text={t('Farm Size in hectares', 'Saiz Ladang dalam hektar')} lang={lang} size="sm" />
                </label>
                <input
                  type="number"
                  value={farmSize}
                  onChange={e => setFarmSize(e.target.value)}
                  placeholder="e.g. 5"
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={!canSubmit}
              onClick={() => canSubmit && onComplete({ name, crop, farmSize, lang })}
              className="w-full mt-8 bg-primary text-primary-foreground rounded-2xl py-4 font-body font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed shadow-luxe"
            >
              {t('Get Started', 'Mulakan')}
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => setLang(null)}
              className="w-full mt-3 text-muted-foreground text-sm font-body hover:text-foreground transition-colors"
            >
              ← {t('Change Language', 'Tukar Bahasa')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
