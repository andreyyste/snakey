import { useState, useCallback } from 'react';
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
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 overflow-x-hidden relative font-sans p-6 py-12">
      
      <Header />

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="score-display"
            className="mb-4 z-20 flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-md border border-gray-100 shrink-0"
          >
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{score}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        id="game-container-shell"
        data-playing={isPlaying}
        className="z-20 relative flex items-center justify-center overflow-hidden shrink-0 bg-white shadow-xl data-[playing=false]:rounded-full data-[playing=true]:rounded-2xl border border-gray-200 pointer-events-auto"
        initial={{ borderRadius: "9999px" }}
        animate={{
          width: isPlaying ? 800 : 220,
          height: isPlaying ? 600 : 64,
          borderRadius: isPlaying ? "16px" : "9999px",
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
              className="w-full h-full flex items-center justify-center text-lg font-bold tracking-wide text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer outline-none"
            >
              Play Game
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
                  className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center pointer-events-auto"
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
