import { useI18n } from '../../app/providers/I18nProvider';

const Profesores = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.teachers.title')}</h1>
      <p>Teacher profiles and accessibility of biographies.</p>
    </section>
  );
};

export default Profesores;
