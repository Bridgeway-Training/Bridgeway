import { useI18n } from '../../app/providers/I18nProvider';

const BusinessEnglish = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.programs.business')}</h1>
      <p>Preview of business English curriculum interactions.</p>
    </section>
  );
};

export default BusinessEnglish;
