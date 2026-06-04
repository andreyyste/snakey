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
      <div className="glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-fixed to-[#e0e7ff] flex items-center justify-center text-primary shadow-lg border border-white/50 glow-blue group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-3xl">info</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">About the Project</h2>
        </div>
        <div className="space-y-4 text-on-surface-variant font-body-md text-sm leading-relaxed">
          <p>
            Snakey is an experimental web project blurring the lines between classic arcade gaming and modern web design. 
          </p>
          <p>
            Built with React and Phaser 3, it explores how HTML DOM elements and HTML5 Canvas can seamlessly coexist in a light, premium environment.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-fixed to-[#f3e8ff] flex items-center justify-center text-secondary shadow-lg border border-white/50 glow-purple group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-3xl">forum</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Get in Touch</h2>
        </div>
        <div className="space-y-4 text-on-surface-variant font-body-md text-sm leading-relaxed">
          <p>
            Have an idea to make this even crazier? Or found a bug where the snake ate your cursor? Let me know!
          </p>
          <ul className="space-y-3 pl-0 mt-6 list-none">
            <li className="flex items-center gap-3 bg-white/40 p-2.5 rounded-xl border border-white/60 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-base">mail</span>
              </span>
              <a href="mailto:manurungandre1927@gmail.com" className="hover:text-primary transition-colors font-medium">
                manurungandre1927@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3 bg-white/40 p-2.5 rounded-xl border border-white/60 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-base">language</span>
              </span>
              <a href="https://nre.codes" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                nre.codes
              </a>
            </li>
            <li className="flex items-center gap-3 bg-white/40 p-2.5 rounded-xl border border-white/60 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-base">alternate_email</span>
              </span>
              <a href="https://github.com/andreyyste" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                @andreyyste
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bookmarklet Section (Full width) */}
      <div id="bookmarklet-section" className="md:col-span-2 glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white shadow-xl border border-white/30 glow-purple group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-3xl">extension</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Snakey Bookmarklet</h2>
        </div>
        
        <p className="text-on-surface-variant font-body-md text-sm mb-8 max-w-2xl bg-white/30 p-4 rounded-2xl border border-white/50 leading-relaxed">
          Play Snakey on any webpage instantly! Drag the button below to your bookmark bar, then click it on any website to let the snake eat its elements.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-white/30 p-6 rounded-2xl border border-white/50">
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
              className="bg-gradient-to-r from-secondary to-primary text-white px-8 py-4 rounded-2xl font-mono text-xs uppercase shadow-[0_10px_25px_rgba(107,56,212,0.3)] hover:shadow-[0_15px_35px_rgba(107,56,212,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-grab active:cursor-grabbing border border-white/20"
            >
              <span className="material-symbols-outlined">drag_indicator</span>
              Play Snakey
            </a>
            <span className="text-[10px] text-gray-400 mt-2.5 font-medium">← Drag this to your bookmarks bar</span>
          </div>
        </div>

        {/* Security Warning Container */}
        <div className="glass-panel rounded-2xl p-6 border-orange-200/40 relative overflow-hidden mt-6">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-400/5 rounded-full blur-2xl"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
              <span className="material-symbols-outlined text-lg">security</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <h4 className="font-bold text-on-surface text-xs">Security Note (CSPs)</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Some websites with very strict security policies (like GitHub, LinkedIn, or Google Search) block external scripts from loading via bookmarklets. If the bookmarklet doesn't load on a specific site, you can install the official Chrome/Firefox extension instead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Download Section (Full width) */}
      <div id="extension-section" className="md:col-span-2 glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center text-emerald-600 shadow-lg border border-white/50 glow-blue">
            <span className="material-symbols-outlined text-3xl">download</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Download Snakey Extension</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm mb-8 max-w-2xl bg-white/30 p-4 rounded-2xl border border-white/50">
          Untuk pengalaman bermain yang lancar dan permanen di semua situs web (termasuk GitHub, LinkedIn, dan Google Search yang memiliki proteksi keamanan ketat), Anda dapat mengunduh dan memasang ekstensi browser Snakey secara langsung.
        </p>

        {/* Browser Tabs/Columns for Chrome/Chromium and Firefox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chromium Section */}
          <div className="bg-white/30 p-6 rounded-2xl border border-white/50 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">🌐</span>
                <h3 className="font-bold text-gray-800 text-base">Google Chrome / Chromium</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Kompatibel dengan Google Chrome, Microsoft Edge, Brave, Opera, dan browser berbasis Chromium lainnya.
              </p>
              <h4 className="font-semibold text-xs text-gray-700 mb-2.5">Langkah Pemasangan:</h4>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-2 mb-6">
                <li>Unduh file ekstensi <strong className="text-slate-800">snakey-chrome.zip</strong> menggunakan tombol di bawah.</li>
                <li>Ekstrak file ZIP tersebut ke sebuah folder di komputer Anda.</li>
                <li>Buka halaman ekstensi browser dengan mengetik <code className="bg-white/60 border border-white/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-600">chrome://extensions</code> di address bar.</li>
                <li>Aktifkan opsi <strong className="text-slate-800">Developer Mode</strong> (Mode Pengembang) di sudut kanan atas.</li>
                <li>Klik tombol <strong className="text-slate-800">Load unpacked</strong> (Muat yang belum dikemas) di sudut kiri atas.</li>
                <li>Pilih folder hasil ekstrak tadi (folder yang berisi file <code className="font-mono text-[11px]">manifest.json</code>).</li>
                <li>Selesai! Klik ikon ekstensi di pojok kanan atas browser dan sematkan (pin) Snakey untuk akses cepat.</li>
              </ol>
            </div>
            <a
              href="/extension/snakey-chrome.zip"
              download
              className="w-full bg-gradient-to-r from-primary to-[#004395] text-white py-4 rounded-2xl font-mono text-xs uppercase hover:shadow-lg hover:shadow-primary/30 transition-all flex justify-center items-center gap-2 border border-primary/20"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Unduh Ekstensi Chrome (.zip)
            </a>
          </div>

          {/* Firefox Section */}
          <div className="bg-white/30 p-6 rounded-2xl border border-white/50 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">🦊</span>
                <h3 className="font-bold text-gray-800 text-base">Mozilla Firefox</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Kompatibel dengan semua versi desktop Mozilla Firefox.
              </p>
              <h4 className="font-semibold text-xs text-gray-700 mb-2.5">Langkah Pemasangan:</h4>
              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-2 mb-6">
                <li>Unduh file ekstensi <strong className="text-slate-800">snakey-firefox.zip</strong> menggunakan tombol di bawah.</li>
                <li>Buka Firefox lalu ketik <code className="bg-white/60 border border-white/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-orange-600">about:debugging</code> di address bar.</li>
                <li>Klik menu <strong className="text-slate-800">This Firefox</strong> (Firefox Ini) di panel sebelah kiri.</li>
                <li>Klik tombol <strong className="text-slate-800">Load Temporary Add-on...</strong> (Muat Pengaya Sementara...).</li>
                <li>Pilih file ZIP yang baru saja Anda unduh.</li>
                <li>Selesai! Ekstensi Snakey akan aktif dan siap dimainkan dengan mengklik ikonnya.</li>
                <li className="text-amber-800 font-medium list-none mt-3.5 text-[11px] bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 leading-relaxed">
                  ⚠️ <em>Catatan Firefox: Ekstensi sementara ini akan otomatis terhapus saat Firefox ditutup. Anda perlu memuatnya kembali saat membuka ulang browser.</em>
                </li>
              </ol>
            </div>
            <a
              href="/extension/snakey-firefox.zip"
              download
              className="w-full bg-gradient-to-r from-secondary to-[#5516be] text-white py-4 rounded-2xl font-mono text-xs uppercase hover:shadow-lg hover:shadow-secondary/30 transition-all flex justify-center items-center gap-2 border border-secondary/20"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Unduh Ekstensi Firefox (.zip)
            </a>
          </div>
        </div>

        {/* Detailed Permissions Clarification Box */}
        <div className="glass-panel rounded-2xl p-6 border-outline-variant/20 relative overflow-hidden mt-6">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">info</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <h4 className="font-bold text-on-surface text-xs">Informasi Hak Akses (Permissions Info)</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Saat memasang ekstensi ini, browser Anda mungkin menampilkan peringatan bahwa ekstensi membutuhkan izin untuk <strong>"membaca dan mengubah semua data Anda pada semua situs web"</strong>. Izin ini <strong>sepenuhnya aman</strong> dan diperlukan oleh Snakey untuk mendeteksi elemen-elemen HTML di halaman situs web yang sedang Anda kunjungi (sebagai target makanan ular) serta menampilkan canvas game di atas konten situs tersebut secara mulus. Ekstensi ini berjalan 100% secara lokal di browser Anda dan <strong>tidak akan pernah merekam atau mengirimkan informasi pribadi apa pun</strong> ke server eksternal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Playground (Full width) */}
      <div className="md:col-span-2 glass-panel rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 shadow-lg border border-white/50 glow-purple group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-3xl">science</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Sandbox Playground</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm mb-8 max-w-2xl bg-white/30 p-4 rounded-2xl border border-white/50">
          Use this interactive zone to test the custom eating animations of different HTML elements. Let the snake escape and head down here!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          {/* Dropdown Select */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Dropdown (select)</label>
            <select className="w-full bg-white/50 border border-white/80 rounded-xl p-2.5 text-gray-800 outline-none shadow-sm focus:border-purple-400">
              <option>🍔 Burger Option</option>
              <option>🍕 Pizza Option</option>
              <option>🍣 Sushi Option</option>
              <option>🍦 Ice Cream Option</option>
            </select>
          </div>

          {/* Text Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Text Input (input)</label>
            <input type="text" placeholder="Chomp me..." className="w-full bg-white/50 border border-white/80 rounded-xl p-2.5 text-gray-800 outline-none focus:border-purple-400 shadow-sm" />
          </div>

          {/* Progress / Meter */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Progress Bar (progress)</label>
            <progress value="75" max="100" className="w-full h-3 rounded-lg overflow-hidden accent-purple-600 bg-gray-200/50"></progress>
            <label className="font-semibold text-gray-700 mt-1 text-xs">Meter Indicator (meter)</label>
            <meter value="0.6" className="w-full h-4 accent-green-600"></meter>
          </div>

          {/* Checkbox and Radio */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Toggle Buttons</label>
            <div className="flex gap-4 items-center mt-1">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-white/85 bg-white/50 rounded" />
                Checkbox
              </label>
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input type="radio" defaultChecked className="w-4 h-4 text-purple-600 border-white/85 bg-white/50" />
                Radio
              </label>
            </div>
          </div>

          {/* Audio controls */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Audio Widget (audio)</label>
            <audio controls className="w-full h-10 rounded-xl shadow-sm border border-white/80 bg-white/50">
              <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
            </audio>
          </div>

          {/* Iframe */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Embedded Shell (iframe)</label>
            <iframe srcDoc="<body style='margin:0;font-family:sans-serif;background:#faf5ff;display:flex;align-items:center;justify-content:center;color:#6b21a8;font-weight:bold;height:100%;font-size:12px;'>Embedded Page</body>" className="w-full h-16 border border-purple-200/50 bg-white/50 rounded-xl overflow-hidden shadow-sm" title="Test Iframe"></iframe>
          </div>
        </div>

        {/* Divider HR */}
        <div className="mt-8">
          <label className="font-semibold text-gray-400 block text-xs mb-2">Horizontal Rule (hr)</label>
          <hr className="border-t-2 border-purple-100/50" />
        </div>
      </div>
    </motion.div>
  );
}
