import { useI18n } from '../../app/providers/I18nProvider';

const ProgramasIndex = () => {
  const { t } = useI18n();
  return (
    <section className="content-block" data-testid="programs-index">
      <h1>{t('pages.programs.title')}</h1>
      <p>Outline of available programs with nested navigation.</p>
    </section>
  );
};

export default ProgramasIndex;
