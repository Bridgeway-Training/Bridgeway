import { useEffect, useRef, useState } from 'react';
import { useModal } from '../../app/providers/ModalProvider';
import { useI18n } from '../../app/providers/I18nProvider';
import './FabQuickActions.css';

type FabState = 'closed' | 'open';

export const FabQuickActions = () => {
  const { openFreeClass, isFreeClassOpen } = useModal();
  const { t } = useI18n();
  const [state, setState] = useState<FabState>('closed');
  const [visible, setVisible] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFreeClassOpen) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [isFreeClassOpen]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const handler = () => {
      if (viewport.height < window.innerHeight * 0.7) {
        setVisible(false);
      } else if (!isFreeClassOpen) {
        setVisible(true);
      }
    };
    viewport.addEventListener('resize', handler);
    return () => viewport.removeEventListener('resize', handler);
  }, [isFreeClassOpen]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setState('closed');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      className="fab-wrapper"
      data-open={state === 'open'}
      aria-hidden={!visible}
      ref={menuRef}
      data-testid="fab-quick-actions"
    >
      <button
        type="button"
        className="fab-main"
        data-testid="fab-main"
        aria-expanded={state === 'open'}
        onClick={() => {
          setState((prev) => (prev === 'open' ? 'closed' : 'open'));
          if ('vibrate' in navigator) {
            navigator.vibrate?.(20);
          }
        }}
      >
        {t('fab.label')}
      </button>
      <div className="fab-menu" role="menu">
        <button
          type="button"
          role="menuitem"
          data-testid="fab-free-class"
          onClick={(event) => {
            openFreeClass(event.currentTarget);
            setState('closed');
          }}
        >
          {t('navigation.freeClass')}
        </button>
        <button
          type="button"
          role="menuitem"
          data-testid="fab-test"
          onClick={() => console.info('Navigate to placement test')}
        >
          {t('fab.test')}
        </button>
        <button
          type="button"
          role="menuitem"
          data-testid="fab-whatsapp"
          onClick={() => console.info('Open WhatsApp contact flow')}
        >
          {t('fab.contact')} · {t('fab.whatsapp')}
        </button>
        <button
          type="button"
          role="menuitem"
          data-testid="fab-telegram"
          onClick={() => console.info('Open Telegram contact flow')}
        >
          {t('fab.contact')} · {t('fab.telegram')}
        </button>
      </div>
    </div>
  );
};
