import React from 'react';

const skills = [
  // 1. 研究・開発の核となる技術
  { 
    name: 'Python', 
    desc: '数値計算(NumPy)、パラメータ最適化(Optuna)、Unityとのソケット通信処理など。' 
  },
  { 
    name: 'Unity (C#)', 
    desc: '3Dシミュレーションおよび可視化システムの構築。Python連携によるリアルタイム制御。' 
  },
  
  // 2. Web開発技術 (Portfolio, shared-calendar)
  { 
    name: 'Next.js / React', 
    desc: 'コンポーネント指向のUI構築。SSG/SSRを活用したWebアプリケーション開発。' 
  },
  { 
    name: 'TypeScript', 
    desc: '型安全性重視の堅牢なコード記述。React開発における標準言語として使用。' 
  },
  { 
    name: 'Three.js / R3F', 
    desc: 'React Three Fiberを用いたWebブラウザ上での3D表現・演出の実装。' 
  },

  // 3. チーム開発・ツール (T-lab, prapro-ou)
  { 
    name: 'Git / GitHub', 
    desc: 'チーム開発におけるバージョン管理、プルリクエストベースの開発フロー。' 
  },
  { 
    name: 'Socket / Pipe', 
    desc: '異なる言語間(Python⇔Unity等)をつなぐリアルタイム双方向通信の実装。' 
  },
  { 
    name: 'Tailwind CSS', 
    desc: 'ユーティリティファーストなスタイリング。レスポンシブデザインの高速な構築。' 
  },
];

export default function Skills() {
  return (
    <section id="skills" className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-sky-600 flex items-center gap-2">
        Skills
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <li key={skill.name} className="flex flex-col p-5 bg-white/60 rounded-xl hover:bg-white transition-colors border border-gray-200 shadow-sm hover:shadow-md hover:border-sky-200">
            <span className="font-bold text-lg text-gray-800 mb-1">{skill.name}</span>
            <span className="text-sm text-gray-600 leading-snug">{skill.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}