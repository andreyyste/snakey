import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.div
      layout
      className="w-full max-w-4xl grid md:grid-cols-2 gap-6 text-left mt-12 z-10 shrink-0"
    >
      {/* About Section */}
      <div className="card-container bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
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
      <div className="card-container bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
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
          <a href="https://github.com/andreyyste" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            @andreyyste
          </a>
        </div>
      </div>

      {/* Sandbox Playground (Full width) */}
      <div className="card-container bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 md:col-span-2">
        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Sandbox Playground</h2>
        <p className="text-gray-600 leading-relaxed text-sm mb-6">
          Use this interactive zone to test the custom eating animations of different HTML elements. Let the snake escape and head down here!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          {/* Dropdown Select */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Dropdown (select)</label>
            <select className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-800 outline-none">
              <option>🍔 Burger Option</option>
              <option>🍕 Pizza Option</option>
              <option>🍣 Sushi Option</option>
              <option>🍦 Ice Cream Option</option>
            </select>
          </div>

          {/* Text Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Text Input (input)</label>
            <input type="text" placeholder="Chomp me..." className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-800 outline-none focus:border-purple-500" />
          </div>

          {/* Progress / Meter */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Progress Bar (progress)</label>
            <progress value="75" max="100" className="w-full h-3 rounded-lg overflow-hidden accent-purple-600 bg-gray-100"></progress>
            <label className="font-semibold text-gray-700 mt-1">Meter Indicator (meter)</label>
            <meter value="0.6" className="w-full h-4 accent-green-600"></meter>
          </div>

          {/* Checkbox and Radio */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Toggle Buttons</label>
            <div className="flex gap-4 items-center mt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded" />
                Checkbox
              </label>
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="radio" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300" />
                Radio
              </label>
            </div>
          </div>

          {/* Audio controls */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Audio Widget (audio)</label>
            <audio controls className="w-full h-10 rounded-lg">
              <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
            </audio>
          </div>

          {/* Iframe */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Embedded Shell (iframe)</label>
            <iframe srcDoc="<body style='margin:0;font-family:sans-serif;background:#faf5ff;display:flex;align-items:center;justify-content:center;color:#6b21a8;font-weight:bold;height:100%;font-size:12px;'>Embedded Page</body>" className="w-full h-16 border border-purple-200 rounded-lg overflow-hidden" title="Test Iframe"></iframe>
          </div>
        </div>

        {/* Divider HR */}
        <div className="mt-8">
          <label className="font-semibold text-gray-400 block text-xs mb-2">Horizontal Rule (hr)</label>
          <hr className="border-t-2 border-purple-100" />
        </div>
      </div>
    </motion.div>
  );
}
