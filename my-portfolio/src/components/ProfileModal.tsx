import React from 'react';
import { useStore } from '../store/useStore';

export default function ProfileModal() {
  const { setProfileOpen } = useStore();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* 背景の黒いオーバーレイ（少し薄めに） */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setProfileOpen(false)}
      ></div>

      {/* モーダル本体 (白のすりガラス) */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up">
        
        {/* 閉じるボタン */}
        <button 
          onClick={() => setProfileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ✕
        </button>

        <div className="text-center">
          {/* プロフィール画像 */}
          <img 
            src="/Portfolio/images/onigiri860.jpg" 
            alt="Profile" 
            className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
          />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">onigiri860</h2>
          <p className="text-sky-600 text-sm font-mono font-bold mb-6">岡山大学 工学部 情報工学コース</p>
          
          <p className="text-gray-600 leading-relaxed text-sm mb-8 text-left font-medium bg-white/50 p-4 rounded-xl border border-gray-100">
            バレーボールが好きな大学生です。<br />
            Web開発を中心にプログラミングをしてます。<br />
          </p>

          {/* SNSアイコンリンク (ライトテーマ) */}
          <div className="flex justify-center items-center gap-6 mb-8 pt-6 border-t border-gray-200">
            
            {/* GitHub */}
            <a 
              href="https://github.com/onigiri860" 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col items-center gap-1 text-gray-500 hover:text-sky-600 transition-colors"
            >
              <div className="p-2.5 bg-white rounded-full border border-gray-200 shadow-sm group-hover:bg-sky-50 group-hover:border-sky-200 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold">GitHub</span>
            </a>

            {/* X (Twitter) */}
            <a 
              href="https://x.com/your_x_id" // ★書き換えてください
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col items-center gap-1 text-gray-500 hover:text-sky-600 transition-colors"
            >
              <div className="p-2.5 bg-white rounded-full border border-gray-200 shadow-sm group-hover:bg-sky-50 group-hover:border-sky-200 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold">X / Twitter</span>
            </a>

            {/* Email */}
            <a 
              href="mailto:your_email@example.com" // ★書き換えてください
              className="group flex flex-col items-center gap-1 text-gray-500 hover:text-sky-600 transition-colors"
            >
              <div className="p-2.5 bg-white rounded-full border border-gray-200 shadow-sm group-hover:bg-sky-50 group-hover:border-sky-200 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold">Email</span>
            </a>

          </div>

          <button 
            onClick={() => setProfileOpen(false)}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors text-sm font-bold border border-gray-300 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}