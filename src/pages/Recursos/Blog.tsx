import { useI18n } from '../../app/providers/I18nProvider';

const Blog = () => {
  const { t } = useI18n();
  return (
    <section className="content-block">
      <h1>{t('pages.resources.blog')}</h1>
      <p>Blog listing skeleton with empty state fallback handling.</p>
    </section>
  );
};

export default Blog;
