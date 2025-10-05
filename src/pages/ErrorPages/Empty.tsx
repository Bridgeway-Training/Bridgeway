import { Link } from 'react-router-dom';
import { useI18n } from '../../app/providers/I18nProvider';

const Empty = () => {
  const { t, toLocalizedPath } = useI18n();
  return (
    <section className="content-block" role="status">
      <h1>{t('errors.empty.title')}</h1>
      <p>{t('errors.empty.message')}</p>
      <p>
        <Link to={toLocalizedPath('recursos')} data-testid="empty-cta-link">
          {t('errors.empty.cta')}
        </Link>
      </p>
    </section>
  );
};

export default Empty;
