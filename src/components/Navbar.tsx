import { Sprout, Globe } from 'lucide-react';

interface NavbarProps {
  lang: 'en' | 'bm';
  onToggleLang: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  showAuth?: boolean;
}

export function Navbar({ lang, onToggleLang, onLogin, onSignup, showAuth = true }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-luxe">
            <Sprout className="text-primary-foreground" size={20} />
          </div>
          <span className="font-serif-display text-xl font-bold text-brown-brand tracking-tight">
            BajaJimat
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-body font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-95"
          >
            <Globe size={14} />
            {lang === 'en' ? 'BM' : 'EN'}
          </button>

          {showAuth && (
            <>
              <button
                onClick={onLogin}
                className="px-5 py-2 rounded-full font-body font-medium text-sm text-foreground hover:text-primary transition-colors duration-200"
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
