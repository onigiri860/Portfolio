import React from 'react';

const experiences = [
  {
    id: 1,
    date: '2026.04',
    title: '岡山大学大学院進学見込み',
    description: '環境生命自然科学研究科計算機科学講座情報数理工学研究室',
  },
  {
    id: 2,
    date: '2026.03',
    title: '岡山大学卒業見込み',
    description: '情報工学コース',
  },
  {
    id: 3,
    date: '2022.04',
    title: '岡山大学入学',
    description: '工学部 情報・電気・数理データサイエンス系',
  },
];

export default function Experience() {
  return (
    // Skills, Worksと同じデザインスタイル
    <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-8 text-blue-400 flex items-center gap-2">
        Experience
      </h2>

      {/* タイムライン */}
      <div className="relative border-l-2 border-gray-600 ml-3 space-y-10">
        {experiences.map((item) => (
          <div key={item.id} className="relative pl-8">
            
            {/* 丸い点 */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-800 shadow-sm"></div>
            
            {/* 日付 */}
            <span className="block text-xs text-blue-300 font-mono mb-1 tracking-wide">
              {item.date}
            </span>

            {/* タイトル */}
            <h3 className="text-lg font-bold mb-2 text-white">
              {item.title}
            </h3>

            {/* 説明文 */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}