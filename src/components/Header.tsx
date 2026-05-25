import { motion } from 'framer-motion';

export default function Header() {
  return (
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
  );
}
