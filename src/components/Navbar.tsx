import { Sprout, Globe } from 'lucide-react';

interface NavbarProps {
  lang: 'en' | 'bm';
  onToggleLang: () => void;
  onSignup?: () => void;
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => (lang === 'bm' ? bm : en);

export function Navbar({ lang, onToggleLang, onSignup }: NavbarProps) {
  const navLinks = [
    { label: t(lang, 'How it Works', 'Cara Guna'), href: '#how-it-works' },
    { label: t(lang, 'Why AgroMate', 'Kenapa AgroMate'), href: '#why-agromate' },
    { label: t(lang, 'Contact Us', 'Hubungi Kami'), href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Sprout className="text-primary-foreground" size={18} />
          </div>
          <span className="font-body text-lg font-bold text-white tracking-tight">
            AgroMate
          </span>
        </div>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-body text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-sm font-body font-medium text-white/90 hover:text-white hover:border-white/60 transition-all duration-200 active:scale-95"
          >
            <Globe size={14} />
            {lang === 'en' ? 'BM' : 'EN'}
          </button>

          {onSignup && (
            <button
              onClick={onSignup}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity duration-200"
            >
              {t(lang, 'Get Started', 'Mulakan')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
