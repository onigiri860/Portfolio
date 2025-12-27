'use client';

import React, { useState } from 'react';
import Scene from '../components/Scene';
import { useStore } from '../store/useStore';
import ProfileModal from '../components/ProfileModal';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Works from '../components/Works';
import Volleyball from '../components/Volleyball';
import Contact from '../components/Contact';

export default function Home() {
  const { is3DMode, toggleMode, isProfileOpen, setProfileOpen } = useStore();
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const closeModal = () => setActiveSection(null);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'skills': return <Skills />;
      case 'works': return <Works />;
      case 'experience': return <Experience />;
      case 'volleyball': return <Volleyball />;
      default: return null;
    }
  };

  return (
    // ■ 背景画像の設定
    <main 
      className="min-h-screen relative font-sans text-gray-800 selection:bg-amber-500 selection:text-white bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/Portfolio/images/background_1.jpg')" }}
    >
      
      {/* ■ 白いオーバーレイ（全体を少し明るく、かつ文字を見やすくする） */}
      <div className="absolute inset-0 bg-white/30 z-0"></div>

      {/* ■ コンテンツ全体 */}
      <div className="relative z-10">

        {/* ナビゲーションバー (白のすりガラス) */}
        <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-white/40 px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold tracking-tighter cursor-pointer text-gray-900 hover:text-sky-600 transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            onigiri860
          </h1>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setProfileOpen(true)}
              className="text-gray-600 font-bold hover:text-sky-600 transition-colors text-sm"
            >
              Profile
            </button>
            <button 
              onClick={toggleMode}
              className={`${
                is3DMode ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-600 hover:bg-sky-500'
              } text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-sky-500/30 transform hover:scale-105 border border-white/20`}
            >
              {is3DMode ? 'Exit 3D' : 'Enter 3D World'}
            </button>
          </div>
        </nav>

        {/* メインエリア */}
        <div className="pt-28 px-6 max-w-6xl mx-auto pb-20">

          {is3DMode ? (
            /* === 3Dモード === */
            // 3D表示の周りも明るい白枠に変更
            <div className="w-full h-[80vh] bg-white/20 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/50 relative animate-fade-in">
               <Scene />
               <div className="absolute bottom-6 left-6 pointer-events-none">
                 <div className="bg-white/80 backdrop-blur text-gray-800 p-4 rounded-xl border border-white/50 shadow-lg">
                   <p className="text-sm font-bold text-sky-600">Controls</p>
                   <p className="text-xs text-gray-600">左クリック: 回転 / 右クリック: 移動 / ホイール: 拡大</p>
                 </div>
               </div>
            </div>
          ) : (
            /* === 2Dモード (Bento Grid) === */
            <div className="animate-fade-in space-y-12">
              
              {/* ヒーローセクション */}
              <section className="text-center mb-12">
                <div className="relative inline-block group">
                   <img 
                     src="/Portfolio/images/onigiri860.jpg" 
                     alt="Profile Icon" 
                     className="w-28 h-28 rounded-full mx-auto mb-6 shadow-2xl border-4 border-white object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                     onClick={() => setProfileOpen(true)}
                   />
                   <span className="absolute bottom-6 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-sm text-gray-900">
                  Welcome to <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-amber-500 to-orange-500">
                    onigiri860's Portfolio
                  </span>
                </h2>
                <p className="text-gray-700 max-w-xl mx-auto font-bold bg-white/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                  🍙
                </p>
              </section>

              {/* グリッドレイアウト */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Skills Card (アイコン削除) */}
                <div 
                  onClick={() => setActiveSection('skills')}
                  className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-sky-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-sky-600 mb-2">Skills</h3>
                    <p className="text-gray-600 line-clamp-3 font-medium">
                      使用可能なプログラミング言語や技術スタック。<br/>
                      Unity (C#), Python, Web (React) など。
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                    View Details <span>→</span>
                  </div>
                </div>

                {/* 2. Works Card (アイコン削除) */}
                <div 
                  onClick={() => setActiveSection('works')}
                  className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-amber-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">Works</h3>
                    <p className="text-gray-600 line-clamp-3 font-medium">
                      Unity × Python連携システムの研究開発。<br/>
                      3D空間ポートフォリオや、個人開発のゲームプロジェクト。
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-amber-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                    View Projects <span>→</span>
                  </div>
                </div>

                {/* 3. Experience Card (アイコン削除) */}
                <div 
                  onClick={() => setActiveSection('experience')}
                  className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-emerald-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-600 mb-2">Experience</h3>
                    <p className="text-gray-600 line-clamp-3 font-medium">
                      2022年からの経歴。<br/>
                      大学の経歴や大学でのWebアプリケーション開発、その他の活動など。
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                    See Timeline <span>→</span>
                  </div>
                </div>

                {/* 4. Volleyball Card (アイコン削除) */}
                <div 
                  onClick={() => setActiveSection('volleyball')}
                  className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-orange-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-2">Volleyball</h3>
                    <p className="text-gray-600 line-clamp-3 font-medium">
                      趣味であるバレーボールについての紹介。<br/>
                      今までの活動や観戦記録。
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                    Open Gallery <span>→</span>
                  </div>
                </div>

              </div>
              
              {/* Contact (Footer) */}
              <Contact />

            </div>
          )}
        </div>

        {/* 詳細モーダル */}
        {activeSection && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>
            
            {/* モーダルの中身は読みやすさ重視で少し暗めの背景のままにするか、ここも白にするか。
                今回は中身のコンポーネント(Volleyball.tsxなど)が白文字前提で作られているため、
                モーダル背景は「黒」のままにして、コンテンツを見やすくします。 */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in-up custom-scrollbar">
              <button 
                onClick={closeModal}
                className="sticky top-4 right-4 float-right z-10 bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 border border-gray-600 shadow-lg"
              >
                ✕
              </button>
              <div className="p-2 md:p-6">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        )}

        {/* プロフィールモーダル */}
        {isProfileOpen && <ProfileModal />}

      </div>
    </main>
  );
}