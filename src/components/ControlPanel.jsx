import { Play, Pause, FastForward, Bookmark } from 'lucide-react';

export default function ControlPanel({ 
  onDifficultySelect, 
  onNext, 
  onMarkReview,
  currentDifficulty,
  isPanicMode
}) {
  if (!currentDifficulty) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in glass-panel p-8">
        <h3 className="text-center font-bold text-xl text-white mb-2 tracking-wide">
            How challenging is this slide?
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <button 
            onClick={() => onDifficultySelect('easy')}
            className="btn py-8 flex flex-col items-center gap-2 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 transition-all border border-emerald-500/30 backdrop-blur-sm"
          >
            <span className="text-2xl font-bold drop-shadow-sm">Easy</span>
            <span className="text-xs font-semibold bg-emerald-900/40 px-2 py-1 rounded">30-60s</span>
          </button>
          
          <button 
            onClick={() => onDifficultySelect('medium')}
            className="btn py-8 flex flex-col items-center gap-2 bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 transition-all border border-blue-500/30 backdrop-blur-sm"
          >
            <span className="text-2xl font-bold drop-shadow-sm">Medium</span>
            <span className="text-xs font-semibold bg-blue-900/40 px-2 py-1 rounded">2 min</span>
          </button>
          
          <button 
            onClick={() => onDifficultySelect('hard')}
            className="btn py-8 flex flex-col items-center gap-2 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30 transition-all border border-rose-500/30 backdrop-blur-sm"
          >
            <span className="text-2xl font-bold drop-shadow-sm">Hard</span>
            <span className="text-xs font-semibold bg-rose-900/40 px-2 py-1 rounded">4 min</span>
          </button>
        </div>
      </div>
    );
  }

  // Active state controls
  return (
    <div className="flex items-center justify-between mt-8 p-6 glass-panel animate-fade-in">
      <div className="flex gap-4">
         <button 
            onClick={onMarkReview}
            className="btn glass-button text-white/80 hover:text-white flex items-center gap-2 font-semibold"
         >
            <Bookmark size={20} />
            Review Later
         </button>
      </div>

      <div className="flex gap-4">
        {/* Next Slide / Skip */}
        <button 
           onClick={onNext}
           className="btn btn-primary flex items-center gap-3 px-8 text-lg"
        >
           Next Slide
           <FastForward size={20} />
        </button>
      </div>
    </div>
  );
}
