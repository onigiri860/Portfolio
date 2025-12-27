import React from 'react';

const works = [
  {
    id: 1,
    title: 'Unity × Python リアルタイム連携システム',
    description: 'UnityとPythonを連携させたリアルタイムシステムを中心に研究・開発を行っています。3D空間内で、研究内容を建物ごとに閲覧できるインタラクティブなポートフォリオを制作中です。',
    tags: ['Research', '3D Dev'],
    colors: {
      tags: ['bg-blue-900/30 text-blue-300 border-blue-900', 'bg-purple-900/30 text-purple-300 border-purple-900']
    }
  },
  // 表示確認用にダミーデータを追加（2つ並ぶとSkillsっぽさが確認できます）
  {
    id: 2,
    title: 'Personal Portfolio (This Site)',
    description: 'Next.js, Tailwind CSS, Three.js を使用して構築した個人ポートフォリオサイトです。3Dモデルの表示とレスポンシブデザインに対応しています。',
    tags: ['Web Dev', 'React'],
    colors: {
      tags: ['bg-green-900/30 text-green-300 border-green-900', 'bg-blue-900/30 text-blue-300 border-blue-900']
    }
  },
];

export default function Works() {
  return (
    <section id="works" className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        Works
      </h3>
      
      {/* Skillsと同じように md:grid-cols-2 (2列) に変更 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {works.map((work) => (
          <div 
            key={work.id} 
            // Skillsと同じクラス構成に変更 (bg-gray-800, hover:bg-gray-700など)
            className="flex flex-col p-5 bg-gray-800 rounded-lg border border-gray-700/50 hover:bg-gray-700 transition-colors"
          >
            <h4 className="text-lg font-bold mb-2 text-gray-100">{work.title}</h4>
            
            {/* 説明文は長くなりすぎないように文字サイズ調整 */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
              {work.description}
            </p>
            
            <div className="flex gap-2 mt-auto">
              {work.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-[10px] rounded border ${work.colors.tags[index] || 'bg-gray-700 text-gray-300 border-gray-600'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}