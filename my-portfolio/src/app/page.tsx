'use client';

import Scene from '../components/Scene';
import { useStore } from '../store/useStore';
import ProfileModal from '../components/ProfileModal';
// もし以前作った ProjectCard などがあればここで import してください
// import { projects } from '../data/projects';
// import ProjectCard from '../components/ProjectCard';

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
            {is3DMode ? 'Exit 3D' : 'Enter 3D World 🚀'}
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
          /* === 2Dモード (HTMLの内容を移植) === */
          <div className="space-y-16 animate-fade-in">
            
            {/* Header / Hero Section */}
            <section className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full mx-auto mb-6 shadow-xl shadow-blue-500/20"></div>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Engineering <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Real-time Systems
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                UnityとPythonを連携させたリアルタイム双方向通信およびパラメータ最適化に関心を持ち、研究・開発を行っています。
              </p>
            </section>

            {/* Skills Section */}
            <section id="skills" className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
                ⚡ Skills
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Python', desc: '最適化処理、データ解析、Unity連携' },
                  { name: 'Unity', desc: '3Dシーン生成、外部制御 (C#)' },
                  { name: 'Optuna', desc: 'パラメータ最適化' },
                  { name: 'Communication', desc: 'Socket / Pipe 双方向通信' },
                  { name: 'Tools', desc: 'Git / GitHub / Docker' },
                ].map((skill) => (
                  <li key={skill.name} className="flex flex-col p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="font-bold text-lg text-gray-200">{skill.name}</span>
                    <span className="text-sm text-gray-400">{skill.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Works Section */}
            <section id="works">
              <h3 className="text-2xl font-bold mb-6 text-purple-400">🛠 Works</h3>
              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors">
                <h4 className="text-xl font-bold mb-3">Unity × Python リアルタイム連携システム</h4>
                <p className="text-gray-400 leading-relaxed mb-4">
                  UnityとPythonを連携させたリアルタイムシステムを中心に研究・開発を行っています。
                  3D空間内で、研究内容を建物ごとに閲覧できるインタラクティブなポートフォリオを制作中です。
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-900">Research</span>
                  <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-900">3D Dev</span>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="text-center py-10 border-t border-gray-800">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <a 
                href="https://github.com/onigiri860" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-mono"
              >
                github.com/onigiri860 ↗
              </a>
              <p className="text-gray-600 text-xs mt-8">© 2025 onigiri860</p>
            </section>

          </div>
        )}
      </div>

      {/* プロフィールモーダル */}
      {isProfileOpen && <ProfileModal />}

    </main>
  );
}