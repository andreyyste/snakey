import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Game from './Game';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 overflow-x-hidden relative font-sans p-6 py-12">
      
      <Header />

      <motion.div
        layout
        data-playing={isPlaying}
        className="z-20 relative flex items-center justify-center bg-white shadow-xl overflow-hidden data-[playing=false]:rounded-full data-[playing=true]:rounded-2xl border border-gray-200 shrink-0"
        initial={{ borderRadius: "9999px" }}
        animate={{
          width: isPlaying ? 800 : 220,
          height: isPlaying ? 600 : 64,
          borderRadius: isPlaying ? "16px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
      >
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.button
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsPlaying(true)}
              className="w-full h-full flex items-center justify-center text-lg font-bold tracking-wide text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer outline-none"
            >
              Play Game
            </motion.button>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full h-full relative"
            >
              <button 
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
              <Game />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />
    </div>
  );
}

export default App;
