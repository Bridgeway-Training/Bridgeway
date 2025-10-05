import { Link } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';

const Error404 = () => {
  const { t, toLocalizedPath } = useI18n();
  return (
    <section className="content-block" role="alert">
      <h1>404 — {t('errors.404.title')}</h1>
      <p>
        <Link to={toLocalizedPath('/')} data-testid="error-home-link">
          {t('errors.global.home')}
        </Link>
      </p>
    </section>
  );
};

export default Error404;
