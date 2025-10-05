import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../../i18n/en.json';
import ro from '../../i18n/ro.json';
import ru from '../../i18n/ru.json';
import { safeStorage } from '../../utils/storageSafe';

type Language = 'en' | 'ro' | 'ru';

const translationsMap: Record<Language, typeof en> = { en, ro, ru } as const;

type State = {
  language: Language;
  messages: typeof en;
};

const initialState: State = {
  language: 'en',
  messages: en
};

type Action = { type: 'SET_LANGUAGE'; language: Language; messages: typeof en };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.language, messages: action.messages };
    default:
      return state;
  }
};

const storageKey = 'language';

const detectLanguage = (): Language => {
  const stored = safeStorage.get(storageKey);
  if (stored === 'en' || stored === 'ro' || stored === 'ru') {
    return stored;
  }
  const navLang = navigator.language.slice(0, 2).toLowerCase();
  if (navLang === 'ro' || navLang === 'ru') {
    return navLang;
  }
  return 'en';
};

type I18nContextValue = {
  language: Language;
  messages: typeof en;
  setLanguage: (lang: Language) => void;
  t: (path: string, replacements?: Record<string, string | number>) => string;
  toLocalizedPath: (path: string, targetLang?: Language) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const detected = detectLanguage();
    updateLanguage(detected, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLanguage = useCallback(
    (lang: Language, pushHistory = true) => {
      const messages = translationsMap[lang] ?? en;
      if (!translationsMap[lang]) {
        console.warn(`Missing translations for ${lang}; falling back to EN.`);
      }
      dispatch({ type: 'SET_LANGUAGE', language: lang, messages });
      safeStorage.set(storageKey, lang);
      const parts = location.pathname.split('/').filter(Boolean);
      const rest = parts.slice(1).join('/');
      const path = rest ? `/${lang}/${rest}` : `/${lang}/`;
      if (pushHistory && location.pathname !== path) {
        navigate(path + location.search + location.hash, { replace: true });
      }
      document.documentElement.lang = lang;
    },
    [location.pathname, location.search, location.hash, navigate]
  );

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const maybeLang = parts[0];
    if (maybeLang === 'en' || maybeLang === 'ro' || maybeLang === 'ru') {
      updateLanguage(maybeLang, false);
    }
  }, [location.pathname, updateLanguage]);

  const t = useCallback(
    (path: string, replacements: Record<string, string | number> = {}) => {
      const segments = path.split('.');
      let value: any = state.messages;
      for (const key of segments) {
        value = value?.[key];
      }
      if (typeof value !== 'string') {
        console.warn(`Missing translation for path ${path}`);
        value = segments[segments.length - 1];
      }
      return Object.entries(replacements).reduce(
        (acc, [key, replacement]) => acc.replace(`{{${key}}}`, String(replacement)),
        value
      );
    },
    [state.messages]
  );

  const toLocalizedPath = useCallback(
    (path: string, targetLang?: Language) => {
      const lang = targetLang ?? state.language;
      const cleaned = path.startsWith('/') ? path.slice(1) : path;
      return `/${lang}/${cleaned}`.replace(/\/+$/, '/') || `/${lang}/`;
    },
    [state.language]
  );

  const contextValue = useMemo(
    () => ({
      language: state.language,
      messages: state.messages,
      setLanguage: (lang: Language) => updateLanguage(lang, true),
      t,
      toLocalizedPath
    }),
    [state.language, state.messages, updateLanguage, t, toLocalizedPath]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};
