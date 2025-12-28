'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Scene from '../components/Scene';
import { useStore } from '../store/useStore';
import ProfileModal from '../components/ProfileModal';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Works from '../components/Works';
import Volleyball from '../components/Volleyball';
import Contact from '../components/Contact';

// --- シンプルなジョイスティックコンポーネント ---
const Joystick = ({ onMove }: { onMove: (x: number, y: number) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setActive(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!active) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    
    // 半径制限 (50px)
    const maxDist = 40;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    const constrainedX = Math.cos(angle) * distance;
    const constrainedY = Math.sin(angle) * distance;

    setPosition({ x: constrainedX, y: constrainedY });
    
    // -1 ~ 1 に正規化してコールバック (Yは上がプラスになるように反転)
    onMove(constrainedX / maxDist, -(constrainedY / maxDist));
  };

  const handleEnd = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onMove(0, 0);
  };

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // キャンバスの視点移動と干渉しないように
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  // Mouse Events (PCでのデバッグ用など)
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    // マウスロック中はカーソルが見えないので基本使わないが、念の為
    handleStart(e.clientX, e.clientY);
  };

  // Global listeners for drag outside
  useEffect(() => {
    const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
      if (!active) return;
      let cx, cy;
      if ('touches' in e) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      // handleMove logic embedded here to avoid closure staleness or refactor handleMove to be pure
      // For simplicity, we just use the component state update in render loop if using local handlers, 
      // but for global window drag, we need ref access. 
      // Simplified: Since Joystick is small, local touchmove on div is usually enough if finger starts inside.
    };
    const handleGlobalEnd = () => handleEnd();

    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('mouseup', handleGlobalEnd);
    return () => {
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('mouseup', handleGlobalEnd);
    };
  }, [active]);

  return (
    <div 
      className="absolute bottom-8 left-8 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border border-white/30 z-30 touch-none flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
    >
      <div 
        ref={knobRef}
        className="w-10 h-10 bg-white/80 rounded-full shadow-lg pointer-events-none"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      />
    </div>
  );
};


