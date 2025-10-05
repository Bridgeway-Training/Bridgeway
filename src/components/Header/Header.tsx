import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';
import { useModal } from '../../app/providers/ModalProvider';
import { useStickySupport } from '../../app/providers/StickyContext';
import { cls } from '../../utils/cls';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import './Header.css';

export const Header = () => {
  const { t, toLocalizedPath } = useI18n();
  const { openFreeClass } = useModal();
  const { supportsSticky } = useStickySupport();
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [showFallbackFab, setShowFallbackFab] = useState(false);

  useEffect(() => {
    if (!supportsSticky) {
      setShowFallbackFab(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFallbackFab(!entry.isIntersecting);
      },
      { threshold: [1] }
    );
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return () => observer.disconnect();
  }, [supportsSticky]);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname.endsWith('/')) {
      event.preventDefault();
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={headerRef}
      className={cls('app-header', supportsSticky ? 'sticky' : 'fallback')}
      data-testid="app-header"
    >
      <div className="header-inner">
        <Link
          to={toLocalizedPath('/')}
          onClick={handleLogoClick}
          className="logo"
          data-testid="logo"
        >
          Bridgeway
        </Link>
        <DesktopMenu onOpenFreeClass={openFreeClass} />
        <LanguageSwitcher />
        <button
          type="button"
          className="cta"
          data-testid="cta-header"
          onClick={(event) => openFreeClass(event.currentTarget)}
        >
          {t('navigation.freeClass')}
        </button>
        <MobileMenu onOpenFreeClass={openFreeClass} />
      </div>
      {showFallbackFab && (
        <button
          type="button"
          className="menu-fab"
          data-testid="menu-fab"
          aria-label={t('navigation.menu')}
          onClick={() => document.getElementById('mobile-menu-toggle')?.click()}
        >
          ☰
        </button>
      )}
    </header>
  );
};
