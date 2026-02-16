import { useState } from 'react';
import { Clock, ArrowRight, Sparkles, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfigForm({ onStart, fileName }) {
  const [minutes, setMinutes] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ totalTime: minutes * 60 });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const timeOptions = [15, 30, 60, 90, 120];

  return (
    <motion.div
      className="config-form-wrapper"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="setup-card">
        {/* File Info Card */}
        <motion.div className="file-status-badge" variants={itemVariants}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <FileCheck size={24} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="ready-pill">File Analysis Ready</p>
            <p className="text-white font-bold text-lg truncate" title={fileName}>{fileName}</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Study Time Section */}
          <motion.div className="time-selection-container" variants={itemVariants}>
            <div className="section-label">
              <Clock size={14} />
              <span>Select Study Duration</span>
            </div>

            <div className="big-time-display">
              <AnimatePresence mode="wait">
                <motion.span
                  key={minutes}
                  initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                  transition={{ duration: 0.3 }}
                  className="big-minutes tabular-nums"
                >
                  {minutes}
                </motion.span>
              </AnimatePresence>
              <span className="min-label">minutes session</span>
            </div>

            <div className="time-pills-grid">
              {timeOptions.map((t) => (
                <motion.button
                  key={t}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMinutes(t)}
                  className={`time-pill-btn ${minutes === t ? 'active' : ''}`}
                >
                  {t}m
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Hidden Input for Keyboard support */}
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            style={{ display: 'none' }}
          />

          {/* Start Button */}
          <motion.button
            type="submit"
            className="premium-start-btn"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="btn-shine" />
            <Sparkles size={20} />
            <span>START STUDYING</span>
            <ArrowRight size={20} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
