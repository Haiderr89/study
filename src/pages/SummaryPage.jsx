import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { CheckCircle, Clock, RefreshCw, Trophy, Zap, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function SummaryPage() {
    const navigate = useNavigate();
    const { state } = useSession();
    const { totalTime, slides, extensionsUsed, startTime, goal } = state;
    const hasSavedRef = useRef(false);

    const slidesCompleted = slides.filter(s => s.status === 'completed').length;
    // Use current time difference if startTime exists, else 0
    const sessionDuration = startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 0;

    useEffect(() => {
        if (!hasSavedRef.current && startTime) {
            hasSavedRef.current = true;
            // Save to backend logic here (keep existing)
            fetch('http://localhost:3000/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goal: goal,
                    timeSpent: sessionDuration,
                    slidesTotal: slides.length,
                    slidesCompleted,
                    extensionsUsed,
                    panicMode: state.isPanicMode
                })
            }).catch(err => console.error('Failed to save session:', err));
        }
    }, [startTime, goal, sessionDuration, slides.length, slidesCompleted, extensionsUsed, state.isPanicMode]);


    const handleNewSession = () => {
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden bg-[var(--bg-app)]">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left Column: Hero Status */}
                <div className="text-left space-y-6 animate-slide-in-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-bold uppercase tracking-wider backdrop-blur-md">
                        <Sparkles size={14} className="animate-pulse" />
                        Session Complete
                    </div>

                    <h1 className="text-6xl font-extrabold text-white leading-tight">
                        You crushed your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            study goal!
                        </span>
                    </h1>

                    <p className="text-xl text-white/60 max-w-md">
                        Great job focusing on <span className="text-white font-semibold">{goal}</span>. Here is how you performed.
                    </p>

                    <div className="pt-8">
                        <button
                            onClick={handleNewSession}
                            className="group relative px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        >
                            Start New Session
                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Stats Card */}
                <div className="relative animate-scale-in delay-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 rounded-[2.5rem] blur-xl" />
                    <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">

                        {/* Trophy Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Trophy size={32} className="text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">TOTAL SCORE</p>
                                <p className="text-4xl font-black text-white">100%</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <p className="text-sm font-bold text-blue-300 mb-1 flex items-center gap-2">
                                    <Clock size={14} /> Time
                                </p>
                                <p className="text-2xl font-bold text-white">{sessionDuration} <span className="text-sm text-white/40 font-normal">min</span></p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <p className="text-sm font-bold text-purple-300 mb-1 flex items-center gap-2">
                                    <CheckCircle size={14} /> Slides
                                </p>
                                <p className="text-2xl font-bold text-white">{slidesCompleted} <span className="text-lg text-white/40 font-normal">/ {slides.length}</span></p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <p className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-2">
                                    <Zap size={14} /> Extensions
                                </p>
                                <p className="text-2xl font-bold text-white">{extensionsUsed} <span className="text-lg text-white/40 font-normal">used</span></p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <p className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-2">
                                    <TrendingUp size={14} /> Focus
                                </p>
                                <p className="text-2xl font-bold text-white">High</p>
                            </div>
                        </div>

                        {/* Upsell */}
                        <div className="p-5 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-2xl border border-indigo-500/30 flex items-center justify-between group cursor-pointer hover:bg-indigo-600/30 transition-colors">
                            <div>
                                <p className="font-bold text-indigo-200 text-sm mb-0.5">Unlock Detailed Insights</p>
                                <p className="text-xs text-indigo-300/60">View retention graphs & export data</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-400">
                                <ArrowRight size={16} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
