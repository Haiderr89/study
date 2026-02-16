import { createContext, useContext, useReducer } from 'react';

const SessionContext = createContext();

const initialState = {
  isConfigured: false,
  isActive: false,
  totalTime: 0, // in seconds
  goal: '',
  slides: [], // { id, content, difficulty, timeAllocated, timeSpent, status: 'pending' | 'completed' | 'review' }
  currentSlideIndex: 0,
  extensionsUsed: 0,
  isPanicMode: false,
  startTime: null,
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        totalTime: action.payload.totalTime,
        goal: action.payload.goal,
        isConfigured: true,
      };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        totalTime: action.payload.totalTime,
        goal: action.payload.goal,
        isConfigured: true,
      };
    case 'LOAD_SLIDES':
      return {
        ...state,
        slides: action.payload.slides.map((slide, index) => ({
          ...slide,
          id: index,
          status: 'pending',
          timeSpent: 0,
          extensions: 0,
        })),
        currentSlideIndex: 0,
      };
    case 'START_SESSION':
      // This action now handles both slides and config in one go
      return {
        ...state,
        slides: action.payload.slides || state.slides,
        totalTime: action.payload.totalTime || state.totalTime,
        startTime: action.payload.startTime || Date.now(),
        isActive: true,
        isConfigured: true,
        currentSlideIndex: 0,
      };
    case 'UPDATE_SLIDE_DIFFICULTY':
      // Update difficulty and allocate time
      const { slideId, difficulty } = action.payload;

      // If difficulty is a number (seconds), use it. Otherwise map strings.
      let baseTime;
      if (typeof difficulty === 'number') {
        baseTime = difficulty;
      } else {
        const timeRules = {
          easy: 45,
          medium: 120,
          hard: 240,
        };
        baseTime = timeRules[difficulty] || 60;
      }

      // Apply panic mode reduction if active (e.g., 20% reduction)
      const modifier = state.isPanicMode ? 0.8 : 1.0;

      return {
        ...state,
        slides: state.slides.map(s =>
          s.id === slideId
            ? { ...s, difficulty, timeAllocated: Math.floor(baseTime * modifier) }
            : s
        )
      };
    case 'NEXT_SLIDE':
      return {
        ...state,
        slides: state.slides.map((s, i) => i === state.currentSlideIndex ? { ...s, status: 'completed' } : s),
        currentSlideIndex: Math.min(state.currentSlideIndex + 1, state.slides.length - 1),
      };
    case 'USE_EXTENSION':
      return {
        ...state,
        extensionsUsed: state.extensionsUsed + 1,
        // Check panic trigger: > 3 extensions
        isPanicMode: state.extensionsUsed + 1 > 3 ? true : state.isPanicMode
      };
    default:
      return state;
  }
};

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
