import { useI18n } from '../../app/providers/I18nProvider';

const Examenes = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('navigation.programItems.examPrep')}</h1>
      <p>Exam preparation journey mapping and resources preview.</p>
    </section>
  );
};

export default Examenes;
