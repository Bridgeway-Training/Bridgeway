import { useI18n } from '../../app/providers/I18nProvider';

const InglesGeneral = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('navigation.programItems.generalEnglish')}</h1>
      <p>Interaction notes for general English program.</p>
    </section>
  );
};

export default InglesGeneral;
