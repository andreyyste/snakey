import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Game from './Game';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 overflow-x-hidden relative font-sans p-6 py-12">
      
      {/* HEADER SECTION */}
      <motion.div
        layout
        className="w-full max-w-4xl flex flex-col items-center z-10 mb-10 shrink-0"
      >
        <h1 className="text-6xl font-black tracking-tight text-gray-900 mb-6">
          Snakey
        </h1>
        <p className="text-xl text-gray-600 font-medium tracking-wide mb-6 text-center">
          A minimalist modern snake game. 
          <br/>
          <span className="text-sm text-gray-400">Try not to let it out of the box...</span>
        </p>
        
        <div className="flex gap-4 justify-center text-sm text-gray-500 font-medium">
          <span className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">Clean UI</span>
          <span className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">React 18</span>
          <span className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">Phaser 3</span>
        </div>
      </motion.div>

      {/* THE GAME CONTAINER / BUTTON */}
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

      {/* ABOUT & CONTACT SECTION */}
      <motion.div
        layout
        className="w-full max-w-4xl grid md:grid-cols-2 gap-6 text-left mt-12 z-10 shrink-0"
      >
        {/* About Section */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">About the Project</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Snakey is an experimental web project blurring the lines between classic arcade gaming and modern web design. 
            Built with React and Phaser 3, it explores how HTML DOM elements and HTML5 Canvas can seamlessly coexist.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Get in Touch</h2>
          <p className="text-gray-600 leading-relaxed text-sm mb-5">
            Have an idea to make this even crazier? Or found a bug where the snake ate your cursor? Let me know!
          </p>
          <div className="flex flex-col gap-3 text-sm">
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              hello@snakey.app
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              @SnakeyGame
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
