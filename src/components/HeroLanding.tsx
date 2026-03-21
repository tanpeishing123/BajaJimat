import { ArrowRight, Leaf, BarChart3, Coins } from 'lucide-react';
import heroImg from '@/assets/hero-farm-wide.jpg';
import leafSketch from '@/assets/leaf-sketch.png';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  return (
    <div className="min-h-screen bg-cream-brand relative overflow-hidden">
      {/* Decorative leaf */}
      <img
        src={leafSketch}
        alt=""
        className="absolute top-32 right-12 w-56 opacity-[0.06] pointer-events-none animate-float"
      />
      <img
        src={leafSketch}
        alt=""
        className="absolute bottom-24 left-8 w-36 opacity-[0.04] rotate-[200deg] pointer-events-none animate-float"
        style={{ animationDelay: '4s' }}
      />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="animate-in fade-in slide-in-from-left-6 duration-700">
            <span className="text-gold-brand font-body font-semibold text-sm uppercase tracking-widest">
              {t(lang, 'Smart Agriculture', 'Pertanian Pintar')}
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-serif-display font-bold text-brown-brand leading-[1.1] tracking-tight">
              {t(lang, 'Precision Fertilizer,', 'Baja Tepat,')}
              <br />
              <span className="text-emerald-brand">
                {t(lang, 'Maximum Savings', 'Jimat Maksimum')}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground font-body leading-relaxed max-w-lg">
              {t(lang,
                'Empowering Malaysian farmers with AI-driven nutrient analysis. Optimize your fertilizer usage, reduce waste, and save up to 40% on input costs.',
                'Memperkasakan petani Malaysia dengan analisis nutrien berteraskan AI. Optimumkan penggunaan baja anda, kurangkan pembaziran, dan jimat sehingga 40% kos input.'
              )}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-body font-semibold text-base flex items-center gap-2 shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Get Started Free', 'Mulakan Percuma')}
                <ArrowRight size={18} />
              </button>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl font-body font-medium text-base text-foreground border-2 border-border hover:border-primary/40 transition-all duration-200 active:scale-[0.97]"
              >
                {t(lang, 'Learn More', 'Ketahui Lagi')}
              </button>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="animate-in fade-in slide-in-from-right-6 duration-700 delay-200 relative">
            <div className="rounded-3xl overflow-hidden shadow-luxe-hover">
              <img
                src={heroImg}
                alt="Malaysian palm oil plantation at sunrise"
                className="w-full h-[420px] object-cover"
              />
            </div>
            {/* Overlapping stat card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-5 shadow-luxe border border-border animate-in fade-in zoom-in-95 duration-500 delay-500">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">{t(lang, 'Average Savings', 'Purata Penjimatan')}</p>
              <p className="text-2xl font-serif-display font-bold text-gold-brand mt-1">RM 847</p>
              <p className="text-xs text-muted-foreground font-body">{t(lang, 'per hectare/season', 'sehektar/musim')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wavy divider */}
      <div className="relative h-24 -mt-4">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,50 1440,40 L1440,120 L0,120 Z"
            fill="hsl(var(--beige))"
          />
        </svg>
      </div>

      {/* Features Section */}
      <section className="bg-beige-brand py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-600">
            <span className="text-gold-brand font-body font-semibold text-sm uppercase tracking-widest">
              {t(lang, 'How It Works', 'Cara Ia Berfungsi')}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif-display font-bold text-brown-brand">
              {t(lang, 'Three Simple Steps', 'Tiga Langkah Mudah')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf size={28} className="text-primary" />,
                title: t(lang, 'Test Your Soil', 'Uji Tanah Anda'),
                desc: t(lang, 'Use a rapid test kit or upload your soil report. Our system reads the colors and interprets the results.', 'Gunakan kit ujian pantas atau muat naik laporan tanah. Sistem kami membaca warna dan mentafsir keputusan.'),
              },
              {
                icon: <BarChart3 size={28} className="text-primary" />,
                title: t(lang, 'AI Analysis', 'Analisis AI'),
                desc: t(lang, 'Our optimizer calculates exact nutrient deficits and finds the cheapest fertilizer combination available locally.', 'Pengoptimum kami mengira kekurangan nutrien tepat dan mencari kombinasi baja termurah yang terdapat tempatan.'),
              },
              {
                icon: <Coins size={28} className="text-primary" />,
                title: t(lang, 'Save Money', 'Jimat Wang'),
                desc: t(lang, 'Get a precise shopping list with bags and costs. Most farmers save RM 500-1,200 per hectare per season.', 'Dapatkan senarai belian tepat dengan beg dan kos. Kebanyakan petani jimat RM 500-1,200 sehektar semusim.'),
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-card rounded-3xl p-8 shadow-luxe border border-border hover:shadow-luxe-hover transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5">
                  {feat.icon}
                </div>
                <h3 className="font-serif-display text-xl font-semibold text-brown-brand mb-3">{feat.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second wavy divider */}
      <div className="relative h-24">
        <svg viewBox="0 0 1440 120" className="absolute top-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,80 C480,20 960,100 1440,60 L1440,0 L0,0 Z"
            fill="hsl(var(--beige))"
          />
        </svg>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center animate-in fade-in duration-600">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif-display font-bold text-brown-brand mb-4">
            {t(lang, 'Ready to Optimize?', 'Sedia untuk Mengoptimumkan?')}
          </h2>
          <p className="text-muted-foreground font-body text-lg mb-8">
            {t(lang, 'Join thousands of Malaysian farmers already saving on fertilizer costs.', 'Sertai ribuan petani Malaysia yang sudah jimat kos baja.')}
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-body font-semibold text-lg flex items-center gap-2 mx-auto shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
          >
            {t(lang, 'Start Now — It\'s Free', 'Mulakan Sekarang — Percuma')}
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-body">© 2026 BajaJimat. {t(lang, 'All rights reserved.', 'Hak cipta terpelihara.')}</p>
          <p className="text-sm text-muted-foreground font-body">{t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾</p>
        </div>
      </footer>
    </div>
  );
}
