import { useI18n } from '../../app/providers/I18nProvider';

const Precios = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.pricing.title')}</h1>
      <p>Pricing tiers with emphasis on responsive layout and high contrast.</p>
    </section>
  );
};

export default Precios;
