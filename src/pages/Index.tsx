import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroLanding } from '@/components/HeroLanding';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { MainApp } from '@/components/MainApp';

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

type View = 'landing' | 'onboarding' | 'app';

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

  const handleOnboardingComplete = (data: UserProfile) => {
    const profileWithLang = { ...data, lang };
    localStorage.setItem('baja_profile', JSON.stringify(profileWithLang));
    localStorage.setItem('onboarding_complete', 'true');
    setProfile(profileWithLang);
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
      {view !== 'app' && (
        <Navbar
          lang={lang}
          onToggleLang={toggleLang}
          onLogin={() => setView('onboarding')}
          onSignup={() => setView('onboarding')}
          showAuth={view === 'landing'}
        />
      )}

      {view === 'landing' && (
        <HeroLanding lang={lang} onGetStarted={() => setView('onboarding')} />
      )}

      {view === 'onboarding' && (
        <OnboardingScreen lang={lang} onComplete={handleOnboardingComplete} onBack={() => setView('landing')} />
      )}

      {view === 'app' && profile && (
        <MainApp profile={profile} onLogout={handleLogout} lang={lang} onToggleLang={toggleLang} />
      )}
    </>
  );
};

export default Index;
