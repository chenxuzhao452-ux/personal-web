'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Lang, TranslationKey } from '@/i18n/translations';
import { DICT } from '@/i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  const stored = localStorage.getItem('lang');
  if (stored === 'en' || stored === 'zh' || stored === 'ja' || stored === 'tw') return stored;
  return 'zh';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  useEffect(() => {
    setLangState(getStoredLang());
  }, []);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem('lang', next);
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return DICT[lang][key] ?? DICT.en[key] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
}
