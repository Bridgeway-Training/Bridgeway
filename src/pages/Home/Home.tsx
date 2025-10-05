import { useI18n } from '../../app/providers/I18nProvider';
import './Home.css';

const Home = () => {
  const { t } = useI18n();
  return (
    <section id="hero" className="content-block home-hero" data-testid="home-hero">
      <h1>{t('pages.home.hero')}</h1>
      <p>
        This demo highlights interaction patterns for Bridgeway. Use the menu to explore flows and
        observe accessibility affordances in action.
      </p>
    </section>
  );
};

export default Home;
