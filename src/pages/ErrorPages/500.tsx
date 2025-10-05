import { Link } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';

const Error500 = () => {
  const { t, toLocalizedPath } = useI18n();
  return (
    <section className="content-block" role="alert">
      <h1>500 — {t('errors.500.title')}</h1>
      <p>
        <Link to={toLocalizedPath('/')} data-testid="error-retry-link">
          {t('errors.500.cta')}
        </Link>
      </p>
    </section>
  );
};

export default Error500;
