import { Sprout, Globe, ChevronDown } from 'lucide-react';

interface NavbarProps {
  lang: 'en' | 'bm';
  onToggleLang: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  showAuth?: boolean;
}

export function Navbar({ lang, onToggleLang, onLogin, onSignup, showAuth = true }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-luxe">
            <Sprout className="text-primary-foreground" size={20} />
          </div>
          <span className="font-serif-display text-xl font-bold text-white tracking-tight drop-shadow-md">
            BajaJimat
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-sm font-body font-medium text-white/90 hover:text-white hover:border-white/60 transition-all duration-200 active:scale-95"
          >
            <Globe size={14} />
            {lang === 'en' ? 'BM' : 'EN'}
          </button>

          {showAuth && (
            <>
              <button
                onClick={onLogin}
                className="px-5 py-2 rounded-full font-body font-medium text-sm text-white/90 hover:text-white transition-colors duration-200"
              >
                {lang === 'en' ? 'Log In' : 'Log Masuk'}
              </button>
              <button
                onClick={onSignup}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm shadow-luxe hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
              >
                {lang === 'en' ? 'Sign Up' : 'Daftar'}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
