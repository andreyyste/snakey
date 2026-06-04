import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const bookmarkletRef = useRef<HTMLAnchorElement>(null);

  const getBookmarkletUrl = () => {
    if (typeof window === 'undefined') return '#';
    const origin = window.location.origin;
    return `javascript:(function(){if(window.SnakeyInjected)return;window.SnakeyInjected=true;var%20css=document.createElement('link');css.rel='stylesheet';css.href='${origin}/bookmarklet/index.css';document.head.appendChild(css);var%20js=document.createElement('script');js.src='${origin}/bookmarklet/index.js';document.body.appendChild(js);})()`;
  };

  useEffect(() => {
    if (bookmarkletRef.current) {
      bookmarkletRef.current.href = getBookmarkletUrl();
    }
  }, []);

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
          <a href="https://github.com/andreyyste" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            @andreyyste
          </a>
        </div>
      </div>

      {/* Bookmarklet Section (Full width) */}
      <div id="bookmarklet-section" className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 md:col-span-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Snakey Bookmarklet</h2>
        <p className="text-gray-600 leading-relaxed text-sm mb-6">
          Play Snakey on any webpage instantly! Drag the button below to your bookmark bar, then click it on any website to let the snake eat its elements.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">How to Install:</h3>
            <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1.5">
              <li>Make sure your browser's <strong>Bookmarks Bar</strong> is visible (Ctrl+Shift+B or Cmd+Shift+B).</li>
              <li>Drag the <strong>Play Snakey</strong> button to your Bookmarks Bar.</li>
              <li>Open any website (e.g. Wikipedia) and click the bookmarked link!</li>
            </ol>
          </div>

          <div className="flex flex-col items-center justify-center shrink-0 w-full lg:w-auto">
            <a
              ref={bookmarkletRef}
              href="#"
              draggable="true"
              onClick={(e) => {
                e.preventDefault();
                alert('Jangan diklik langsung! Tarik (drag) tombol ini ke bilah bookmark (bookmarks bar) browser Anda.');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-grab active:cursor-grabbing text-sm border border-indigo-400/20"
            >
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              Play Snakey
            </a>
            <span className="text-[10px] text-gray-400 mt-2 font-medium">← Drag this to your bookmarks bar</span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <strong>Security Notice (CSPs):</strong> Some websites with very strict security policies (like GitHub, LinkedIn, or Google Search) block external scripts from loading via bookmarklets. If the bookmarklet doesn't load on a specific site, you can install the official Chrome/Firefox extension instead.
          </div>
        </div>
      </div>

      {/* Extension Download Section (Full width) */}
      <div id="extension-section" className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 md:col-span-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-3 text-gray-900">Download Snakey Extension</h2>
        <p className="text-gray-600 leading-relaxed text-sm mb-6">
          Untuk pengalaman bermain yang lancar dan permanen di semua situs web (termasuk GitHub, LinkedIn, dan Google Search yang memiliki proteksi keamanan ketat), Anda dapat mengunduh dan memasang ekstensi browser Snakey secara langsung.
        </p>

        {/* Browser Tabs/Columns for Chrome/Chromium and Firefox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chromium Section */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🌐</span>
                <h3 className="font-bold text-gray-800 text-base">Google Chrome / Chromium</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Kompatibel dengan Google Chrome, Microsoft Edge, Brave, Opera, dan browser berbasis Chromium lainnya.
              </p>
              <h4 className="font-semibold text-xs text-gray-700 mb-2">Langkah Pemasangan:</h4>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-2 mb-6">
                <li>Unduh file ekstensi <strong className="text-slate-800">snakey-chrome.zip</strong> menggunakan tombol di bawah.</li>
                <li>Ekstrak file ZIP tersebut ke sebuah folder di komputer Anda.</li>
                <li>Buka halaman ekstensi browser dengan mengetik <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-600">chrome://extensions</code> di address bar.</li>
                <li>Aktifkan opsi <strong className="text-slate-800">Developer Mode</strong> (Mode Pengembang) di sudut kanan atas.</li>
                <li>Klik tombol <strong className="text-slate-800">Load unpacked</strong> (Muat yang belum dikemas) di sudut kiri atas.</li>
                <li>Pilih folder hasil ekstrak tadi (folder yang berisi file <code className="font-mono text-[11px]">manifest.json</code>).</li>
                <li>Selesai! Klik ikon ekstensi di pojok kanan atas browser dan sematkan (pin) Snakey untuk akses cepat.</li>
              </ol>
            </div>
            <a
              href="/extension/snakey-chrome.zip"
              download
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs border border-indigo-400/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Ekstensi Chrome (.zip)
            </a>
          </div>

          {/* Firefox Section */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🦊</span>
                <h3 className="font-bold text-gray-800 text-base">Mozilla Firefox</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Kompatibel dengan semua versi desktop Mozilla Firefox.
              </p>
              <h4 className="font-semibold text-xs text-gray-700 mb-2">Langkah Pemasangan:</h4>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-2 mb-6">
                <li>Unduh file ekstensi <strong className="text-slate-800">snakey-firefox.zip</strong> menggunakan tombol di bawah.</li>
                <li>Buka Firefox lalu ketik <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px] text-orange-600">about:debugging</code> di address bar.</li>
                <li>Klik menu <strong className="text-slate-800">This Firefox</strong> (Firefox Ini) di panel sebelah kiri.</li>
                <li>Klik tombol <strong className="text-slate-800">Load Temporary Add-on...</strong> (Muat Pengaya Sementara...).</li>
                <li>Pilih file ZIP yang baru saja Anda unduh.</li>
                <li>Selesai! Ekstensi Snakey akan aktif dan siap dimainkan dengan mengklik ikonnya.</li>
                <li className="text-amber-700 font-medium list-none mt-2 text-[11px] bg-amber-50 p-2 rounded border border-amber-100">
                  ⚠️ <em>Catatan Firefox: Ekstensi sementara ini akan otomatis terhapus saat Firefox ditutup. Anda perlu memuatnya kembali saat membuka ulang browser.</em>
                </li>
              </ol>
            </div>
            <a
              href="/extension/snakey-firefox.zip"
              download
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md transition-all text-xs border border-orange-400/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Ekstensi Firefox (.zip)
            </a>
          </div>
        </div>

        {/* Detailed Permissions Clarification */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <div className="flex gap-2.5 items-start">
            <svg className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Informasi Hak Akses (Permissions Info):</h4>
              <p className="text-gray-600 mb-2 leading-relaxed">
                Saat memasang ekstensi ini, browser Anda mungkin menampilkan peringatan bahwa ekstensi membutuhkan izin untuk <strong>"membaca dan mengubah semua data Anda pada semua situs web"</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Izin ini <strong>sepenuhnya aman</strong> dan diperlukan oleh Snakey untuk mendeteksi elemen-elemen HTML di halaman situs web yang sedang Anda kunjungi (sebagai target makanan ular) serta menampilkan canvas game di atas konten situs tersebut secara mulus. Ekstensi ini berjalan 100% secara lokal di browser Anda dan <strong>tidak akan pernah merekam atau mengirimkan informasi pribadi apa pun</strong> ke server eksternal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Playground (Full width) */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 md:col-span-2">
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
