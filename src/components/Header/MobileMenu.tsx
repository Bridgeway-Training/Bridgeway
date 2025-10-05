import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';
import { cls } from '../../utils/cls';
import { createFocusTrap } from '../../utils/focusTrap';

type MobileMenuProps = {
  onOpenFreeClass: (origin?: HTMLElement | null) => void;
};

export const MobileMenu = ({ onOpenFreeClass }: MobileMenuProps) => {
  const { t, toLocalizedPath } = useI18n();
  const [open, setOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusTrap = useRef(createFocusTrap(dialogRef));
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (open) {
      focusTrap.current.activate();
      document.body.style.overflow = 'hidden';
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollBarWidth > 0 ? `${scrollBarWidth}px` : '';
    } else {
      focusTrap.current.deactivate();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setProgramsOpen(true);
        setResourcesOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setOpen(false);
        setProgramsOpen(true);
        setResourcesOpen(false);
        toggleRef.current?.focus();
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        type="button"
        id="mobile-menu-toggle"
        data-testid="mobile-menu-toggle"
        className="mobile-menu-button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={(event) => {
          setOpen((prev) => !prev);
          toggleRef.current = event.currentTarget;
        }}
      >
        ☰
      </button>
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className={cls('mobile-menu-wrapper', open ? 'open' : 'closed')}
        ref={dialogRef}
        data-testid="mobile-menu"
      >
        <h2 id="mobile-menu-title">{t('navigation.menu')}</h2>
        <nav>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => setProgramsOpen((prev) => !prev)}
                aria-expanded={programsOpen}
                data-testid="mobile-programs-toggle"
              >
                {t('navigation.programs')}
              </button>
              <ul data-open={programsOpen}>
                <li>
                  <Link
                    to={toLocalizedPath('programas/ingles-general')}
                    data-testid="mobile-link-ingles-general"
                  >
                    {t('navigation.programItems.generalEnglish')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={toLocalizedPath('programas/business-english')}
                    data-testid="mobile-link-business-english"
                  >
                    {t('navigation.programItems.businessEnglish')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={toLocalizedPath('programas/jovenes-y-ninos')}
                    data-testid="mobile-link-young"
                  >
                    {t('navigation.programItems.youngLearners')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={toLocalizedPath('programas/examenes')}
                    data-testid="mobile-link-exams"
                  >
                    {t('navigation.programItems.examPrep')}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={toLocalizedPath('metodologia')} data-testid="mobile-link-methodology">
                {t('navigation.methodology')}
              </Link>
            </li>
            <li>
              <Link to={toLocalizedPath('profesores')} data-testid="mobile-link-teachers">
                {t('navigation.teachers')}
              </Link>
            </li>
            <li>
              <Link to={toLocalizedPath('precios')} data-testid="mobile-link-pricing">
                {t('navigation.pricing')}
              </Link>
            </li>
            <li>
              <button
                type="button"
                aria-expanded={resourcesOpen}
                data-testid="mobile-resources-toggle"
                onClick={() => setResourcesOpen((prev) => !prev)}
              >
                {t('navigation.resources')}
              </button>
              <ul data-open={resourcesOpen}>
                <li>
                  <Link to={toLocalizedPath('recursos/blog')} data-testid="mobile-link-blog">
                    {t('navigation.resourceItems.blog')}
                  </Link>
                </li>
                <li>
                  <Link to={toLocalizedPath('recursos/test-nivel')} data-testid="mobile-link-test">
                    {t('navigation.resourceItems.placement')}
                  </Link>
                </li>
                <li>
                  <Link to={toLocalizedPath('recursos/guias')} data-testid="mobile-link-guides">
                    {t('navigation.resourceItems.guides')}
                  </Link>
                </li>
                <li>
                  <Link to={toLocalizedPath('recursos/consejos')} data-testid="mobile-link-tips">
                    {t('navigation.resourceItems.tips')}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          onClick={(event) => onOpenFreeClass(event.currentTarget)}
          className="cta"
          data-testid="mobile-cta"
        >
          {t('navigation.freeClass')}
        </button>
      </div>
    </>
  );
};
