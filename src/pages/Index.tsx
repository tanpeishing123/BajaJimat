import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroLanding } from '@/components/HeroLanding';
import { SignUpPage } from '@/components/SignUpPage';
import { MainApp } from '@/components/MainApp';

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

type View = 'landing' | 'signup' | 'app';

const Index = () => {
  const [view, setView] = useState<View>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<'en' | 'bm'>(() =>
    (localStorage.getItem('baja_lang') as 'en' | 'bm') || 'en'
  );

  useEffect(() => {
    const saved = localStorage.getItem('baja_profile');
    const onboarded = localStorage.getItem('onboarding_complete');
    if (saved && onboarded === 'true') {
      try {
        setProfile(JSON.parse(saved));
        setView('app');
      } catch {}
    }
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'bm' : 'en';
    setLang(next);
    localStorage.setItem('baja_lang', next);
  };

  const handleSignUpComplete = (data: UserProfile) => {
    const profileWithLang = { ...data, lang: data.lang };
    localStorage.setItem('baja_profile', JSON.stringify(profileWithLang));
    localStorage.setItem('baja_lang', data.lang);
    localStorage.setItem('onboarding_complete', 'true');
    setProfile(profileWithLang);
    setLang(data.lang);
    setView('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('baja_profile');
    localStorage.removeItem('onboarding_complete');
    setProfile(null);
    setView('landing');
  };

  return (
    <>
      {view === 'landing' && (
        <>
          <Navbar
            lang={lang}
            onToggleLang={toggleLang}
            onSignup={() => setView('signup')}
          />
          <HeroLanding lang={lang} onGetStarted={() => setView('signup')} />
        </>
      )}

      {view === 'signup' && (
        <SignUpPage
          lang={lang}
          onComplete={handleSignUpComplete}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'app' && profile && (
        <MainApp profile={profile} onLogout={handleLogout} lang={lang} onToggleLang={toggleLang} />
      )}
    </>
  );
};

export default Index;
