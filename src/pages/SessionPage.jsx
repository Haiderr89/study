import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import useTimer from '../hooks/useTimer';
import SlideViewer from '../components/SlideViewer';
import Overlay from '../components/Overlay';
import ReviewOverlay from '../components/ReviewOverlay';
import useBoredomDetection from '../hooks/useBoredomDetection';
import { Clock, AlertCircle, CheckCircle, Target, Zap, ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function SessionPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();
  const { slides, currentSlideIndex, isActive, isPanicMode, extensionsUsed, totalTime } = state;

  const currentSlide = slides[currentSlideIndex];
  const [showOverlay, setShowOverlay] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(null);
  const [showBoredomAlert, setShowBoredomAlert] = useState(false);

  // Review Mode State
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [slidesCompletedInBlock, setSlidesCompletedInBlock] = useState(0);

  const handleExpire = useCallback(() => setShowOverlay(true), []);

  const { timeLeft, formattedTime, isRunning, start, pause, reset, progress } = useTimer({
    initialTime: 0,
    onExpire: handleExpire
  });

  // Session Timer
  const { formattedTime: formattedSessionTime, start: startSessionTimer, pause: pauseSessionTimer } = useTimer({
    initialTime: totalTime,
    onExpire: () => { /* Optional: handle session end */ }
  });

  useBoredomDetection({
    timeout: 45000,
    isActive: isRunning && !showOverlay && !isReviewMode,
    onBoredomDetected: () => setShowBoredomAlert(true)
  });

  useEffect(() => {
    if (!state.isConfigured || slides.length === 0) {
      navigate('/');
    }
  }, [state.isConfigured, slides.length, navigate]);

  useEffect(() => {
    if (isActive) {
      startSessionTimer();
    } else {
      pauseSessionTimer();
    }
    return () => pauseSessionTimer();
  }, [isActive, startSessionTimer, pauseSessionTimer]);

  useEffect(() => {
    setShowOverlay(false);
    setDifficultySelected(null);
    setShowBoredomAlert(false);
    reset(0);
  }, [currentSlideIndex, reset]);

  const handleDifficultySelect = useCallback((seconds) => {
    setDifficultySelected(seconds);
    dispatch({ type: 'UPDATE_SLIDE_DIFFICULTY', payload: { slideId: currentSlide.id, difficulty: seconds } });
    reset(seconds);
    start();
  }, [currentSlide?.id, dispatch, reset, start]);

  const handleNextSlide = useCallback(() => {
    pause();
    setShowOverlay(false);

    const newCount = slidesCompletedInBlock + 1;
    setSlidesCompletedInBlock(newCount);

    if (newCount === 5) {
      setIsReviewMode(true);
    } else {
      moveToNext();
    }
  }, [pause, slidesCompletedInBlock, moveToNext]); // Note: moveToNext needs stabilization too if we want to be strict, but it depends on many things. I'll stabilize it.

  const moveToNext = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      dispatch({ type: 'NEXT_SLIDE' });
    } else {
      navigate('/summary');
    }
  }, [currentSlideIndex, slides.length, dispatch, navigate]);

  const handleFinishReview = () => {
    setIsReviewMode(false);
    setSlidesCompletedInBlock(0);
    moveToNext();
  };

  const lastFiveSlides = useMemo(() => {
    if (!isReviewMode) return [];
    // Slides we just finished are from currentSlideIndex - 4 to currentSlideIndex
    return slides.slice(Math.max(0, currentSlideIndex - 4), currentSlideIndex + 1);
  }, [isReviewMode, currentSlideIndex, slides]);

  const handleExtend = useCallback(() => {
    dispatch({ type: 'USE_EXTENSION' });
    reset(timeLeft + 60);
    start();
    setShowOverlay(false);
  }, [dispatch, reset, timeLeft, start]);

  const handleMarkAndMove = useCallback(() => {
    handleNextSlide();
  }, [handleNextSlide]);

  if (!currentSlide) {
    return (
      <div className="examix-container vertical justify-center items-center">
        <div className="text-center p-8">
          <AlertCircle size={48} className="mx-auto mb-4 text-rose-400" />
          <h2 className="text-2xl font-bold text-white">Session Error</h2>
          <button onClick={() => navigate('/')} className="create-account-btn mt-4">Restart</button>
        </div>
      </div>
    );
  }

  return (
    <div className="examix-container horizontal !p-0">
      <div className="session-content">
        {/* Controls Sidebar (Left) */}
        <div className="controls-sidebar">
          <div className="examix-logo">
            <div className="logo-circle"></div>
            <span>EXAMIX</span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }} />

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="stat-box text-center">
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '4px' }}>SLIDE</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{currentSlideIndex + 1} / {slides.length}</p>
            </div>
            <div className="stat-box text-center">
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '4px' }}>HELP</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{extensionsUsed}/3</p>
            </div>
          </div>

          <div className="timer-card-session" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
              <Clock size={16} className="text-purple-300" />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>TOTAL TIME</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
              {formattedSessionTime}
            </div>
          </div>

          <div className="timer-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>TIME LEFT</span>
            </div>
            <div style={{ fontSize: '4rem', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
              {formattedTime}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>TIME PER SLIDE</p>
            {!difficultySelected ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[15, 30, 45, 60, 90, 120].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => handleDifficultySelect(seconds)}
                    className="difficulty-btn"
                    style={{
                      aspectRatio: '1/1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{seconds}s</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="sidebar-section" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)' }}>
                <CheckCircle size={20} className="text-emerald-400" />
                <div className="flex flex-col">
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.05em' }}>{difficultySelected}s</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Allocated</span>
                </div>
                <button
                  onClick={() => {
                    setDifficultySelected(null);
                    dispatch({ type: 'UPDATE_SLIDE_DIFFICULTY', payload: { slideId: currentSlide.id, difficulty: null } });
                  }}
                  className="ml-auto text-xs opacity-50 hover:opacity-100"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={handleNextSlide}
              disabled={!difficultySelected}
              className="start-study-btn"
            >
              Next Slide <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Exit Session
            </button>
          </div>
        </div>

        <div className="pdf-area">
          <div className="pdf-glass-container">
            <SlideViewer
              fileUrl={currentSlide.fileUrl}
              pageNumber={currentSlide.pageNumber}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReviewMode && (
          <ReviewOverlay
            slides={lastFiveSlides}
            onFinish={handleFinishReview}
          />
        )}
      </AnimatePresence>

      {showOverlay && (
        <Overlay
          onNext={handleNextSlide}
          onExtend={handleExtend}
          onMarkAndMove={handleMarkAndMove}
          extensionsUsed={extensionsUsed}
        />
      )}
    </div>
  );
}
