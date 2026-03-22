import { Sprout, Globe } from 'lucide-react';

interface NavbarProps {
  lang: 'en' | 'bm';
  onToggleLang: () => void;
  onSignup?: () => void;
}

export function Navbar({ lang, onToggleLang, onSignup }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-6 md:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-luxe">
            <Sprout className="text-primary-foreground" size={20} />
          </div>
          <span className="font-serif-display text-xl font-bold text-white tracking-tight drop-shadow-md">
            BajaJimat
          </span>
        </div>

        <div className="flex items-center gap-3">
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
              className="px-5 py-2 rounded-full btn-gradient-primary font-body font-semibold text-sm"
            >
              {lang === 'en' ? 'Get Started' : 'Mulakan'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
