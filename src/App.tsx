import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Game from './Game';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [score, setScore] = useState(0);

  const handlePlay = () => {
    setScore(0);
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setIsExpanded(false);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-mesh-pattern text-on-surface overflow-x-hidden relative font-sans p-6 py-16 selection:bg-primary-fixed selection:text-on-primary-fixed">
      
      {/* Background Mesh Glow Blob */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-20 select-none">
        <div className="w-[600px] h-[600px] bg-primary rounded-full blur-[140px]"></div>
      </div>

      <Header />

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="score-display"
            className="mb-6 z-20 flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border border-white/80 shrink-0"
          >
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]"></div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{score}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        id="game-container-shell"
        data-playing={isPlaying}
        className="z-20 relative flex items-center justify-center overflow-hidden shrink-0 bg-white/80 backdrop-blur-md shadow-2xl data-[playing=false]:rounded-full data-[playing=true]:rounded-2xl border border-white/80 pointer-events-auto"
        initial={{ borderRadius: "9999px" }}
        animate={{
          width: isPlaying ? 800 : 240,
          height: isPlaying ? 600 : 68,
          borderRadius: isPlaying ? "24px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
        onAnimationComplete={() => {
          if (isPlaying) {
            setIsExpanded(true);
          }
        }}
      >
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.button
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handlePlay}
              className="w-full h-full flex items-center justify-center text-lg font-bold tracking-wide text-white bg-gradient-to-r from-primary via-[#5c85ff] to-secondary hover:opacity-95 transition-all cursor-pointer outline-none gap-2 border border-white/20 play-btn-glow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8 5.14v14c0 .86.94 1.36 1.66.9l10-7a1 1 0 000-1.8l-10-7A1 1 0 008 5.14z" />
              </svg>
              Play Snakey
            </motion.button>
          ) : (
            isExpanded && (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative"
              >
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-50 text-slate-500 hover:text-slate-900 transition-colors bg-white/60 hover:bg-white/80 border border-white/80 rounded-full w-8 h-8 flex items-center justify-center pointer-events-auto shadow-sm"
                >
                  ✕
                </button>
                <Game onScoreUpdate={setScore} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />
    </div>
  );
}

export default App;
