import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowLeft, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';
import useTimer from '../hooks/useTimer';
import SlideViewer from './SlideViewer';

export default function ReviewOverlay({ slides, onFinish }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentSlide = slides[currentIndex];

    const { formattedTime, timeLeft, start } = useTimer({
        initialTime: 300, // 5 minutes
        onExpire: onFinish
    });

    useEffect(() => {
        start();
    }, [start]);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <motion.div
            className="review-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="review-container">
                {/* Review Header */}
                <div className="review-header">
                    <div className="review-title">
                        <RotateCcw size={20} className="text-purple-400" />
                        <span>Review Mode</span>
                        <span className="review-subtitle">Consolidating last 5 slides</span>
                    </div>

                    <div className="review-timer">
                        <Clock size={18} style={{color:'white'}} />
                        <span className="tabular-nums" style={{color:'white'}}>{formattedTime}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="review-main">
                    <div className="review-sidebar">
                        <div className="review-progress">
                            <p className="section-label">Progress</p>
                            <div className="progress-pills">
                                {slides.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`progress-pill ${i === currentIndex ? 'active' : i < currentIndex ? 'completed' : ''}`}
                                        onClick={() => setCurrentIndex(i)}
                                    />
                                ))}
                            </div>
                            <p className="slide-counter">Slide {currentIndex + 1} of {slides.length}</p>
                        </div>

                        <div className="review-controls">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="review-nav-btn"
                            >
                                <ArrowLeft size={18} />
                                <span>Prev</span>
                            </button>
                            <button
                                onClick={handleNext}
                                className="review-nav-btn"
                                disabled={currentIndex === slides.length - 1}
                            >
                                <span>Next</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        <button className="finish-review-btn" onClick={onFinish}>
                            <CheckCircle size={20} />
                            <span>Finish Review</span>
                        </button>
                    </div>

                    <div className="review-viewer">
                        <SlideViewer
                            fileUrl={currentSlide.fileUrl}
                            pageNumber={currentSlide.pageNumber}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
