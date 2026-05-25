import { motion } from 'framer-motion';

export default function Footer() {
  return (
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Get in Touch</h2>
        <p className="text-gray-600 leading-relaxed text-sm mb-5">
          Have an idea to make this even crazier? Or found a bug where the snake ate your cursor? Let me know!
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <a href="mailto:manurungandre1927@gmail.com" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            manurungandre1927@gmail.com
          </a>
          <a href="https://nre.codes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            nre.codes
          </a>
        </div>
      </div>
    </motion.div>
  );
}
