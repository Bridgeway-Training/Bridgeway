import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { prefersHighContrast, prefersReducedMotion } from '../../utils/prefers';

type PreferencesContextValue = {
  highContrast: boolean;
  reducedMotion: boolean;
  toggleHighContrast: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const updateContrast = () => setHighContrast(prefersHighContrast());
    const updateMotion = () => setReducedMotion(prefersReducedMotion());
    updateContrast();
    updateMotion();
    const contrastMedia = window.matchMedia('(prefers-contrast: more)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleContrast = () => updateContrast();
    const handleForced = () => updateContrast();
    const handleMotion = () => updateMotion();
    contrastMedia.addEventListener('change', handleContrast);
    forcedColors.addEventListener('change', handleForced);
    motionMedia.addEventListener('change', handleMotion);
    return () => {
      contrastMedia.removeEventListener('change', handleContrast);
      forcedColors.removeEventListener('change', handleForced);
      motionMedia.removeEventListener('change', handleMotion);
    };
  }, []);

  const value = useMemo(
    () => ({
      highContrast,
      reducedMotion,
      toggleHighContrast: () => setHighContrast((prev) => !prev)
    }),
    [highContrast, reducedMotion]
  );

  useEffect(() => {
    document.documentElement.dataset.highContrast = highContrast ? 'on' : 'off';
    document.documentElement.dataset.reducedMotion = reducedMotion ? 'on' : 'off';
  }, [highContrast, reducedMotion]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
};
