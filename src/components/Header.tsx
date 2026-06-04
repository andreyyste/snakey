import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.div
      layout
      className="w-full max-w-4xl flex flex-col items-center z-10 mb-12 shrink-0 text-center relative"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
        <span className="gradient-text font-sans">Snakey</span>
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-xl mb-8">
        A minimalist modern snake game.
        <br />
        <span className="text-sm text-slate-400 font-normal">Try not to let it out of the box...</span>
      </p>
      
      <div className="flex flex-wrap justify-center gap-3">
        <span className="bg-white/60 backdrop-blur-md text-primary px-4 py-2 rounded-full font-mono text-xs border border-white/80 shadow-sm">
          Clean UI
        </span>
        <span className="bg-white/60 backdrop-blur-md text-primary px-4 py-2 rounded-full font-mono text-xs border border-white/80 shadow-sm">
          React 19
        </span>
        <span className="bg-white/60 backdrop-blur-md text-primary px-4 py-2 rounded-full font-mono text-xs border border-white/80 shadow-sm">
          Phaser 3
        </span>
      </div>
    </motion.div>
  );
}
