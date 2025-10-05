import { ReactNode, createContext, useCallback, useContext, useRef, useState } from 'react';

type ModalContextValue = {
  isFreeClassOpen: boolean;
  openFreeClass: (origin?: HTMLElement | null) => void;
  closeFreeClass: () => void;
  originRef: React.MutableRefObject<HTMLElement | null>;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isFreeClassOpen, setIsFreeClassOpen] = useState(false);
  const originRef = useRef<HTMLElement | null>(null);

  const openFreeClass = useCallback((origin?: HTMLElement | null) => {
    if (origin) {
      originRef.current = origin;
    }
    setIsFreeClassOpen(true);
  }, []);

  const closeFreeClass = useCallback(() => {
    setIsFreeClassOpen(false);
    originRef.current?.focus();
  }, []);

  return (
    <ModalContext.Provider value={{ isFreeClassOpen, openFreeClass, closeFreeClass, originRef }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return ctx;
};
