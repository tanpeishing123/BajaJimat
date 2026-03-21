import { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { MainApp } from '@/components/MainApp';

interface UserProfile {
  name: string;
  crop: string;
  farmSize: string;
  lang: 'en' | 'bm';
}

const Index = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('baja_profile');
    const onboarded = localStorage.getItem('onboarding_complete');
    if (saved && onboarded === 'true') {
      try { setProfile(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleOnboardingComplete = (data: UserProfile) => {
    localStorage.setItem('baja_profile', JSON.stringify(data));
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('baja_lang', data.lang);
    setProfile(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('baja_profile');
    localStorage.removeItem('onboarding_complete');
    setProfile(null);
  };

  if (!profile) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return <MainApp profile={profile} onLogout={handleLogout} />;
};

export default Index;
