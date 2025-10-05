import { ReactNode } from 'react';
import { I18nProvider } from './I18nProvider';
import { LoadBarProvider } from './LoadBarProvider';
import { PersistenceProvider } from './PersistenceProvider';
import { PreferencesProvider } from './PreferencesProvider';
import { StickyProvider } from './StickyContext';
import { ModalProvider } from './ModalProvider';

type AppProvidersProps = {
  children: ReactNode;
  stickyValue: { supportsSticky: boolean };
};

export const AppProviders = ({ children, stickyValue }: AppProvidersProps) => (
  <StickyProvider value={stickyValue}>
    <PreferencesProvider>
      <LoadBarProvider>
        <PersistenceProvider>
          <ModalProvider>
            <I18nProvider>{children}</I18nProvider>
          </ModalProvider>
        </PersistenceProvider>
      </LoadBarProvider>
    </PreferencesProvider>
  </StickyProvider>
);
