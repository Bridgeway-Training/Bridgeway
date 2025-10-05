import { useI18n } from '../../app/providers/I18nProvider';

const Consejos = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.resources.tips')}</h1>
      <p>Advice feed highlighting keyboard shortcuts and accessibility.</p>
    </section>
  );
};

export default Consejos;
