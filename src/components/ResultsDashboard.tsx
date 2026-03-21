import { ArrowLeft, Check, Leaf, Volume2 } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { useSpeech } from '@/hooks/useSpeech';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

const levelNames: Record<'en' | 'bm', string[]> = {
  en: ['Depleted', 'Deficient', 'Adequate', 'Sufficient', 'Surplus'],
  bm: ['Habis', 'Kurang', 'Mencukupi', 'Cukup', 'Lebihan'],
};

interface Props {
  lang: 'en' | 'bm';
  npk: { n: number; p: number; k: number };
  profile: { name: string; crop: string; farmSize: string };
  onBack: () => void;
}

// Mock data based on NPK levels
function getMockResults(npk: { n: number; p: number; k: number }) {
  const deficits = {
    n: Math.max(0, 2 - npk.n) * 18,
    p: Math.max(0, 2 - npk.p) * 12,
    k: Math.max(0, 2 - npk.k) * 15,
  };
  const totalDeficit = deficits.n + deficits.p + deficits.k;
  const hasDeficit = totalDeficit > 0;
  const savings = hasDeficit ? Math.round(totalDeficit * 2.8 + 45) : 0;
  const confidence = npk.n <= 1 || npk.p <= 1 || npk.k <= 1 ? 'high' : npk.n <= 2 ? 'medium' : 'low';

  const recommendations = [];
  if (deficits.n > 0) recommendations.push({ name: 'Urea (46-0-0)', bags: Math.ceil(deficits.n / 10), price: 85 });
  if (deficits.p > 0) recommendations.push({ name: 'TSP (0-46-0)', bags: Math.ceil(deficits.p / 8), price: 110 });
  if (deficits.k > 0) recommendations.push({ name: 'MOP (0-0-60)', bags: Math.ceil(deficits.k / 12), price: 95 });

  return { deficits, hasDeficit, savings, confidence, recommendations };
}

