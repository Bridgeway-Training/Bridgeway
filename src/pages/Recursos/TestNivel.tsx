import { useI18n } from '../../app/providers/I18nProvider';

const TestNivel = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.resources.test')}</h1>
      <p>Placement test entry point with persisted progress indicators.</p>
    </section>
  );
};

export default TestNivel;
