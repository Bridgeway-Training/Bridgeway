import { useI18n } from '../app/providers/I18nProvider';
import calendarFile from '../mocks/calendar.ics?url';
import './Thanks.css';

const Thanks = () => {
  const { t } = useI18n();
  return (
    <section aria-labelledby="thanks-title" className="content-block">
      <h1 id="thanks-title">{t('pages.thanks.title')}</h1>
      <p>{t('pages.thanks.message')}</p>
      <div className="calendar-links">
        <a href="https://calendar.google.com" target="_blank" rel="noreferrer" data-testid="calendar-google">
          {t('modal.addons.google')}
        </a>
        <a href="https://www.icloud.com/calendar" target="_blank" rel="noreferrer" data-testid="calendar-apple">
          {t('modal.addons.apple')}
        </a>
        <a href="https://outlook.live.com" target="_blank" rel="noreferrer" data-testid="calendar-outlook">
          {t('modal.addons.outlook')}
        </a>
        <a href={calendarFile} download data-testid="calendar-ics">
          {t('modal.actions.downloadIcs')}
        </a>
      </div>
      <div className="post-actions">
        <a href="#" data-testid="reschedule-link">
          {t('modal.actions.reschedule')}
        </a>
        <a href="#" data-testid="cancel-link">
          {t('modal.actions.cancel')}
        </a>
        <div className="quick-contact" role="group" aria-label="Quick contact">
          <a href="https://wa.me/000" data-testid="contact-whatsapp">
            WhatsApp
          </a>
          <a href="https://t.me/bridgeway" data-testid="contact-telegram">
            Telegram
          </a>
          <a href="mailto:hello@example.com" data-testid="contact-email">
            Email
          </a>
        </div>
      </div>
    </section>
  );
};

export default Thanks;
