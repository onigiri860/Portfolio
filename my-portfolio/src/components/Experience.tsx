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
    <section className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-emerald-600 flex items-center gap-2">
        Experience
      </h2>

      {/* タイムライン */}
      <div className="relative border-l-2 border-emerald-200 ml-3 space-y-10">
        {experiences.map((item) => (
          <div key={item.id} className="relative pl-8">
            
            {/* 丸い点 */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm"></div>
            
            {/* 日付 */}
            <span className="block text-xs text-emerald-600 font-mono font-bold mb-1 tracking-wide">
              {item.date}
            </span>

            {/* タイトル */}
            <h3 className="text-lg font-bold mb-1 text-gray-900">
              {item.title}
            </h3>

            {/* 説明文 */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}