import { Link, useLocation, useParams } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';
import './Breadcrumbs.css';

export const Breadcrumbs = () => {
  const location = useLocation();
  const { lang } = useParams();
  const { t } = useI18n();
  const segments = location.pathname.split('/').filter(Boolean).slice(1);

  if (!segments.length) {
    return null;
  }

  let pathAccumulator = '';

  const crumbs = [
    {
      label: t('breadcrumbs.home'),
      path: `/${lang ?? 'en'}/`
    },
    ...segments.map((segment) => {
      pathAccumulator += `${segment}/`;
      const labelMap: Record<string, string> = {
        programas: t('pages.programs.title'),
        'ingles-general': t('navigation.programItems.generalEnglish'),
        'business-english': t('navigation.programItems.businessEnglish'),
        'jovenes-y-ninos': t('navigation.programItems.youngLearners'),
        examenes: t('navigation.programItems.examPrep'),
        metodologia: t('pages.methodology.title'),
        profesores: t('pages.teachers.title'),
        precios: t('pages.pricing.title'),
        recursos: t('navigation.resources'),
        blog: t('pages.resources.blog'),
        'test-nivel': t('pages.resources.test'),
        guias: t('pages.resources.guides'),
        consejos: t('pages.resources.tips'),
        gracias: t('pages.thanks.title')
      };
      return {
        label: labelMap[segment] ?? segment,
        path: `/${lang ?? 'en'}/${pathAccumulator}`
      };
    })
  ];

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs" data-testid="breadcrumbs">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path}>
            {index === crumbs.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.path}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
