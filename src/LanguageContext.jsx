/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TRANSLATIONS } from './i18n';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'ee_lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'en';
  });

  useEffect(() => {
    const dir = TRANSLATIONS[lang].dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggle = useCallback(() => setLang(l => (l === 'en' ? 'ar' : 'en')), []);

  const value = {
    lang,
    setLang,
    toggle,
    t: TRANSLATIONS[lang],
    dir: TRANSLATIONS[lang].dir,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
