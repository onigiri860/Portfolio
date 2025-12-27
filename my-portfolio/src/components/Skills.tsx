import React from 'react';

const skills = [
  { name: 'Python', desc: '最適化処理、データ解析、Unity連携' },
  { name: 'Unity', desc: '3Dシーン生成、外部制御 (C#)' },
  { name: 'Optuna', desc: 'パラメータ最適化' },
  { name: 'Communication', desc: 'Socket / Pipe 双方向通信' },
  { name: 'Tools', desc: 'Git / GitHub / Docker' },
];

export default function Skills() {
  return (
    <section id="skills" className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
        Skills
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <li key={skill.name} className="flex flex-col p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700/50">
            <span className="font-bold text-lg text-gray-200">{skill.name}</span>
            <span className="text-sm text-gray-400">{skill.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}