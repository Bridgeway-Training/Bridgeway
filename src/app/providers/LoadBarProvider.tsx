import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type LoadBarContextValue = {
  startTask: () => void;
  endTask: () => void;
  active: boolean;
};

const LoadBarContext = createContext<LoadBarContextValue | undefined>(undefined);

export const LoadBarProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const counter = useRef(0);

  const startTask = useCallback(() => {
    counter.current += 1;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setTimeout(() => {
      setActive(true);
    }, 800);
  }, []);

  const endTask = useCallback(() => {
    counter.current = Math.max(counter.current - 1, 0);
    if (counter.current === 0) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setActive(false);
    }
  }, []);

  const value = useMemo(() => ({ startTask, endTask, active }), [startTask, endTask, active]);

  return <LoadBarContext.Provider value={value}>{children}</LoadBarContext.Provider>;
};

export const useLoadBar = () => {
  const ctx = useContext(LoadBarContext);
  if (!ctx) {
    throw new Error('useLoadBar must be used within LoadBarProvider');
  }
  return ctx;
};
