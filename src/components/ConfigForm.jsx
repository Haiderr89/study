import { useState } from 'react';
import { Clock, Target, ArrowRight, Sparkles, FileCheck } from 'lucide-react';

const GOAL_OPTIONS = [
  'Finish Lecture',
  'High-Yield Review',
  'Exam Prep',
  'Quick Revision',
  'Deep Study'
];

export default function ConfigForm({ onStart, fileName }) {
  const [minutes, setMinutes] = useState(60);
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ totalTime: minutes * 60, goal });
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-scale-in">
      {/* File Info Card */}
      <div className="mb-8 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-inner">
            <FileCheck size={28} className="text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-200/80 font-bold uppercase tracking-widest mb-1">Ready to Study</p>
            <p className="text-white font-semibold text-lg truncate" title={fileName}>{fileName}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Study Time Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Clock size={16} className="text-blue-300" />
            </div>
            <span className="text-sm font-bold tracking-wide">STUDY TIME</span>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <input
                type="number"
                min="5"
                max="480"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full px-8 py-6 rounded-3xl bg-white/5 border border-white/10 
                           focus:border-white/40 focus:bg-white/10 focus:ring-4 focus:ring-white/5 outline-none transition-all 
                           text-center font-bold text-6xl placeholder-white/20
                           hover:bg-white/10 hover:border-white/20"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-lg font-medium pointer-events-none">
                min
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            {[15, 60, 120].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMinutes(t)}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border duration-200 ${minutes === t
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-lg scale-105'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
                  }`}
              >
                {t} min
              </button>
            ))}
          </div>
        </div>

        {/* Session Goal */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <Target size={16} className="text-purple-300" />
            </div>
            <span className="text-sm font-bold text-white/90 tracking-wide">SESSION GOAL</span>
          </div>

          <div className="relative group">
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 
                       focus:border-white/40 focus:bg-white/10 outline-none transition-all 
                       text-white cursor-pointer appearance-none font-semibold text-xl
                       hover:bg-white/10 hover:border-white/20"
            >
              {GOAL_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-slate-800 text-white py-2">
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1L7 7L13 1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full py-6 rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-xl
                   flex items-center justify-center gap-4 transition-all duration-300
                   hover:shadow-[0_0_40px_rgba(167,139,250,0.5)] hover:scale-[1.02] active:scale-[0.98]
                   shadow-lg group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm" />
          <Sparkles size={24} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10 tracking-wide">START STUDYING</span>
          <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
