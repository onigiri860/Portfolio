import React from 'react';

type Kind = 'education' | 'presentation';

const experiences: { date: string; kind: Kind; title: string; description: string; upcoming?: boolean }[] = [
  {
    date: '2028.03',
    kind: 'education',
    title: '岡山大学大学院 修了見込み',
    description: '環境生命自然科学研究科',
    upcoming: true,
  },
  {
    date: '2026.10',
    kind: 'presentation',
    title: 'IW-FCV 2026 で発表',
    description: 'Fast Scene Parameter Estimation via Reconstruction Error Minimization Using a Non-Differentiable Renderer',
  },
  {
    date: '2026.08',
    kind: 'presentation',
    title: 'MIRU2026 で発表',
    description: '第29回 画像の認識・理解シンポジウム\n「非微分可能レンダラーによる再構成誤差を用いたシーンパラメータの高速推定」',
  },
  {
    date: '2026.04',
    kind: 'education',
    title: '岡山大学大学院 進学',
    description: '環境生命自然科学研究科 計算機科学講座 情報数理工学研究室',
  },
  {
    date: '2026.03',
    kind: 'education',
    title: '岡山大学 卒業',
    description: '工学部 情報工学コース',
  },
  {
    date: '2022.04',
    kind: 'education',
    title: '岡山大学 入学',
    description: '工学部 情報・電気・数理データサイエンス系',
  },
];

const kindStyle: Record<Kind, { label: string; badge: string; dot: string }> = {
  education: { label: '学歴', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  presentation: { label: '学会発表', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
};

export default function Experience() {
  return (
    <section className="bg-white/80 p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-emerald-600 flex items-center gap-2">Experience</h2>

      {/* タイムライン */}
      <div className="relative border-l-2 border-emerald-200 ml-3 space-y-10">
        {experiences.map((item) => {
          const style = kindStyle[item.kind];
          return (
            <div key={`${item.date}-${item.title}`} className={`relative pl-8 ${item.upcoming ? 'opacity-70' : ''}`}>
              {/* 丸い点（予定は白抜き） */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 shadow-sm ${
                  item.upcoming ? 'bg-white border-emerald-300' : `${style.dot} border-white`
                }`}
              />

              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-emerald-600 font-mono font-bold tracking-wide">{item.date}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
                {item.upcoming && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">予定</span>}
              </div>

              <h3 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