export function ResultsDashboard({ lang, npk, profile, onBack }: Props) {
  const { speak, isSpeaking } = useSpeech(lang);
  const results = getMockResults(npk);

  const radarData = [
    { nutrient: 'N', deficit: results.deficits.n, fullMark: 40 },
    { nutrient: 'P', deficit: results.deficits.p, fullMark: 40 },
    { nutrient: 'K', deficit: results.deficits.k, fullMark: 40 },
  ];

  const voiceSummary = t(lang,
    `${profile.name}, your ${profile.crop} farm needs ${results.deficits.n} kg nitrogen, ${results.deficits.p} kg phosphorus, and ${results.deficits.k} kg potassium per hectare. You can save RM ${results.savings} compared to premium blends.`,
    `${profile.name}, ladang ${profile.crop} anda memerlukan ${results.deficits.n} kg nitrogen, ${results.deficits.p} kg fosforus, dan ${results.deficits.k} kg kalium sehektar. Anda boleh jimat RM ${results.savings} berbanding baja premium.`
  );

  const confidenceColors: Record<string, string> = {
    high: 'bg-primary text-primary-foreground',
    medium: 'bg-accent text-accent-foreground',
    low: 'bg-orange-500 text-white',
  };

  if (!results.hasDeficit) {
    return (
      <div className="min-h-screen bg-cream-brand flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl p-8 shadow-luxe border border-border max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Check className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-serif-display text-brown-brand font-bold mb-2">
            {t(lang, 'No Deficits Detected!', 'Tiada Kekurangan Dikesan!')}
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            {t(lang, 'Your soil is balanced. Keep up the great work!', 'Tanah anda seimbang. Teruskan usaha!')}
          </p>
          <button onClick={onBack} className="text-primary font-body font-medium flex items-center gap-1 mx-auto hover:underline">
            <ArrowLeft size={16} /> {t(lang, 'Back', 'Kembali')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-brand">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-serif-display font-bold text-brown-brand">
            {t(lang, 'Results', 'Keputusan')}
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Hear Summary */}
        <button
          onClick={() => speak(voiceSummary)}
          className={`w-full bg-primary text-primary-foreground rounded-2xl py-4 font-body font-semibold text-base flex items-center justify-center gap-2 shadow-luxe transition-all duration-200 hover:brightness-110 active:scale-[0.97] ${isSpeaking ? 'animate-pulse-ring' : ''}`}
        >
          <Volume2 size={20} />
          {t(lang, '🔊 Hear Full Summary', '🔊 Dengar Ringkasan Penuh')}
        </button>

        {/* Confidence Badge */}
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-body font-semibold ${confidenceColors[results.confidence]}`}>
            {t(lang, 'Confidence', 'Keyakinan')}: {t(lang, results.confidence.charAt(0).toUpperCase() + results.confidence.slice(1), results.confidence === 'high' ? 'Tinggi' : results.confidence === 'medium' ? 'Sederhana' : 'Rendah')}
          </span>
          {results.confidence !== 'high' && (
            <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
              <Leaf size={12} /> {t(lang, 'Consider lab test for higher accuracy', 'Pertimbangkan ujian makmal untuk ketepatan lebih tinggi')}
            </span>
          )}
        </div>

        {/* NPK Radar */}
        <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif-display text-lg font-semibold text-brown-brand">
              {t(lang, 'NPK Deficit Analysis', 'Analisis Kekurangan NPK')}
            </h3>
            <SpeakerButton
              text={t(lang,
                `Nitrogen deficit ${results.deficits.n} kg, Phosphorus deficit ${results.deficits.p} kg, Potassium deficit ${results.deficits.k} kg`,
                `Kekurangan Nitrogen ${results.deficits.n} kg, Kekurangan Fosforus ${results.deficits.p} kg, Kekurangan Kalium ${results.deficits.k} kg`
              )}
              lang={lang}
            />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fill: 'hsl(var(--foreground))', fontSize: 14, fontFamily: 'DM Sans' }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar dataKey="deficit" stroke="hsl(164, 90%, 20%)" fill="hsl(164, 90%, 20%)" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {radarData.map(d => (
              <div key={d.nutrient} className="text-center">
                <p className="text-xs text-muted-foreground font-body">{d.nutrient}</p>
                <p className="text-sm font-semibold text-foreground font-body">{d.deficit} kg/ha</p>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Banner */}
        <div className="bg-primary rounded-3xl p-6 shadow-luxe relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-primary-foreground/80 font-body text-sm mb-1">
                💰 {t(lang, 'Saved vs Premium Blends', 'Jimat vs Baja Premium')}
              </p>
              <p className="text-3xl font-serif-display font-bold text-accent">
                RM {results.savings}
              </p>
            </div>
            <SpeakerButton
              text={t(lang, `You save RM ${results.savings} compared to premium blends`, `Anda jimat RM ${results.savings} berbanding baja premium`)}
              lang={lang}
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-card rounded-3xl p-6 shadow-luxe border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-display text-lg font-semibold text-brown-brand">
              {t(lang, 'Recommendations', 'Cadangan')}
            </h3>
            <SpeakerButton
              text={results.recommendations.map(r => `${r.name}, ${r.bags} ${t(lang, 'bags', 'beg')}, RM ${r.bags * r.price}`).join('. ')}
              lang={lang}
            />
          </div>
          <div className="space-y-3">
            {results.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">{rec.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{rec.bags} {t(lang, 'bags', 'beg')} × RM {rec.price}</p>
                </div>
                <p className="font-body font-bold text-primary text-base">RM {rec.bags * rec.price}</p>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-body font-semibold text-foreground">{t(lang, 'Total', 'Jumlah')}</span>
              <span className="font-body font-bold text-primary text-lg">
                RM {results.recommendations.reduce((sum, r) => sum + r.bags * r.price, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
