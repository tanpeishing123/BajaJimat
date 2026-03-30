import { ArrowRight, ShieldCheck, BadgeDollarSign, BarChart3, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import heroBg from '@/assets/hero-bg-new.jpg';
import bgEmpower from '@/assets/bg-empower.jpg';
import bgFooter from '@/assets/bg-footer.jpg';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';

interface HeroLandingProps {
  lang: 'en' | 'bm';
  onGetStarted: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scrollReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const bentoBlocks = [
  {
    icon: BadgeDollarSign,
    title_en: '💰 Cut Farming Costs',
    title_bm: '💰 Jimat Kos Pertanian',
    desc_en: 'Calculate the exact nutrient blend your soil needs so you never overspend.',
    desc_bm: 'Kira campuran nutrien tepat yang tanah anda perlukan supaya tidak berbelanja lebih.',
  },
  {
    icon: ShieldCheck,
    title_en: '🛡️ Stop Chemical Runoff',
    title_bm: '🛡️ Hentikan Larian Kimia',
    desc_en: 'Time your spraying with live weather data to prevent washouts.',
    desc_bm: 'Selaraskan aplikasi dengan amaran cuaca langsung untuk mengelakkan baja mahal daripada hanyut ke saluran air.',
  },
  {
    icon: BarChart3,
    title_en: '🌱 Heal your Harvest',
    title_bm: '🌱 Pulihkan Tuaian Anda',
    desc_en: 'Instant disease identification and expert recovery steps.',
    desc_bm: 'Pengenalpastian penyakit segera dan langkah pemulihan pakar.',
  },
];

export function HeroLanding({ lang, onGetStarted }: HeroLandingProps) {
  const headerEn = 'Empowering Farmers. Securing Our Food.';
  const headerBm = 'Memperkasa Petani. Menjamin Makanan Kita.';
  const headerText = t(lang, headerEn, headerBm);
  const headerWords = headerText.split(' ');

  return (
    <div className="min-h-screen flex flex-col overflow-auto bg-background">
      {/* ── Hero Section — Full Immersive Centered ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src={heroBg}
          alt="Lush Malaysian paddy field at golden hour"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
        {/* Warm dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {/* Centered content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center pt-20">
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="font-display-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            {t(lang, 'Farm Smarter,', 'Bertani Lebih Bijak,')}
            <br />
            {t(lang, 'Harvest More', 'Tuai Lebih Banyak')}
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-6 font-body text-base sm:text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            {t(lang, 'Precision farming from soil to harvest.', 'Pertanian tepat dari tanah ke tuaian.')}
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 rounded-full font-body font-semibold text-base flex items-center gap-3
                bg-primary text-primary-foreground
                shadow-[0_0_30px_hsla(164,90%,20%,0.35)]
                hover:-translate-y-0.5 hover:shadow-[0_0_40px_hsla(164,90%,20%,0.5)]
                active:scale-[0.97] transition-all duration-300"
            >
              {t(lang, 'Get Started', 'Mulakan')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <div id="how-it-works">
        <HowItWorksSection lang={lang} onGetStarted={onGetStarted} />
      </div>

      {/* ── Why AgroMate — Bento Grid ── */}
      <section id="why-agromate" className="relative px-6 md:px-12 py-24 md:py-36 overflow-hidden" style={{ background: '#FAFAF8' }}>
        <img src={bgEmpower} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" loading="lazy" width={1920} height={1080} />
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-3">
              {t(lang, 'Why AgroMate', 'Kenapa AgroMate')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] text-foreground">
              {headerWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: (j: number) => ({
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    }),
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className={`inline-block mr-[0.3em] ${
                    word.includes('.') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {bentoBlocks.map((block, i) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={i}
                  variants={scrollReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: i * 0.15 }}
                  className="relative overflow-hidden rounded-2xl p-7 md:p-9 cursor-default
                    bg-white/40 backdrop-blur-lg border border-white/50
                    shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]
                    hover:-translate-y-2 hover:shadow-[0_16px_50px_-12px_hsla(164,60%,25%,0.18)]
                    transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-500">
                    <Icon size={26} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                    {t(lang, block.title_en, block.title_bm)}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {t(lang, block.desc_en, block.desc_bm)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact Us ── */}
      <ContactSection lang={lang} />

      {/* ── Footer ── */}
      <footer className="relative bg-primary px-6 py-10 text-center overflow-hidden">
        <img src={bgFooter} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" loading="lazy" width={1920} height={512} />
        <p className="relative z-10 text-primary-foreground/70 text-xs leading-relaxed max-w-md mx-auto">
          {t(lang,
            'Join thousands of Malaysian farmers already saving on fertiliser costs.',
            'Sertai ribuan petani Malaysia yang sudah jimat kos baja.'
          )}
        </p>
        <p className="relative z-10 text-[10px] text-primary-foreground/40 mt-3">
          © 2026 AgroMate · {t(lang, 'Built for Malaysian Farmers', 'Dibina untuk Petani Malaysia')} 🇲🇾
        </p>
      </footer>
    </div>
  );
}

/* ── Contact Section Component ── */
function ContactSection({ lang }: { lang: 'en' | 'bm' }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-50/60 via-stone-50 to-amber-50/40">
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-3">
            {t(lang, 'Get in Touch', 'Hubungi Kami')}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {t(lang, 'Contact Us', 'Hubungi Kami')}
          </h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="rounded-2xl p-8 md:p-10
            bg-white/60 backdrop-blur-xl border border-white/40
            shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-body font-semibold text-foreground mb-1.5">
                {t(lang, 'Name', 'Nama')}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl input-premium font-body text-sm text-foreground"
                placeholder={t(lang, 'Your name', 'Nama anda')}
              />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-foreground mb-1.5">
                {t(lang, 'Email', 'Emel')}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl input-premium font-body text-sm text-foreground"
                placeholder={t(lang, 'your@email.com', 'emel@anda.com')}
              />
            </div>
            <div>
              <label className="block text-sm font-body font-semibold text-foreground mb-1.5">
                {t(lang, 'Message', 'Mesej')}
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl input-premium font-body text-sm text-foreground resize-none"
                placeholder={t(lang, 'How can we help?', 'Bagaimana kami boleh membantu?')}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-3.5 rounded-xl btn-gradient-primary font-body font-bold text-base flex items-center justify-center gap-2"
          >
            {sent ? (
              t(lang, '✓ Message Sent!', '✓ Mesej Dihantar!')
            ) : (
              <>
                {t(lang, 'Send Message', 'Hantar Mesej')}
                <Send size={16} />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
