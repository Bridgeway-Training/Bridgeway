import { useI18n } from '../../app/providers/I18nProvider';

const Metodologia = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.methodology.title')}</h1>
      <p>Describe pedagogical approach, flow cues, and demonstration modules.</p>
    </section>
  );
};

export default Metodologia;
