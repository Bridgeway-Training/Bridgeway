import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { BackToTop } from '../components/BackToTop/BackToTop';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { FabQuickActions } from '../components/FAB/FabQuickActions';
import { LoadBar } from '../components/LoadBar/LoadBar';
import { FreeClassModal } from '../components/Modal/FreeClassModal';
import { Header } from '../components/Header/Header';
import { useI18n } from './providers/I18nProvider';
import { usePreferences } from './providers/PreferencesProvider';
import { prefersReducedMotion } from '../utils/prefers';
import Home from '../pages/Home/Home';
import ProgramasIndex from '../pages/Programas/Index';
import InglesGeneral from '../pages/Programas/InglesGeneral';
import BusinessEnglish from '../pages/Programas/BusinessEnglish';
import JovenesNinos from '../pages/Programas/JovenesNinos';
import Examenes from '../pages/Programas/Examenes';
import Metodologia from '../pages/Metodologia/Metodologia';
import Profesores from '../pages/Profesores/Profesores';
import Precios from '../pages/Precios/Precios';
import Blog from '../pages/Recursos/Blog';
import TestNivel from '../pages/Recursos/TestNivel';
import Guias from '../pages/Recursos/Guias';
import Consejos from '../pages/Recursos/Consejos';
import Error404 from '../pages/ErrorPages/404';
import Error500 from '../pages/ErrorPages/500';
import Empty from '../pages/ErrorPages/Empty';
import Thanks from '../pages/Thanks';

const ScrollRestoration = () => {
  const location = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === 'POP') {
      return;
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [location.pathname, navType]);
  return null;
};

const App = () => {
  const { language } = useI18n();
  const { reducedMotion } = usePreferences();

  useEffect(() => {
    document.title = 'Bridgeway Interaction Demo';
  }, []);

  useEffect(() => {
    document.body.dataset.motion = reducedMotion ? 'reduced' : 'normal';
  }, [reducedMotion]);

  return (
    <>
      <LoadBar />
      <Header />
      <main id="main" data-testid="main-content">
        <Breadcrumbs />
        <Suspense fallback={<div role="status" aria-live="polite">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${language}/`} replace />} />
            <Route path="/:lang(en|ro|ru)">
              <Route index element={<Home />} />
              <Route path="programas" element={<ProgramasIndex />} />
              <Route path="programas/ingles-general" element={<InglesGeneral />} />
              <Route path="programas/business-english" element={<BusinessEnglish />} />
              <Route path="programas/jovenes-y-ninos" element={<JovenesNinos />} />
              <Route path="programas/examenes" element={<Examenes />} />
              <Route path="metodologia" element={<Metodologia />} />
              <Route path="profesores" element={<Profesores />} />
              <Route path="precios" element={<Precios />} />
              <Route path="recursos">
                <Route index element={<ProgramasIndex />} />
                <Route path="blog" element={<Blog />} />
                <Route path="test-nivel" element={<TestNivel />} />
                <Route path="guias" element={<Guias />} />
                <Route path="consejos" element={<Consejos />} />
              </Route>
              <Route path="gracias" element={<Thanks />} />
              <Route path="error" element={<Error500 />} />
              <Route path="empty" element={<Empty />} />
              <Route path="*" element={<Error404 />} />
            </Route>
            <Route path="*" element={<Navigate to={`/${language}/`} replace />} />
          </Routes>
        </Suspense>
      </main>
      <BackToTop />
      <FabQuickActions />
      <FreeClassModal />
      <ScrollRestoration />
    </>
  );
};

export default App;
