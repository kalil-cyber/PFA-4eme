import { useCallback, useEffect, useState } from 'react';

function stripForSpeech(text) {
  return (text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[_*`]/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600);
}

export function useTarikiSpeech(enabled) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    const loadVoices = () => window.speechSynthesis?.getVoices();
    loadVoices();
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!enabled || !supported || !text?.trim()) return;
      stop();
      const utterance = new SpeechSynthesisUtterance(stripForSpeech(text));
      utterance.lang = 'fr-FR';
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const fr =
        voices.find((v) => v.lang === 'fr-FR') ||
        voices.find((v) => v.lang.startsWith('fr'));
      if (fr) utterance.voice = fr;
      window.speechSynthesis.speak(utterance);
    },
    [enabled, supported, stop]
  );

  return { speak, stop, supported };
}
