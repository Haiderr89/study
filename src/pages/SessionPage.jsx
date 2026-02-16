import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import useTimer from '../hooks/useTimer';
import SlideViewer from '../components/SlideViewer';
import Overlay from '../components/Overlay';
import useBoredomDetection from '../hooks/useBoredomDetection';
import { Clock, AlertCircle, CheckCircle, Target, Zap, ArrowRight } from 'lucide-react';

export default function SessionPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useSession();
  const { slides, currentSlideIndex, isActive, isPanicMode, extensionsUsed, goal } = state;

  const currentSlide = slides[currentSlideIndex];
  const [showOverlay, setShowOverlay] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(null);
  const [showBoredomAlert, setShowBoredomAlert] = useState(false);

  const { timeLeft, formattedTime, isRunning, start, pause, reset, progress } = useTimer({
    initialTime: 0,
    onExpire: () => setShowOverlay(true)
  });

  useBoredomDetection({
    timeout: 45000,
    isActive: isRunning && !showOverlay,
    onBoredomDetected: () => setShowBoredomAlert(true)
  });

  useEffect(() => {
    if (!state.isConfigured || slides.length === 0) {
      navigate('/');
    }
  }, [state.isConfigured, slides.length, navigate]);

  useEffect(() => {
    setShowOverlay(false);
    setDifficultySelected(null);
    setShowBoredomAlert(false);
    reset(0);
  }, [currentSlideIndex, reset]);

  const handleDifficultySelect = (seconds) => {
    setDifficultySelected(seconds);
    dispatch({ type: 'UPDATE_SLIDE_DIFFICULTY', payload: { slideId: currentSlide.id, difficulty: seconds } });
    // Since 'seconds' is now the time value directly
    reset(seconds);
    start();
  };

  const handleNextSlide = () => {
    pause();
    setShowOverlay(false);
    if (currentSlideIndex < slides.length - 1) {
      dispatch({ type: 'NEXT_SLIDE' });
    } else {
      navigate('/summary');
    }
  };

  const handleExtend = () => {
    dispatch({ type: 'USE_EXTENSION' });
    reset(timeLeft + 60);
    start();
    setShowOverlay(false);
  };

  const handleMarkAndMove = () => {
    handleNextSlide();
  };

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
      {/* Session Content Wrapper */}
      <div className="session-content">

        {/* Controls Sidebar (Left) */}
        <div className="controls-sidebar">
          {/* Header */}
          <div className="examix-logo">
            <div className="logo-circle"></div>
            <span>EXAMIX</span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }} />

          {/* Stats Grid */}
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

          {/* Goal Area */}
          <div className="sidebar-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              <Target size={14} />
              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>GOAL</span>
            </div>
            <p style={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4 }}>{goal}</p>
          </div>

          {/* Timer Card */}
          <div className="timer-card">
            <div className="timer-progress-bg">
              <div className="timer-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>TIME LEFT</span>
            </div>
            <div style={{ fontSize: '4rem', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
              {formattedTime}
            </div>
          </div>

          {/* Difficulty Selection */}
          {/* Difficulty Selection (Time Per Slide) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>TIME PER SLIDE</p>
            {!difficultySelected ? (
              <div className="grid grid-cols-2 gap-2">
                {[30, 45, 60, 90, 120].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => handleDifficultySelect(seconds)}
                    className="difficulty-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
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
                    // Note: current implementation might need reset logic if we want to cancel selection, 
                    // but usually once selected we stick with it or just show it. 
                    // For now, I'll just allow re-selecting by setting state.
                  }}
                  className="ml-auto text-xs opacity-50 hover:opacity-100"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
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

        {/* PDF Area (Right) */}
        <div className="pdf-area">
          <div className="pdf-glass-container">
            <SlideViewer
              fileUrl={currentSlide.fileUrl}
              pageNumber={currentSlide.pageNumber}
            />
          </div>
        </div>

      </div>

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
