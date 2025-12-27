'use client';

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

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* ■ ナビゲーションバー */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tighter">onigiri860 Portfolio</h1>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setProfileOpen(true)}
            className="text-gray-400 font-bold hover:text-white transition-colors text-sm"
          >
            Profile
          </button>
          <button 
            onClick={toggleMode}
            className={`${
              is3DMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-105`}
          >
            {is3DMode ? 'Exit 3D' : 'Enter 3D World'}
          </button>
        </div>
      </nav>

      {/* ■ メインコンテンツ */}
      <div className="pt-24 px-6 max-w-5xl mx-auto pb-20">

        {is3DMode ? (
          /* === 3Dモード === */
          <div className="w-full h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative animate-fade-in">
             <Scene />
             
             <div className="absolute bottom-6 left-6 pointer-events-none">
               <div className="bg-black/60 backdrop-blur text-white p-4 rounded-xl border border-white/10">
                 <p className="text-sm font-bold text-blue-400">Controls</p>
                 <p className="text-xs text-gray-300">左クリック: 回転 / 右クリック: 移動 / ホイール: 拡大</p>
               </div>
             </div>
          </div>
        ) : (
          /* === 2Dモード === */
          <div className="space-y-16 animate-fade-in">
            
            {/* Header / Hero Section */}
            <section className="text-center py-20">
              <img 
                src="/Portfolio/images/onigiri860.jpg" 
                alt="Profile Icon" 
                className="w-32 h-32 rounded-full mx-auto mb-6 shadow-xl shadow-blue-500/20 object-cover border-4 border-gray-800"
              />
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Welcome to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  onigiri860's Portfolio
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                🍙
              </p>
            </section>

            {/* 各セクションをコンポーネントとして配置 */}
            <Skills />
            
            <Works />

            <Experience />

            <Volleyball />

            <Contact />

          </div>
        )}
      </div>

      {/* プロフィールモーダル */}
      {isProfileOpen && <ProfileModal />}

    </main>
  );
}