export default function Home() {
  const { is3DMode, toggleMode, isProfileOpen, setProfileOpen } = useStore();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const closeModal = () => setActiveSection(null);

  // ジョイスティックの状態を管理するRef (再レンダリングを避けて高速に渡す)
  const joystickRef = useRef({ x: 0, y: 0 });

  const handleJoystickMove = (x: number, y: number) => {
    joystickRef.current = { x, y };
  };

  const handleStart = (mode: '2d' | '3d') => {
    if (mode === '3d' && !is3DMode) toggleMode();
    else if (mode === '2d' && is3DMode) toggleMode();
    setHasStarted(true);
  };

  const handleSectionSelect = (sectionName: string) => {
    setActiveSection(sectionName);
  };

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
    <main 
      className="min-h-screen relative font-sans text-gray-800 selection:bg-amber-500 selection:text-white bg-fixed bg-cover bg-center touch-manipulation" // touch-manipulation追加
      style={{ backgroundImage: "url('/Portfolio/images/background_1.jpg')" }}
    >
      
      {/* === Welcome画面 (hasStartedがfalseの時だけ表示) === */}
      {!hasStarted && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <Image 
                src="/Portfolio/images/onigiri860.jpg" 
                alt="Profile Icon" 
                fill
                className="rounded-full shadow-2xl border-4 border-white object-cover"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-400">
                onigiri860's Portfolio
              </span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-bold">
              どっちか選んでね<br/>(後から違うほうも見れる)
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* 2D Button */}
            <button 
              onClick={() => handleStart('2d')}
              className="flex-1 group relative bg-white/90 hover:bg-white p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center gap-4 text-center border-4 border-transparent hover:border-sky-400"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors">通常Web</h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">ジャンルごとに分類分けされた<br/>ポートフォリオサイト</p>
              </div>
            </button>

            {/* 3D Button */}
            <button 
              onClick={() => handleStart('3d')}
              className="flex-1 group relative bg-gray-800/90 hover:bg-gray-800 p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center gap-4 text-center border-4 border-transparent hover:border-amber-500"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300"></div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors">3D World</h3>
                <p className="text-gray-400 text-sm mt-2 font-medium">3D都市探索による<br/>没入型ポートフォリオサイト</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      {hasStarted && (
        <>
          <div className="absolute inset-0 bg-white/30 z-0 animate-fade-in"></div>
          <div className="relative z-10 animate-fade-in">
            <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-white/40 px-6 py-4 flex justify-between items-center shadow-sm">
              <h1 className="text-xl font-bold tracking-tighter cursor-pointer text-gray-900 hover:text-sky-600 transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>onigiri860</h1>
              <div className="flex gap-4 items-center">
                <button onClick={() => setProfileOpen(true)} className="text-gray-600 font-bold hover:text-sky-600 transition-colors text-sm">Profile</button>
                <button onClick={toggleMode} className={`${is3DMode ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-600 hover:bg-sky-500'} text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-sky-500/30 transform hover:scale-105 border border-white/20`}>
                  {is3DMode ? 'Exit World' : 'Enter 3D World'}
                </button>
              </div>
            </nav>

            <div className="pt-28 px-6 max-w-6xl mx-auto pb-20">
              {is3DMode ? (
                /* === 3Dモード (FPS Style) === */
                <div 
                  id="canvas-container"
                  // ★ カーソル制御をインラインスタイルで強制する
                  style={{ cursor: activeSection ? 'auto' : 'none' }}
                  className={`w-full h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative animate-fade-in group`}
                >
                   {/* クロスヘア (モーダルが開いていない時のみ表示) */}
                   {!activeSection && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-20 opacity-80 mix-blend-difference">
                       <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white"></div>
                       <div className="absolute top-0 left-1/2 w-[2px] h-4 bg-white"></div>
                     </div>
                   )}

                   {/* ジョイスティック (モーダルが開いていない時のみ表示、かつタッチデバイス想定だが常時表示でもOK) */}
                   {!activeSection && (
                      <div className="md:hidden"> {/* PC画面では隠す場合は md:hidden */}
                         <Joystick onMove={handleJoystickMove} />
                      </div>
                   )}

                   <Scene 
                     onSelectSection={handleSectionSelect} 
                     isModalOpen={!!activeSection} 
                     joystickRef={joystickRef}
                   />
                   
                   {/* 操作説明 */}
                   {!activeSection && (
                     <div className="absolute bottom-6 left-6 pointer-events-none z-10 hidden md:block">
                       <div className="bg-black/60 backdrop-blur text-white p-4 rounded-xl border border-white/20 shadow-lg">
                         <p className="text-sm font-bold text-sky-400 flex items-center gap-2">
                           Exploration Mode
                         </p>
                         <ul className="text-xs text-gray-300 mt-2 space-y-1 font-mono">
                           <li>[Click]  操作開始 / ロック</li>
                           <li>[W,A,S,D]  移動</li>
                           <li>[Mouse]  視点移動</li>
                           <li>[Click Building] 詳細を見る</li>
                           <li>[ESC]    マウスロック解除</li>
                         </ul>
                       </div>
                     </div>
                   )}
                   {/* スマホ用説明 */}
                   {!activeSection && (
                     <div className="absolute top-4 right-4 pointer-events-none z-10 md:hidden">
                       <div className="bg-black/60 backdrop-blur text-white px-3 py-2 rounded-lg border border-white/20">
                         <p className="text-xs text-gray-300">
                           Left Stick: Move<br/>Screen Drag: Look
                         </p>
                       </div>
                     </div>
                   )}
                </div>
              ) : (
                /* === 2Dモード (Bento Grid) === */
                <div className="animate-fade-in space-y-12">
                  <section className="text-center mb-12">
                    <div className="relative inline-block group">
                       <div className="w-28 h-28 mx-auto mb-6 relative">
                         <Image 
                           src="/Portfolio/images/onigiri860.jpg" 
                           alt="Profile Icon" 
                           fill
                           className="rounded-full shadow-2xl border-4 border-white object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                           onClick={() => setProfileOpen(true)}
                         />
                       </div>
                       <span className="absolute bottom-6 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full z-10"></span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-sm text-gray-900">
                      なんちゃってサイト<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-amber-500 to-orange-500">
                        onigiri860's Portfolio
                      </span>
                    </h2>
                    <p className="text-gray-700 max-w-xl mx-auto font-bold bg-white/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                      🍙
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div onClick={() => setActiveSection('skills')} className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-sky-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl">
                      <div><h3 className="text-2xl font-bold text-sky-600 mb-2">Skills</h3>
                        <p className="text-gray-600 line-clamp-3 font-medium">
                          使用可能なプログラミング言語や技術。<br/>Unity (C#), Python, Web (React) など。
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sky-600 text-sm font-bold group-hover:translate-x-2 transition-transform">View Details <span>→</span></div>
                    </div>
                    {/* Works */}
                    <div onClick={() => setActiveSection('works')} className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-amber-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl">
                      <div><h3 className="text-2xl font-bold text-amber-600 mb-2">Works</h3>
                        <p className="text-gray-600 line-clamp-3 font-medium">
                          Unity × Python連携システムの研究開発。<br/> 3D空間ポートフォリオや、個人開発のゲームプロジェクト。
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-amber-600 text-sm font-bold group-hover:translate-x-2 transition-transform">View Projects <span>→</span></div>
                    </div>
                    {/* Experience */}
                    <div onClick={() => setActiveSection('experience')} className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-emerald-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl">
                      <div><h3 className="text-2xl font-bold text-emerald-600 mb-2">Experience</h3>
                        <p className="text-gray-600 line-clamp-3 font-medium">
                          2022年からの経歴。<br/>大学の経歴や大学でのWebアプリケーション開発、その他の活動など。
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold group-hover:translate-x-2 transition-transform">See Timeline <span>→</span></div>
                    </div>
                    {/* Volleyball */}
                    <div onClick={() => setActiveSection('volleyball')} className="group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 hover:border-orange-500 hover:bg-white/90 transition-all cursor-pointer h-64 flex flex-col justify-between shadow-lg hover:shadow-xl">
                      <div><h3 className="text-2xl font-bold text-orange-600 mb-2">Volleyball</h3>
                        <p className="text-gray-600 line-clamp-3 font-medium">
                          趣味であるバレーボールについての紹介。<br/>今までの活動や観戦記録。
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600 text-sm font-bold group-hover:translate-x-2 transition-transform">Open Gallery <span>→</span></div>
                    </div>
                  </div>
                  <Contact />
                </div>
              )}
            </div>

            {/* モーダル群 (2D/3D共通) */}
            {activeSection && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in-up custom-scrollbar">
                  <button onClick={closeModal} className="sticky top-4 right-4 float-right z-10 bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 border border-gray-600 shadow-lg">✕</button>
                  <div className="p-2 md:p-6">{renderActiveSection()}</div>
                </div>
              </div>
            )}
            {isProfileOpen && <ProfileModal />}
          </div>
        </>
      )}
    </main>
  );
}