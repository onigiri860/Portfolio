'use client';

import { useStore } from '../store/useStore';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function ProfileModal() {
  const { setProfileOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 開いている間は背景スクロール禁止
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!mounted) return null;

  // createPortalを使って、強制的に画面の一番手前に表示する
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4"
      onClick={() => setProfileOpen(false)}
    >
      {/* 白いカード部分 */}
      <div 
        className="bg-white text-gray-900 w-full max-w-lg rounded-2xl p-8 shadow-2xl relative mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button 
          onClick={() => setProfileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ✕
        </button>

        {/* プロフィール中身 */}
        <div className="text-center">
          {/* アイコン画像 (ダミー) */}
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
            P
          </div>
          
          <h2 className="text-2xl font-bold mb-1">onigiri860</h2>
          <p className="text-gray-500 text-sm mb-6">Engineer / Researcher</p>

          <div className="text-left space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div>
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-1">About</h3>
              <p className="text-sm leading-relaxed text-gray-700">
                UnityとPythonを連携させたリアルタイムシステムの開発を行っています。
                新しい技術でインタラクティブな体験を作るのが好きです。
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Connect</h3>
              <a 
                href="https://github.com/onigiri860" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
              >
                GitHub Profile ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}