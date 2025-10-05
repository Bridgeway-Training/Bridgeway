import { useI18n } from '../../app/providers/I18nProvider';

const JovenesNinos = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('navigation.programItems.youngLearners')}</h1>
      <p>Content strategy for young learners and children.</p>
    </section>
  );
};

export default JovenesNinos;
