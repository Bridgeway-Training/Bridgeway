import { ReactNode, createContext, useContext } from 'react';

type StickyContextValue = {
  supportsSticky: boolean;
};

const StickyContext = createContext<StickyContextValue | undefined>(undefined);

export const StickyProvider = ({ children, value }: { children: ReactNode; value: StickyContextValue }) => (
  <StickyContext.Provider value={value}>{children}</StickyContext.Provider>
);

export const useStickySupport = () => {
  const ctx = useContext(StickyContext);
  if (!ctx) {
    throw new Error('useStickySupport must be used within StickyProvider');
  }
  return ctx;
};
