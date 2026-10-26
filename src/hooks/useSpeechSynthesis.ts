import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserProfile } from '../types/profile';

export interface UseSpeechSynthesisResult {
  supported: boolean;
  speaking: boolean;
  speak: (text: string, onEnd?: () => void) => void;
  speakArabic: (arabicText: string, fallbackText: string, onEnd?: () => void) => void;
  cancel: () => void;
}

interface VoicePrefs { gender: 'male' | 'female' | null; age: number | null; pitch: number; rate: number; }

function pickVoice(voices: SpeechSynthesisVoice[], gender: 'male' | 'female' | null, language: 'ar' | 'en'): SpeechSynthesisVoice | undefined {
  const languageVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(language));
  if (languageVoices.length === 0) return language === 'ar' ? undefined : voices[0];
  if (language === 'ar') return languageVoices.find((voice) => /arabic|ar-|arabic|maged|tarik|laila|naayf/i.test(`${voice.name} ${voice.lang}`)) ?? languageVoices[0];
  const femaleHints = ['samantha', 'victoria', 'karen', 'susan', 'zira', 'google uk english female', 'google us english', 'fiona', 'moira', 'tessa', 'serena', 'female', 'woman', 'aria', 'jenny', 'michelle', 'clara', 'amelie', 'ellen'];
  const maleHints = ['daniel', 'mark', 'david', 'alex', 'arthur', 'james', 'fred', 'george', 'rishi', 'brian', 'male', 'man', 'guy', 'aaron', 'tom', 'google uk english male', 'oliver'];
  const hints = gender === 'female' ? femaleHints : gender === 'male' ? maleHints : [];
  return hints.map((hint) => languageVoices.find((voice) => voice.name.toLowerCase().includes(hint))).find(Boolean) ?? languageVoices[0];
}

function containsArabic(text: string): boolean { return /[\u0600-\u06ff]/.test(text); }

export function useSpeechSynthesis(profile?: UserProfile | null): UseSpeechSynthesisResult {
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prefsRef = useRef<VoicePrefs>({ gender: null, age: null, pitch: 1, rate: 0.95 });

  useEffect(() => {
    if (profile) {
      const isYoung = profile.age != null && profile.age <= 18;
      prefsRef.current = { gender: profile.gender, age: profile.age, pitch: profile.gender === 'female' ? (isYoung ? 1.25 : 1.12) : (isYoung ? 1.08 : 0.85), rate: isYoung ? 0.88 : 0.75 };
    }
  }, [profile]);

  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const language = containsArabic(text) ? 'ar' : 'en';
    const utterance = new SpeechSynthesisUtterance(text);
    const prefs = prefsRef.current;
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = language === 'ar' ? Math.min(prefs.rate + 0.1, 0.9) : prefs.rate;
    utterance.pitch = language === 'ar' ? 1 : prefs.pitch;
    utterance.volume = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const preferred = pickVoice(voices, prefs.gender, language);
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => { setSpeaking(false); onEnd?.(); };
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const speakArabic = useCallback((arabicText: string, fallbackText: string, onEnd?: () => void) => {
    const arabicVoice = pickVoice(window.speechSynthesis.getVoices(), prefsRef.current.gender, 'ar');
    if (arabicVoice) { speak(arabicText, onEnd); return; }
    speak(fallbackText, onEnd);
  }, [speak]);

  useEffect(() => () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  return { supported, speaking, speak, speakArabic, cancel };
}
