import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { AppProviders } from './app/providers/AppProviders';
import './styles/variables.css';
import './styles/a11y.css';

const Root = () => {
  const [supportsSticky, setSupportsSticky] = useState(true);

  useEffect(() => {
    try {
      const testEl = document.createElement('div');
      testEl.style.cssText = 'position: sticky; top: 0;';
      document.body.appendChild(testEl);
      const computed = getComputedStyle(testEl).position;
      setSupportsSticky(computed === 'sticky');
      document.body.removeChild(testEl);
    } catch (error) {
      console.warn('Sticky detection failed, falling back to FAB menu.', error);
      setSupportsSticky(false);
    }
  }, []);

  const value = useMemo(() => ({ supportsSticky }), [supportsSticky]);

  return (
    <StrictMode>
      <BrowserRouter>
        <AppProviders stickyValue={value}>
          <App />
        </AppProviders>
      </BrowserRouter>
    </StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing.');
}
createRoot(container).render(<Root />);
