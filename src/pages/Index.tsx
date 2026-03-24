import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroLanding } from '@/components/HeroLanding';
import { SignUpPage } from '@/components/SignUpPage';
import { MyPlots, type Plot } from '@/components/MyPlots';
import { MainApp } from '@/components/MainApp';

type View = 'landing' | 'signup' | 'plots' | 'app';

const Index = () => {
  const [view, setView] = useState<View>('landing');
  const [userName, setUserName] = useState('');
  const [activePlot, setActivePlot] = useState<Plot | null>(null);
  const [lang, setLang] = useState<'en' | 'bm'>(() =>
    (localStorage.getItem('baja_lang') as 'en' | 'bm') || 'en'
  );

  useEffect(() => {
    const onboarded = localStorage.getItem('onboarding_complete');
    const savedName = localStorage.getItem('baja_user_name');
    if (onboarded === 'true' && savedName) {
      setUserName(savedName);
      setView('plots');
    }
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'bm' : 'en';
    setLang(next);
    localStorage.setItem('baja_lang', next);
  };

  const handleSignUpComplete = (data: { name: string; lang: 'en' | 'bm' }) => {
    localStorage.setItem('baja_user_name', data.name);
    localStorage.setItem('baja_lang', data.lang);
    localStorage.setItem('onboarding_complete', 'true');
    setUserName(data.name);
    setLang(data.lang);
    setView('plots');
  };

  const handleLogout = () => {
    localStorage.removeItem('baja_user_name');
    localStorage.removeItem('baja_profile');
    localStorage.removeItem('onboarding_complete');
    setUserName('');
    setActivePlot(null);
    setView('landing');
  };

  const handleAnalyse = (plot: Plot) => {
    setActivePlot(plot);
    setView('app');
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

      {view === 'plots' && (
        <MyPlots
          userName={userName}
          lang={lang}
          onToggleLang={toggleLang}
          onLogout={handleLogout}
          onAnalyse={handleAnalyse}
        />
      )}

      {view === 'app' && activePlot && (
        <MainApp
          profile={{
            name: userName,
            crop: activePlot.crop_type,
            farmSize: String(activePlot.farm_size_ha),
            lang,
          }}
          plotName={activePlot.name}
          soilType={activePlot.soil_type}
          onLogout={() => setView('plots')}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}
    </>
  );
};

export default Index;
