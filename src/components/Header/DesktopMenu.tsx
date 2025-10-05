import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';
import { useLoadBar } from '../../app/providers/LoadBarProvider';
import { prefersEffectiveTypeSlow, prefersSaveData } from '../../utils/prefers';

type DesktopMenuProps = {
  onOpenFreeClass: (origin?: HTMLElement | null) => void;
};

type SubmenuKey = 'programs' | 'resources';

const menuConfig: Record<SubmenuKey, { path: string; items: { key: string; path: string }[] }> = {
  programs: {
    path: 'programas',
    items: [
      { key: 'generalEnglish', path: 'programas/ingles-general' },
      { key: 'businessEnglish', path: 'programas/business-english' },
      { key: 'youngLearners', path: 'programas/jovenes-y-ninos' },
      { key: 'examPrep', path: 'programas/examenes' }
    ]
  },
  resources: {
    path: 'recursos',
    items: [
      { key: 'blog', path: 'recursos/blog' },
      { key: 'placement', path: 'recursos/test-nivel' },
      { key: 'guides', path: 'recursos/guias' },
      { key: 'tips', path: 'recursos/consejos' }
    ]
  }
};

export const DesktopMenu = ({ onOpenFreeClass }: DesktopMenuProps) => {
  const { t, toLocalizedPath } = useI18n();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<SubmenuKey | null>(null);
  const menuRefs = useRef<Record<SubmenuKey, HTMLButtonElement | null>>({ programs: null, resources: null });
  const panelRefs = useRef<Record<SubmenuKey, HTMLDivElement | null>>({ programs: null, resources: null });
  const { startTask, endTask } = useLoadBar();

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        const activeTrigger = menuRefs.current[openMenu ?? 'programs'];
        activeTrigger?.focus();
      }
    };
    document.addEventListener('keydown', closeMenu);
    return () => document.removeEventListener('keydown', closeMenu);
  }, [openMenu]);

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  const handlePointer = (key: SubmenuKey) => setOpenMenu(key);
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>, key: SubmenuKey) => {
    if (!panelRefs.current[key]?.contains(event.relatedTarget as Node)) {
      setOpenMenu((prev) => (prev === key ? null : prev));
    }
  };

  const prefetchLink = (path: string) => {
    if (prefersSaveData() || prefersEffectiveTypeSlow()) return;
    const href = toLocalizedPath(path);
    if (document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
      return;
    }
    startTask();
    const preload = document.createElement('link');
    preload.rel = 'prefetch';
    preload.href = href;
    preload.as = 'document';
    preload.onload = () => endTask();
    preload.onerror = () => endTask();
    document.head.appendChild(preload);
  };

  return (
    <nav className="desktop-menu" aria-label="Primary" data-testid="desktop-menu">
      <ul>
        {(Object.keys(menuConfig) as SubmenuKey[]).map((key) => {
          const config = menuConfig[key];
          const isOpen = openMenu === key;
          const panelId = `${key}-panel`;
          return (
            <li key={key} className="has-submenu">
              <button
                type="button"
                data-testid={`menu-${key}-trigger`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onMouseEnter={() => handlePointer(key)}
                onFocus={() => handlePointer(key)}
                onClick={() => setOpenMenu(isOpen ? null : key)}
                ref={(ref) => {
                  menuRefs.current[key] = ref;
                }}
              >
                {t(`navigation.${key}`)}
              </button>
              <div
                id={panelId}
                role="menu"
                data-open={isOpen}
                className="submenu"
                ref={(ref) => {
                  panelRefs.current[key] = ref;
                }}
                onMouseLeave={() => setOpenMenu((prev) => (prev === key ? null : prev))}
                onBlur={(event) => handleBlur(event, key)}
              >
                <Link
                  to={toLocalizedPath(config.path)}
                  className="submenu-index"
                  data-testid={`menu-${key}-index`}
                >
                  {t(`navigation.${key}`)}
                </Link>
                <ul>
                  {config.items.map((item, index) => (
                    <li key={item.key}>
                      <Link
                        to={toLocalizedPath(item.path)}
                        role="menuitem"
                        data-testid={`menu-${key}-${index}`}
                        onFocus={() => prefetchLink(item.path)}
                        onMouseEnter={() => prefetchLink(item.path)}
                      >
                        {t(
                          key === 'programs'
                            ? `navigation.programItems.${item.key}`
                            : `navigation.resourceItems.${item.key}`
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
        <li>
          <Link
            to={toLocalizedPath('metodologia')}
            data-testid="menu-methodology"
            aria-current={location.pathname.includes('metodologia') ? 'page' : undefined}
          >
            {t('navigation.methodology')}
          </Link>
        </li>
        <li>
          <Link
            to={toLocalizedPath('profesores')}
            data-testid="menu-teachers"
            aria-current={location.pathname.includes('profesores') ? 'page' : undefined}
          >
            {t('navigation.teachers')}
          </Link>
        </li>
        <li>
          <Link
            to={toLocalizedPath('precios')}
            data-testid="menu-pricing"
            aria-current={location.pathname.includes('precios') ? 'page' : undefined}
          >
            {t('navigation.pricing')}
          </Link>
        </li>
        <li className="resources-link">
          <Link
            to={toLocalizedPath('recursos')}
            data-testid="menu-resources"
            aria-current={location.pathname.includes('recursos') ? 'page' : undefined}
          >
            {t('navigation.resources')}
          </Link>
        </li>
      </ul>
    </nav>
  );
};
