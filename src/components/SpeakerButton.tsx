import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';

interface SpeakerButtonProps {
  text: string;
  lang: 'en' | 'bm';
  size?: 'sm' | 'md';
}

export function SpeakerButton({ text, lang, size = 'sm' }: SpeakerButtonProps) {
  const { speak, stop, isSpeaking } = useSpeech(lang);

  const px = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 14 : 18;

  return (
    <button
      onClick={() => isSpeaking ? stop() : speak(text)}
      className={`${px} rounded-full border-2 border-primary flex items-center justify-center transition-all duration-200 hover:bg-primary/10 active:scale-95 ${isSpeaking ? 'animate-pulse-ring bg-primary/5' : ''}`}
      aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
      type="button"
    >
      {isSpeaking ? (
        <VolumeX size={iconSize} className="text-primary" />
      ) : (
        <Volume2 size={iconSize} className="text-primary" />
      )}
    </button>
  );
}
