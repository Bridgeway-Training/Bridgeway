import { ReactNode, createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { safeStorage } from '../../utils/storageSafe';

type PersistenceState = {
  userTestCompleted: boolean;
  userBookedClass: boolean;
  modalProgress: {
    step: number;
    values: Record<string, string>;
  };
};

type Action =
  | { type: 'SET_FLAG'; flag: 'userTestCompleted' | 'userBookedClass'; value: boolean }
  | { type: 'SET_MODAL'; payload: PersistenceState['modalProgress'] }
  | { type: 'RESET_MODAL' };

const initialState: PersistenceState = {
  userTestCompleted: false,
  userBookedClass: false,
  modalProgress: {
    step: 0,
    values: {}
  }
};

const STORAGE_KEY = 'persistence';

const reducer = (state: PersistenceState, action: Action): PersistenceState => {
  switch (action.type) {
    case 'SET_FLAG':
      return { ...state, [action.flag]: action.value };
    case 'SET_MODAL':
      return { ...state, modalProgress: action.payload };
    case 'RESET_MODAL':
      return { ...state, modalProgress: initialState.modalProgress };
    default:
      return state;
  }
};

type PersistenceContextValue = PersistenceState & {
  setFlag: (flag: 'userTestCompleted' | 'userBookedClass', value: boolean) => void;
  setModalProgress: (progress: PersistenceState['modalProgress']) => void;
  resetModal: () => void;
};

const PersistenceContext = createContext<PersistenceContextValue | undefined>(undefined);

export const PersistenceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = safeStorage.get(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PersistenceState;
        dispatch({ type: 'SET_FLAG', flag: 'userTestCompleted', value: parsed.userTestCompleted });
        dispatch({ type: 'SET_FLAG', flag: 'userBookedClass', value: parsed.userBookedClass });
        dispatch({ type: 'SET_MODAL', payload: parsed.modalProgress });
      } catch (error) {
        console.warn('Failed to parse persisted state; ignoring.', error);
      }
    }
  }, []);

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      setFlag: (flag: 'userTestCompleted' | 'userBookedClass', value: boolean) =>
        dispatch({ type: 'SET_FLAG', flag, value }),
      setModalProgress: (payload: PersistenceState['modalProgress']) =>
        dispatch({ type: 'SET_MODAL', payload }),
      resetModal: () => dispatch({ type: 'RESET_MODAL' })
    }),
    [state]
  );

  return <PersistenceContext.Provider value={value}>{children}</PersistenceContext.Provider>;
};

export const usePersistence = () => {
  const ctx = useContext(PersistenceContext);
  if (!ctx) {
    throw new Error('usePersistence must be used within PersistenceProvider');
  }
  return ctx;
};
