import { useI18n } from '../../app/providers/I18nProvider';

const languages: Array<{ code: 'en' | 'ro' | 'ru'; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'ro', label: 'RO' },
  { code: 'ru', label: 'RU' }
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div role="group" aria-label="Language" className="language-switcher">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          data-testid={`language-${code}`}
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
