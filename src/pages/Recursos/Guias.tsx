import { useI18n } from '../../app/providers/I18nProvider';

const Guias = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.resources.guides')}</h1>
      <p>Downloadable guides with offline fallbacks.</p>
    </section>
  );
};

export default Guias;
