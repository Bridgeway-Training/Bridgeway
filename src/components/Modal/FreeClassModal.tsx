import { FormEvent, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../app/providers/ModalProvider';
import { usePersistence } from '../../app/providers/PersistenceProvider';
import { useI18n } from '../../app/providers/I18nProvider';
import { useLoadBar } from '../../app/providers/LoadBarProvider';
import { createFocusTrap } from '../../utils/focusTrap';
import { getLocalTimezone, formatTimeOption } from '../../utils/tz';
import { simulateRequest } from '../../mocks/apiDelays';
import calendarFile from '../../mocks/calendar.ics?url';
import './FreeClassModal.css';

type Step = 0 | 1 | 2;

type State = {
  step: Step;
  values: Record<string, string>;
};

type Action =
  | { type: 'SET_STEP'; step: Step }
  | { type: 'UPDATE_VALUE'; name: string; value: string }
  | { type: 'RESET'; payload?: State };

const initialState: State = {
  step: 0,
  values: {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'UPDATE_VALUE':
      return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'RESET':
      return action.payload ?? initialState;
    default:
      return state;
  }
};

export const FreeClassModal = () => {
  const { isFreeClassOpen, closeFreeClass } = useModal();
  const navigate = useNavigate();
  const { modalProgress, setModalProgress, resetModal, setFlag } = usePersistence();
  const { t, language, toLocalizedPath } = useI18n();
  const { startTask, endTask } = useLoadBar();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [liveMessage, setLiveMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const focusTrap = useMemo(() => createFocusTrap(containerRef), []);
  const tz = useMemo(() => getLocalTimezone(), []);

  useEffect(() => {
    if (modalProgress.values) {
      dispatch({ type: 'RESET', payload: { step: modalProgress.step as Step, values: modalProgress.values } });
    }
  }, [modalProgress]);

  useEffect(() => {
    if (isFreeClassOpen) {
      focusTrap.activate();
      setTimeout(() => {
        containerRef.current?.querySelector<HTMLElement>('input, button')?.focus();
      }, 50);
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeWithConfirm();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      focusTrap.deactivate();
      dispatch({ type: 'RESET' });
      setStatus('idle');
      setLiveMessage('');
    }
  }, [focusTrap, isFreeClassOpen]);

  useEffect(() => {
    setModalProgress({ step: state.step, values: state.values });
  }, [setModalProgress, state.step, state.values]);

  const closeWithConfirm = () => {
    const hasData = Object.values(state.values).some(Boolean);
    if (hasData && !window.confirm(t('modal.confirmLeave'))) {
      return;
    }
    resetModal();
    closeFreeClass();
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', step: Math.min(state.step + 1, 2) as Step });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', step: Math.max(state.step - 1, 0) as Step });
  };

  const validateStep = (): boolean => {
    if (state.step === 0) {
      return Boolean(state.values.name && state.values.email);
    }
    if (state.step === 1) {
      return Boolean(state.values.date && state.values.time);
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    if (state.step < 2) {
      nextStep();
      return;
    }
    setStatus('loading');
    setLiveMessage(t('modal.feedback.loading'));
    startTask();
    try {
      await simulateRequest(true, 1200);
      setStatus('success');
      setLiveMessage(t('modal.feedback.success'));
      setFlag('userBookedClass', true);
      resetModal();
      dispatch({ type: 'SET_STEP', step: 2 });
    } catch (error) {
      console.error(error);
      setStatus('error');
      setLiveMessage(t('modal.feedback.error'));
    } finally {
      endTask();
    }
  };

  const timeOptions = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 9 + index);
      return {
        value: `${date.getHours()}:00`,
        label: formatTimeOption(date, language)
      };
    });
  }, [language]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="free-class-title"
      className="free-class-modal"
      data-open={isFreeClassOpen}
      ref={containerRef}
      data-testid="free-class-modal"
    >
      <div className="modal-content">
        <header>
          <h2 id="free-class-title">{t('modal.title')}</h2>
          <p className="step-label">{t('modal.step', { step: state.step + 1 })}</p>
        </header>
        <form onSubmit={handleSubmit}>
          <section aria-live="polite" className="step" data-step={state.step}>
            {state.step === 0 && (
              <fieldset>
                <legend>{t('modal.steps.details')}</legend>
                <label>
                  {t('modal.labels.name')}
                  <input
                    name="name"
                    value={state.values.name}
                    onChange={(event) => dispatch({ type: 'UPDATE_VALUE', name: 'name', value: event.target.value })}
                    required
                    data-testid="modal-input-name"
                  />
                </label>
                <label>
                  {t('modal.labels.email')}
                  <input
                    name="email"
                    type="email"
                    value={state.values.email}
                    onChange={(event) => dispatch({ type: 'UPDATE_VALUE', name: 'email', value: event.target.value })}
                    required
                    data-testid="modal-input-email"
                  />
                </label>
                <label>
                  {t('modal.labels.phone')}
                  <input
                    name="phone"
                    value={state.values.phone}
                    onChange={(event) => dispatch({ type: 'UPDATE_VALUE', name: 'phone', value: event.target.value })}
                    data-testid="modal-input-phone"
                  />
                </label>
              </fieldset>
            )}
            {state.step === 1 && (
              <fieldset>
                <legend>{t('modal.steps.schedule')}</legend>
                <p>{t('modal.labels.timezone', { tz })}</p>
                <label>
                  {t('modal.labels.date')}
                  <input
                    type="date"
                    name="date"
                    value={state.values.date}
                    onChange={(event) => dispatch({ type: 'UPDATE_VALUE', name: 'date', value: event.target.value })}
                    required
                    data-testid="modal-input-date"
                  />
                </label>
                <label>
                  {t('modal.labels.time')}
                  <select
                    name="time"
                    value={state.values.time}
                    onChange={(event) => dispatch({ type: 'UPDATE_VALUE', name: 'time', value: event.target.value })}
                    required
                    data-testid="modal-input-time"
                  >
                    <option value="" disabled>
                      --
                    </option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t('modal.labels.notes')}
                  <textarea
                    name="notes"
                    value={state.values.notes}
                    onChange={(event) => dispatch({ type: 'UPDATE_VALUE', name: 'notes', value: event.target.value })}
                    data-testid="modal-input-notes"
                  />
                </label>
              </fieldset>
            )}
            {state.step === 2 && (
              <section className="confirmation">
                <h3>{t('modal.steps.confirm')}</h3>
                <p>{t('modal.feedback.success')}</p>
                <div className="calendar-links">
                  <a href="https://calendar.google.com" target="_blank" rel="noreferrer">
                    {t('modal.addons.google')}
                  </a>
                  <a href="https://www.icloud.com/calendar" target="_blank" rel="noreferrer">
                    {t('modal.addons.apple')}
                  </a>
                  <a href="https://outlook.live.com" target="_blank" rel="noreferrer">
                    {t('modal.addons.outlook')}
                  </a>
                  <a href={calendarFile} download>
                    {t('modal.actions.downloadIcs')}
                  </a>
                </div>
              </section>
            )}
          </section>
          <div className="actions">
            <button type="button" onClick={closeWithConfirm} data-testid="modal-close">
              {t('modal.actions.close')}
            </button>
            {state.step > 0 && state.step < 2 && (
              <button type="button" onClick={prevStep} data-testid="modal-back">
                {t('modal.actions.back')}
              </button>
            )}
            {state.step < 2 && (
              <button type="submit" data-testid="modal-next" disabled={!validateStep()}>
                {t('modal.actions.next')}
              </button>
            )}
            {state.step === 2 && (
              <>
                <button type="submit" data-testid="modal-submit" disabled={status === 'loading'}>
                  {status === 'loading' ? t('modal.feedback.loading') : t('modal.actions.submit')}
                </button>
                {status === 'success' && (
                  <button
                    type="button"
                    data-testid="modal-thanks"
                    onClick={() => {
                      closeFreeClass();
                      navigate(toLocalizedPath('gracias'));
                    }}
                  >
                    {t('errors.global.class')}
                  </button>
                )}
              </>
            )}
          </div>
        </form>
        <div role="status" aria-live="polite" className="sr-only">
          {liveMessage}
        </div>
      </div>
    </div>
  );
};
